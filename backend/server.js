import express from "express";
import session from "express-session";
import pg from "pg";
import multer from "multer";
import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import FormData from "form-data";

import nodemailer from "nodemailer";



dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

const PORT = process.env.PORT || 5000;
const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect()
  .then(() => console.log('PostgreSQL connected successfully'))
  .catch((err) => {
    console.error('Database connection error:', err.message);
    process.exit(1);
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});


const upload = multer({ storage: multer.memoryStorage() });

app.post("/predict", upload.single("image"), (req, res) => {
    try {
        const file = req.file;
        console.log("Received file:", file);
        // Call your prediction function here
        res.json({ type: "deterioration type predicted" });
    } catch (err) {
        res.status(500).send({ error: "Prediction failed" });
    }
});


app.post('/user/signup', async (req, res) => {
  try {
    const { name, dob, phoneno, email, password, gender } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (name, emailid, dob, password, phoneno, gender) VALUES ($1, $2, $3, $4, $5, $6)', 
      [name, email, dob, hashedPassword, phoneno, gender]
    );
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await db.query('SELECT * FROM users WHERE emailid = $1', [email]);
    
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'user not exists' });
    }
    
    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid user email or password' }),
      console.log('Incorrect email or Password');
    }
    res.json({ message: 'Login successful' });
    console.log('Login Sucess');
  } 
  catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/NGO/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await db.query('SELECT * FROM ngo WHERE emailid = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Admin not exists' });
    }
    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Incorrect email or Password');
      return res.status(401).json({ error: 'Invalid username or password' });
      
    }
    res.json({ message: 'Admin Login successful' });
  } catch (error) {
    console.error('Error admin logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/user/details', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await db.query('SELECT * FROM users WHERE emailid = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      name: user.name,
      emailID: user.emailid,
      dob: user.dob,
      phoneNo: user.phoneno,
      gender: user.gender
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/user/name', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await db.query('SELECT name FROM users WHERE emailid = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { name } = result.rows[0];
    res.json({ name });
  } catch (error) {
    console.error('Error fetching user name:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/user/track', async (req, res) => {
  try {
    const { id } = req.body;

    // Fetch entry from registry
    const registryResult = await db.query(
      'SELECT * FROM registry WHERE id = $1',
      [id]
    );

    if (registryResult.rows.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const entry = registryResult.rows[0]; // Get registry entry

    // Convert image to base64
    if (entry.image) {
      entry.image = Buffer.from(entry.image).toString('base64');
    }

    // Fetch applicant's name from users table
    const userResult = await db.query(
      'SELECT name FROM users WHERE emailid = $1',
      [entry.email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    entry.applicantName = userResult.rows[0].name; // Add applicant name

    res.json({ entry });
  } catch (error) {
    console.error('Error fetching entry details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.get('/user/previousHistory', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
   
    const query = `
      SELECT id, location, type, ngo, status 
      FROM registry 
      WHERE email = $1 
      ORDER BY id ASC;
    `;
    const result = await db.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No records found for the provided email' });
    }

   
    res.json({ history: result.rows });
  } catch (error) {
    console.error('Error fetching user history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/ngo/info', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Step 1: Fetch NGO name from ngo table using email
    const ngoQuery = `
      SELECT name 
      FROM ngo 
      WHERE emailid = $1;
    `;
    const ngoResult = await db.query(ngoQuery, [email]);

    // Check if NGO is found
    if (ngoResult.rows.length === 0) {
      return res.status(404).json({ error: 'NGO not found for the provided email' });
    }

    const ngoName = ngoResult.rows[0].name;

    // Step 2: Fetch completed and pending counts from registry table
    const registryQuery = `
      SELECT 
      COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_count,
      COUNT(CASE WHEN status != 'completed' THEN 1 END) AS pending_count
      FROM registry
      WHERE ngo = $1;
    `;
    const registryResult = await db.query(registryQuery, [ngoName]);

    // Send response
    res.json({
      ngoName: ngoName,
      completedCount: registryResult.rows[0].completed_count,
      pendingCount: registryResult.rows[0].pending_count,
    });

  } catch (error) {
    console.error('Error fetching NGO info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch unassigned entries based on NGO's restore attribute
app.get('/ngo/notifications', async (req, res) => {
  const { email } = req.query;

  try {
    // Step 1: Fetch NGO name and restore values
    const ngoQuery = `
      SELECT name, restore 
      FROM ngo 
      WHERE emailid = $1
    `;
    const ngoResult = await db.query(ngoQuery, [email]);

    if (ngoResult.rows.length === 0) {
      return res.status(404).json({ error: 'NGO not found' });
    }

    const { name, restore } = ngoResult.rows[0];
    const restoreTypes = restore.split(',').map(type => type.trim());

    // Step 2: Fetch unassigned entries in registry matching the restore types
    const registryQuery = `
      SELECT id, location, type, status 
      FROM registry 
      WHERE ngo IS NULL AND type = ANY($1::text[])
      ORDER BY id ASC
    `;
    const registryResult = await db.query(registryQuery, [restoreTypes]);

    res.json({ name, entries: registryResult.rows });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/ngo/get-image', async (req, res) => {
  const { id } = req.query;

  try {
    const result = await db.query(
      'SELECT image FROM registry WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const imageBuffer = result.rows[0].image;
    const base64Image = imageBuffer.toString('base64');
    
    res.json({ image: base64Image });
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Confirm and assign NGO to selected entries
app.post('/ngo/assign', async (req, res) => {
  const { email, selectedIds } = req.body;

  try {
    // Fetch NGO name
    const ngoResult = await db.query(
      `SELECT name FROM ngo WHERE emailid = $1`, 
      [email]
    );

    if (ngoResult.rows.length === 0) {
      return res.status(404).json({ error: 'NGO not found' });
    }

    const { name } = ngoResult.rows[0];

    // Prevent concurrent assignments and update status
    const updateQuery = `
      UPDATE registry
      SET ngo = $1, status = 'ngo assigned'
      WHERE id = ANY($2::text[])
      AND ngo IS NULL
    `;

    const result = await db.query(updateQuery, [name, selectedIds]);

    // Check if any rows were updated
    if (result.rowCount === 0) {
      return res.status(409).json({ error: 'Entries already assigned to another NGO' });
    }

    res.json({ message: 'Entries assigned successfully' });
  } catch (error) {
    console.error('Error assigning NGO:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/ngo/update-status', async (req, res) => {
  const { email } = req.query;

  try {
    // Fetch NGO name
    const ngoResult = await db.query('SELECT name FROM ngo WHERE emailid = $1', [email]);
    if (ngoResult.rows.length === 0) {
      return res.status(404).json({ error: 'NGO not found' });
    }

    const { name } = ngoResult.rows[0];

    // Fetch registry entries for the NGO
    const entriesResult = await db.query(
      `SELECT id, location, type, status FROM registry
       WHERE ngo = $1 AND status != 'completed'`,
      [name]
    );

    res.json({ ngoName: name, entries: entriesResult.rows });
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/ngo/update-status', async (req, res) => {
  const { email, id, newStatus } = req.body;

  try {
    // Fetch NGO name
    const ngoResult = await db.query('SELECT name FROM ngo WHERE emailid = $1', [email]);
    if (ngoResult.rows.length === 0) {
      return res.status(404).json({ error: 'NGO not found' });
    }

    const { name } = ngoResult.rows[0];

    // Check if entry belongs to NGO
    const checkResult = await db.query(
      `SELECT * FROM registry WHERE id = $1 AND ngo = $2 AND status != 'completed'`,
      [id, name]
    );

    if (checkResult.rows.length === 0) {
      return res.status(400).json({ error: 'Entry not available for update' });
    }

    // Update status
    await db.query(
      `UPDATE registry SET status = $1 WHERE id = $2`,
      [newStatus, id]
    );

    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// app.post('/ngo/new-application', async (req, res) => {
//   const { email, type, location } = req.body;

//   try {
//       // Insert data into registry table
//       await db.query(
//           `INSERT INTO registry (email, type, location)
//            VALUES ($1, $2, $3)`,
//           [email, type, location]
//       );

//       res.json({ message: 'Application submitted successfully' });
//   } catch (error) {
//       console.error('Error inserting application:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


app.post('/ngo/new-application', upload.single("image"), async (req, res) => {
    try {
        const { email, location, type } = req.body;
        const image = req.file ? req.file.buffer : null; // Store image as a buffer

        // Insert into registry table
        await db.query(
            `INSERT INTO registry (email, location, type, image, status) VALUES ($1, $2, $3, $4, 'pending')`,
            [email, location, type, image]
        );

        // Fetch NGOs with matching restore column
        const ngo = await db.query(
            `SELECT emailid FROM "ngo" WHERE restore = $1`,
            [type]
        );

        if (ngo.rows.length > 0) {
            // Extract NGO emails
            const ngoEmails = ngo.rows.map(row => row.emailid);

            // Send email notification
            await sendEmailToNGOs(ngoEmails, type, location);
        }

        res.status(201).json({ message: "Application submitted and NGOs notified" });
    } catch (error) {
        console.error("Error inserting application:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Function to send emails using Nodemailer
async function sendEmailToNGOs(recipients, type, location) {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "restor.monument@gmail.com", // Replace with your email
            pass: "ewpp jyen kxrv akce"  // Use an app password if 2FA is enabled
        }
    });

    let mailOptions = {
        from: "restor.monument@gmail.com",
        to: recipients.join(","), // Send email to multiple NGOs
        subject: `Urgent: New Application for ${type} Restoration`,
        text: `Hello, \n\nA new application has been submitted for restoring: ${type}.\nLocation: ${location}.\n\nPlease log in to your dashboard for further details.\n\nBest Regards,\nNGO Management System`
    };
    try {
      let info = await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent successfully to: ${recipients.join(", ")}`);
    } catch (error) {
        console.error(`❌ Error sending email: ${error}`);
    }

    await transporter.sendMail(mailOptions);
}



app.post('/siteAdmin', async (req, res) => {
  const { name, emailid, password, restore } = req.body;

  try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert NGO into database
      await db.query(
          'INSERT INTO ngo (name, emailid, password, restore) VALUES ($1, $2, $3, $4)',
          [name, emailid, hashedPassword, restore]
      );

      res.status(201).json({ message: 'NGO added successfully' });
  } catch (error) {
      console.error('Error inserting NGO:', error);
      res.status(500).json({ error: 'Failed to insert NGO' });
  }
});

app.post('/user/forget-password', async (req, res) => {
  const { email, dob, password } = req.body;

  try {
      // Validate email and DOB
      const userResult = await db.query(
          "SELECT * FROM users WHERE emailid = $1 AND dob = $2",
          [email, dob]
      );

      if (userResult.rows.length === 0) {
          return res.status(404).json({ error: "Invalid credentials" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update password
      await db.query(
          "UPDATE users SET password = $1 WHERE emailid = $2",
          [hashedPassword, email]
      );

      res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/admin/login", async (req, res) => {
  const { id, password } = req.body;

  try {
      const result = await db.query("SELECT password FROM admin WHERE id = $1", [id]);

      if (result.rows.length === 0) {
          return res.status(404).json({ message: "Admin not found" });
      }

      const hashedPassword = result.rows[0].password;
      const isValidPassword = await bcrypt.compare(password, hashedPassword);

      if (isValidPassword) {
          res.status(200).json({ message: "Login successful" });
      } else {
          res.status(401).json({ message: "Invalid credentials" });
      }
  } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Server error" });
  }
});