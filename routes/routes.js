import express from "express";
import authServices from "../services/auth.Services";
import {
  createCashier,
  getAllCashiers,
} from "../controllers/Admin.Controller.js";
import {
  createAdmin,
  getAllAdmins,
} from "../controllers/SuperAdmin.Controller.js";
import Role from "../helpers/role";
import jwt from "../helpers/jwt";

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

router.post("/register", jwt(Role.SuperAdmin), async (req, res, next) => {
  try {
    const currentUser = req.user;

    if (currentUser.role !== Role.SuperAdmin) {
      return res.status(401).json({ message: "Not Authorized!" });
    }

    const user = await createAdmin(req.body);
    res.json({
      user: user,
      message: `User Registered successfully with email ${req.body.email}`,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/register/cashier", jwt(Role.Admin), async (req, res, next) => {
  try {
    const currentUser = req.user;

    if (currentUser.role !== Role.Admin) {
      return res.status(401).json({ message: "Not Authorized!" });
    }

    const user = await createCashier(req.body);
    res.json({
      user: user,
      message: `Cashier User Registered successfully with email ${req.body.email}`,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/getCashier", jwt(Role.Admin), async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (currentUser.role !== Role.Admin) {
      return res.status(401).json({ message: "Not Authorized!" });
    }
    const users = await getAllCashiers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

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
