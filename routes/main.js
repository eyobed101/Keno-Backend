import express from "express";
import {authenticate} from "../services/auth.Services.js";
import AdminFunctions from "../controllers/Admin.Controller.js";
import 
 SuperFunctions
 from "../controllers/SuperAdmin.Controller.js";
import {admin, cashier, superadmin} from "../helpers/role.js";
import jwt from "../helpers/jwt.js";
import { Draw } from "../controllers/Game.Controller.js";

const router = express.Router();

// Routes
router.post("/login", async (req, res, next) => {
  try {
    const user = await authenticate(req.body);
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

router.post("/register", jwt(superadmin), async (req, res, next) => {
  try {
    const currentUser = req.user;

    if (currentUser.role !== superadmin) {
      return res.status(401).json({ message: "Not Authorized!" });
    }

    const user = await SuperFunctions.createAdmin(req.body);
    res.json({
      user: user,
      message: `User Registered successfully with email ${req.body.email}`,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/register/cashier", jwt(admin), async (req, res, next) => {
  try {
    const currentUser = req.user;

    if (currentUser.role !== admin) {
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

router.get("/getCashier", jwt(admin), async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (currentUser.role !== admin) {
      return res.status(401).json({ message: "Not Authorized!" });
    }
    const users = await AdminFunctions.getAllCashiers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});


router.get("/api/playkeno/draw", jwt(cashier), Draw)

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
