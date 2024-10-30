import Jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import Admin from "../models/adminModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.Jwt;
  if (token) {
    try {
      const decoded = Jwt.verify(token, process.env.JWT_SECRET);

      req.admin = await Admin.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized,no token");
  }
});
export { protect };
