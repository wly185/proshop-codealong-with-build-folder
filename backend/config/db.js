import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true
    });
    console.log(`mongoose connected ${conn.connection.host}`);
  } catch (err) {
    console.log(`error:${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
