import express from "express";
import authServices from "../services/auth.Services.js";
import 
  AdminFunctions
 from "../controllers/Admin.Controller.js";
import 
  SuperAdminFunctions
from "../controllers/SuperAdmin.Controller.js";
import Role from "../helpers/role.js";
import verifyToken from "../helpers/jwt.js";
import { Draw } from "../controllers/Game.Controller.js";



const router = express.Router();

// Routes
router.post("/login", async (req, res, next) => {
  try {
    const user = await authServices.authenticate(req.body);
    console.log(user);
    if (user) {
      res.json({ user: user, message: "User logged in successfully" });
    } else {
      res.status(400).json({ message: "Username or password is incorrect." });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/register", verifyToken(Role.superadmin), async (req, res, next) => {
  try {
    const currentUser = req.user;

    if (currentUser.role !== Role.superadmin) {
      return res.status(401).json({ message: "Not Authorized!" });
    }

    const user = await SuperAdminFunctions.createAdmin(req.body);
    res.json({
      user: user,
      message: `User Registered successfully with email ${req.body.email}`,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/register/cashier", verifyToken(Role.admin), async (req, res, next) => {
  try {
    const currentUser = req.user;

    if (currentUser.role !== Role.admin) {
      return res.status(401).json({ message: "Not Authorized!" });
    }

    const user = await AdminFunctions.createCashier(req.body);
    res.json({
      user: user,
      message: `Cashier User Registered successfully with email ${req.body.email}`,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/getCashier", verifyToken(Role.admin), async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (currentUser.role !== Role.admin) {
      return res.status(401).json({ message: "Not Authorized!" });
    }
    const users = await AdminFunctions.getAllCashiers();
    res.json(users);
  } catch (error) {
    next(error);
  }
}); 

router.get("/play/keno/draw", verifyToken(Role.cashier), Draw)


// router.post('/superadmins', async (req, res) => {
//   // ET_Keno@101Test
//   // Retrieve the necessary data from the request body
//   const { firstName, lastName, email, password } = req.body;

//   try {
//       // Generate a salt for password hashing
//       const salt = await bcrypt.genSalt(10);

//       // Hash the password using the generated salt
//       const hashedPassword = await bcrypt.hash(password, salt);

//       // Create a new user instance
//       const newUser = new User({
//           firstName,
//           lastName,
//           email,
//           password: hashedPassword, // Save the hashed password
//           role: 'superadmin' // Set the role as 'superadmin' for the new user
//       });

//       // Save the user to the database
//       const savedUser = await newUser.save();

//       // Create a new superadmin instance using the saved user's ID
//       const newSuperadmin = new Superadmin({
//           superadminID: savedUser._id,
//           NumberOfAdmin: 0 // Set the number of admins as required
//       });

//       // Save the superadmin to the database
//       await newSuperadmin.save();

//       res.status(201).json({ message: 'Superadmin created successfully' });
//   } catch (error) {
//       res.status(500).json({ error: 'Error creating superadmin' });
//   }
// });

  

// router.get("/current", jwt(), async (req, res, next) => {
//   try {
//     console.log(req);
//     const user = await userServices.getById(req.user.sub);
//     if (user) {
//       res.json(user);
//     } else {
//       res.status(404);
//     }
//   } catch (error) {
//     next(error);
//   }
// });

// router.get("/:id", async (req, res, next) => {
//   try {
//     const user = await userServices.getById(req.params.id);
//     if (!user) {
//       res.status(404).json({ message: "User Not Found!" });
//       next();
//     } else {
//       res.json(user);
//     }
//   } catch (error) {
//     next(error);
//   }
// });

// router.put("/:id", async (req, res, next) => {
//   try {
//     await userServices.update(req.params.id, req.body);
//     res.json({
//       message: `User with id: ${req.params.id} updated successfully.`,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// router.delete("/:id", async (req, res, next) => {
//   try {
//     await userServices.delete(req.params.id);
//     res.json({
//       message: `User with id: ${req.params.id} deleted successfully.`,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

export default router;
