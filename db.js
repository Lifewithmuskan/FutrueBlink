import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {
    try {
  await mongoose.connect(process.env.MONGO_URI);
        console.log("connect with mongodb");
    } catch (err) {
        console.log("database connection fail");
    }
};

export default connectDB;