
import configure from '../config/index.js';
import mongoose from "mongoose";
import User from "../models/users.js";

const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connect = async () => {
  try {
    mongoose
      .connect(
       configure.mongoUri,
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
