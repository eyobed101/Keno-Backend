import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from '../config/index.js';
import db from "../helpers/db.js";

const User = db.User;

// This will authenticate the user credentials
const authenticate = async ({ email, password }) => {
  // Find the user using email
  const user = await User.findOne({ email });
  console.log("user model", user);

  // If user is truthy then sign the token
  if (user && bcrypt.compareSync(password, user.password)) {
    
    const token = jwt.sign({ sub: user.id, role: user.role }, config.secret, {
      expiresIn: "1d",
    });

    return { ...user.toJSON(), token };
  }
};

// // Retrieving all users
// const getAll = async () => {
//   return await User.find();
// };

// // Retrieving user using id
// const getById = async (id) => {
//   console.log("finding id: ", id);
//   return await User.findById(id);
// };

// // Adding user to db
// const create = async (userParam) => {
//   // Check if user exists
//   const user = await User.findOne({ email: userParam.email });

//   // Validate
//   if (user) throw `This email already exists: ${userParam.email}`;

//   // Create user object
//   const newUser = new User(userParam);
//   if (userParam.password) {
//     newUser.password = bcrypt.hashSync(userParam.password, 10);
//   }

//   await newUser.save();
// };

// const update = async (id, userParam) => {
//   console.log(id, userParam);
//   const user = await User.findById(id);
//   console.log(user.email, userParam.email);

//   // Validate the id and email
//   if (!user) throw "User not found.";
//   if (
//     user.email !== userParam.email &&
//     (await User.findOne({ email: userParam.email }))
//   ) {
//     throw `User with email ${userParam.email} already exists.`;
//   }

//   // Convert the password to hash
//   if (userParam.password) {
//     userParam.password = bcrypt.hashSync(userParam.password, 10);
//   }

//   // Copy the user object
//   Object.assign(user, userParam);
//   await user.save();
// };

// const _delete = async (id) => {
//   await User.findByIdAndRemove(id);
// };

// export { authenticate, getAll, getById, create, update, _delete as delete };
export { authenticate};
