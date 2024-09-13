import express from 'express';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const app = express();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {

    console.log(`App running on port: ${PORT}`); 
})