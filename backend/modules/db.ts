import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectToDatabase = () => {
  const mongoUri: string = process.env.MONGO_URI || "";
  mongoose
    .connect(mongoUri)
    .then(() => console.log("Connected to Database"))
    .catch((err) => console.error(`Error: ${err}`));
}
