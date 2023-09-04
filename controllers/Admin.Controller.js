import Admin from "../models/admin";
import Cashier from "../models/cashier";
import User from "../models/users";

// Create a new cashier
const createCashier = async (req, res) => {
  try {
    // Extract the required data from the request body
    const { parameter, capital } = req.body;
    // Create a new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role: "cashier", // Set the role as cashier
    });

    const savedUser = await user.save();

    // Create a new Cashier instance
    const cashier = new Cashier({
        adminID: req.user._id, // Assuming you have authentication middleware to get the current user
        cashierID: savedUser._id,
        parameter,
        capital,
    });

    // Save the admin to the database
    await cashier.save();

    // Update the superadmin's NumberOfAdmin field
    const admin = await Admin.findOne({ adminID: req.user._id });
    Admin.NumberOfShop += 1;
    await admin.save();

    res.status(201).json({ message: "Cashier created successfully", cashier });
  } catch (error) {
    res.status(500).json({ error: "Failed to create Cashier" });
  }
};

const getAllCashiers = async (req, res) => {
  try {
    const cashiers = await Admin.find({ adminID: req.user._id }).populate(
      "cashierID"
    );

    res.status(200).json(cashiers);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve Cashiers" });
  }
};


// Other route handlers for admin can be defined similarly

export default { createCashier, getAllCashiers };
