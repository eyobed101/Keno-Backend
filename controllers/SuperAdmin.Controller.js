import Superadmin from "../models/superAdmin" 
import Admin from "../models/admin" 
import User from "../models/users" 




// Create a new admin
const createAdmin = async (req, res) => {
  try {
    // Extract the required data from the request body
    const { NumberOfShop, Revenue, Odd } = req.body;

    // Create a new user
    const user = new User({
        firstName,
        lastName,
        email,
        password,
        role: "admin", // Set the role as admin
      });
    
      const savedUser = await user.save();

    // Create a new admin instance
    const admin = new Admin({
      superadminID: req.user._id, // Assuming you have authentication middleware to get the current user
      adminID: savedUser._id,
      NumberOfShop,
      Revenue,
      Odd,
    });

    // Save the admin to the database
    await admin.save();

    // Update the superadmin's NumberOfAdmin field
    const superadmin = await Superadmin.findOne({ superadminID: req.user._id });
    Superadmin.NumberOfAdmin += 1;
    await superadmin.save();

    res.status(201).json({ message: "Admin created successfully", admin });
  } catch (error) {
    res.status(500).json({ error: "Failed to create admin" });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({ superadminID: req.user._id }).populate(
      "adminID"
    );

    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve admins" });
  }
};

export const updateAdminOddEnum = async (req, res) => {
    try {
      const { adminId, oddEnum } = req.body;
  
      // Find the admin by adminId
      const admin = await Admin.findById(adminId);
  
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
  
      // Update the enum values of the "Odd" field
      admin.Odd.enum = oddEnum;
  
      // Save the updated admin to the database
      const updatedAdmin = await admin.save();
  
      res.status(200).json(updatedAdmin);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  




// Other route handlers for superadmin can be defined similarly

export default { createAdmin , getAllAdmins};
