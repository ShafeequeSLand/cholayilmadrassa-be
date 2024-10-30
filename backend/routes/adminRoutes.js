import { fileURLToPath } from "url";
import express from "express";
import path from "path";
import {imageUpload} from '../utils/multer.js'
const router = express.Router();
import {
  authAdmin,
  logoutAdmin,
  userList,
  registerUser,
  getAdminProfile,
  deleteUser,
  updateAdminProfile,
  addFeesStudents,
  getFeesData
} from "../controllers/adminController.js";


import { protect } from "../middleware/authMiddlewareAdmin.js";



router.post("/auth", authAdmin);
router.post("/logout", protect,logoutAdmin);
router.delete('/deleteuser',protect,deleteUser)
router.get('/user-list',protect, userList)
router.post("/adduser",protect,  registerUser);
router.post("/edituser",protect,  updateAdminProfile);
router.post("/addfeesstudent",protect,  addFeesStudents);
router.get('/getfeesdata/:id',protect, getFeesData)

export default router;
