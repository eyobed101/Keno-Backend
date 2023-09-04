import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String, 
    unique: true, 
    required: true 
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["cashier", "admin", "superadmin"],
    default: "cashier",
  },
  createdDate: {
    type: Date, 
    default: Date.now 
  },
});

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id, delete ret.password;
  },
});

export default mongoose.model("User", userSchema);


