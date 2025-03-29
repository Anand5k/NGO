import express from "express";

import bodyParser from "body-parser";
import pg from "pg";
import dotenv from 'dotenv';



//const express = require('express');
//co0nst bodyParser = require('body-parser');
import cors from 'cors';
import bcrypt from 'bcrypt';
const app = express();
//const { Pool, Connection } = require('pg');
dotenv.config();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
})
db.connect()
    .then(() => console.log('postgreSQL connected'))
    .catch(err => console.error('Error',err.stack));


/*const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
let islogin = false;
const db = new pg.Client({
  user: PGUSER,
  host: PGHOST,
  database: PGDATABASE,
  password: PGPASSWORD,
  port: 5432,
  ssl:{
    require:true

});
db.connect(); */

/* const Client = new pg.Client({
  ConnectionString: postgresql://NSS_owner:OZ1FfA7XRnkr@ep-bold-haze-a14k7ohz.ap-southeast-1.aws.neon.tech/NSS?sslmode=require
}); */



app.post('/signup', async (req, res) => {
  try {
    const { name, rollno, gender , dob, phoneno, email,  password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO volunteers (name , volunteer_id, gender , date_of_birth,  email, password ) VALUES ($1, $2, $3, $4, $5, $6)', [name, rollno, gender , dob,  email, hashedPassword]);
    await db.query('INSERT INTO contact (contact_id,phone_no)  values ($1,$2) ',[rollno,phoneno]);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/forgetPassword', async (req, res) => {
  try {
    const {  rollno,   email,  password } = req.body;
    const result = await db.query('SELECT * FROM volunteers WHERE volunteer_id = $1 and email = $2', [rollno,email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'user not exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('UPDATE volunteers set password=$3 where volunteer_id=$1 and email=$2 ', [rollno, email, hashedPassword,]);
    console.log('changed succesfully');
    res.status(201).json({ message: 'User Password updated successfully' });
  } catch (error) {
    console.error('Error changing password up:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { rollno, password } = req.body;
    const result = await db.query('SELECT * FROM volunteers WHERE volunteer_id = $1', [rollno]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'user not exists' });
    }
    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' }),
      console.log('Incorrect Rollno or Password');
    }
    res.json({ message: 'Login successful' });
    console.log('Login Sucess');
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/Adlogin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await db.query('SELECT * FROM program_officers WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Admin not exists' });
    }
    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' }),
      console.log('Incorrect Rollno or Password');
    }
    res.json({ message: 'Admin Login successful' });
    console.log('Admin Login Sucess');
  } catch (error) {
    console.error('Error admin logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const response=db.query("SELECT * FROM unit");
console.log(response);