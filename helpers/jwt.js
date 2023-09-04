import expressJwt from "express-jwt";
import config from "../config/config.json";
import db from "./db";

const jwt = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }
  const secret = config.secret;

  return [
    expressJwt({ secret, algorithms: ["HS256"] }),
    async (req, res, next) => {
      const user = await db.User.findById(req.user.sub);

      if (!user || (roles.length && !roles.includes(user.role))) {
        return res.status(401).json({ message: "Only Admin is Authorized!" });
      }

      req.user.role = user.role;
      next();
    },
  ];
};

export default jwt;
