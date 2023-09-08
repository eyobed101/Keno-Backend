import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  superadminID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  adminID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  NumberOfShop: {
    type: Number,
    default: 1
  },

  Revenue: {
    type: Number,
    required: true
  },

  Odd : {
    type : Number,
    enum: ["Minimal", "Low", "Moderate", "High", "Maximum"],
    default: "Low", 
  }
  
});

export default mongoose.model('Admin', adminSchema);

