import mongoose from "mongoose";

const dbconnect = async () => {
  try {
    await mongoose.connect(process.env.DBURL);
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Error in database connection:", error);
    process.exit(1);  
  }
};

export default dbconnect;
