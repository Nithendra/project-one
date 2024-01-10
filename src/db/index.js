import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const dbInstance = await mongoose.connect(
      `${process.env.MONGOOSE_URI}/${process.env.DB_NAME}`
    );
    console.log("DB connected successfully:::", dbInstance.connection.host);
  } catch (error) {
    console.log("DB conection failed:::", error);
    process.exit(1);
  }
};

export default connectDB;
