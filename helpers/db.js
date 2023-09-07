import config from '../config/index.js';
import mongoose from "mongoose";
import User from "../models/users.js";

const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

const connect = async () => {
  try {
    mongoose
      .connect(
        process.env.MONGODB_URI || config.connectionString,
        connectionOptions
      )
      .then((res) => console.log("MongoDB connected successfully!"));
  } catch (error) {
    console.log("MongoDB Error:", error.message);
    process.exit(1);
  }

  mongoose.Promise = global.Promise;
};

export default {User , connect};
