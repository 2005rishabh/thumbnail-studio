import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("Mongodb connected");
        });
        await mongoose.connect(process.env.MONGODB_URI as string);
    } catch (error) {
        console.error("Error connecting to mongodb", error);
    }
}

export default connectDB;