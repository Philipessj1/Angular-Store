import express from 'express';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const app = express();

const PORT = process.env.PORT || 8000;

// DB Credentials
const URI = process.env.DB_URI;

// Connecting to DB
mongoose
    .connect(URI)
    .then(() => {

        console.log('Connected to DB!');

        app.listen(PORT, () => console.log(`App running on port: ${PORT}`));
    })
    .catch(err => console.log(err));

