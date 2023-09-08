import config from '../config/index.js';
import db from "./db.js";
// import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";




// const jwt = (roles = []) => {
//   if (typeof roles === "string") {
//     roles = [roles];
//   }
//   const secret = config.secret;
//   console.log("Abebe")
//   return [
//     expressjwt({ secret, algorithms: ["HS256"] }),
//     async (req, res, next) => {
//       console.log("Kebede")

//       const user = await db.User.findById(req.user.sub);
//       console.log(user)

//       if (!user || (roles.length && !roles.includes(user.role))) {
//         return res.status(401).json({ message: "Only Admin is Authorized!" });
//       }

//       req.user.role = user.role;
//       next();
//     },
//   ];
// };


const verifyToken = (role) => {
  const secret = config.secret;
  try {
    const decodedToken = jwt.verify(req.headers.token, secret);
    if (role && decodedToken.role !== role) {
      console.log("Invalid role for the token");
      
    }
    
    return decodedToken;
  } catch (error) {
    console.log("Invalid token");
   
 
  }
};

export default verifyToken;