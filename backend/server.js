import express from "express";
import session from "express-session";
import pg from "pg";
import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

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
