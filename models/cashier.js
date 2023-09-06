import mongoose from "mongoose";

const cashierSchema = new mongoose.Schema({
  adminID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cashierID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  parameter: {
    type: Number,
    default: 5000,
  },

  capital: {
    type: Number,
    default: 5000
  },
  NumberOfGame: {
    type: Number,
    default: 0,
  },

  numberOfwindfall: {
    type: Number,
    default: 0,
  },

  windfall: {
    type: Number,
    default: 0,
  },

  windfallProfit: {
    type: Number,
    default: 0,
  },

  weeklyProfit: {
    type: Number,
    default: 0,
  }
});

const Cashier = mongoose.model("Cashier", cashierSchema);

module.exports = Cashier;
