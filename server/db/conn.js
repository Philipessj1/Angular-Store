import mongoose from "mongoose";

// DB Credentials
const dbUserName = process.env.DB_USER_NAME;
const dbUserPass = process.env.DB_USER_PASS;

const uri = `mongodb+srv://${dbUserName}:${dbUserPass}@angular-cluster.f4z6n.mongodb.net/?retryWrites=true&w=majority&appName=Angular-cluster`;

// Connecting to DB
const main = async () => {
  try {
    await mongoose.connect(uri);

    console.log("Connected to Database!!");
  } catch (error) {
    console.log("Error: " + error);
  }
};

export default main;
