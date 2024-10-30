import asyncHandler from "express-async-handler";
import Admin from "../models/adminModel.js";
import Student from "../models/StudentModels.js";
import Fees from "../models/feesModel.js";
import cloudinary  from '../utils/cloudinary.js'
import generateToken from "../utils/generateToken.js";

import { json } from "express";


// @desc Auth Admin/set token
// route POST /api/admins/auth
// @ access Pubilc
const authAdmin = asyncHandler(async (req, res) => {


  const { email, password } = req.body;

  console.log(email, password);
  const admin = await Admin.findOne({ email });
  if (admin && (await admin.matchPassword(password))) {
    generateToken(res, admin._id);
    
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      image: admin.image,
    });
  
  } else {
  
    res.status(400);
    throw new Error("invalid Email and Password");
  }
});

const userList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 4, key = "" } = req.query;

  const student = await Student.find({
    name: { $regex: new RegExp(`^${key}`, "i") },
  })
    .sort({ updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
   
  const totalUser = await Student.countDocuments();
  const lastPage = Math.ceil(totalUser / limit);
  res.status(200).json({
    page,
    users:student,
    lastPage,
  });
});


// @desc Auth user/a new user
// route POST /api/users/register
// @ access Pubilc

const registerUser = asyncHandler(async (req, res) => {
  const { name, username, dob, fatherName, address, standard ,phone} = req.body;
console.log(req.body)
  const studentExist = await Student.findOne({ username });

  if (studentExist) {
    res.status(400);
    throw new Error("User already exists");
  }

  const student = await Student.create({
    name,
    username,
    dob,
    standard,
    fatherName,
    address,
    phone
  });

  if (student) {
  
    res.status(201).json({
      _id: student._id,
      name: student.name,
      username: student.username,
      fatherName: student.fatherName,
      address: student.address,
      dob: student.dob,
      phone:student.phone
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc Auth Admin/logout Admin
// route POST /api/Admins/logout
// @ access Pubilc
const logoutAdmin = asyncHandler(async (req, res) => {
  res.cookie("Jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  console.log("Admin Logged Out");
  res.status(200).json({ message: " Admin Logged Out" });
});

// @desc get AdminProfile
// route get /api/Admins/profile
// @ access private
const getAdminProfile = asyncHandler(async (req, res) => {
  const Admin = {
    _id: req.Admin._id,
    name: req.Admin.name,
    email: req.Admin.email,
  };
  res.status(200).json({ Admin });
});

// @desc Update AdminProfile
// route PUT /api/Admins/profile
// @ access private
const updateAdminProfile = asyncHandler(async (req, res) => {
  const { id ,
     name,
    username,
    dob,
    standard,
    fatherName,
    address,
    phone } = req.body
  console.log(req.body)
  const user = await Student.findById(id);
  if (user) {
    console.log({ id, name,  });
    user.name = name || user.name;
    user.username = username || user.username;
    user.dob = dob || user.dob;
    user.standard =standard || user.standard;
    user.fatherName = fatherName || user.fatherName;
    user.address = address || user.address
    user.phone = phone || user.phone;

 
    const updateAdmin = await user.save();

    res.status(200).json({
      _id: updateAdmin._id,
      name: updateAdmin.name,
      email: updateAdmin.email,
      image: updateAdmin.image,
    });
  } else {
    res.status(404);
    throw new Error("Admin Not Found");
  }
  res.status(200).json({ message: "update  Admin profile" });
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.body.id; 
  console.log('hello',userId);
  try {

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
     
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {

    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});
const addFeesStudents = asyncHandler(async (req, res) => {
  const { id, name, amount, month,date, receiptNo, swadarVerified } = req.body;
  console.log(req.body, 'Received data');

  // Prepare the data to be pushed into feesData array
  const data = {
    amount,
    name,
    date,
    receiptNo,
    month,
    swadarVerified
  };

  try {
    // Update the Fees document for the specified studentId by pushing new data to feesData array
    // Use upsert: true to create a new document if one does not exist
    const feesSaved = await Fees.updateOne(
      { studentId: id }, // Filter by studentId
      { $push: { feesData: data } },
      { upsert: true }
    );

    // If the operation was acknowledged, return a success response
    res.status(200).json({ data: feesSaved });
  } catch (error) {
    // Send an error response if any issues arise
    res.status(500).json({ message: "Error updating or creating fees data", error: error.message });
  }
});


const getFeesData = async(req,res)=>{
  try {
    const id = req.params.id
    const findData= await Fees.findOne({studentId:id})

    if (findData) {
      res.status(200).json({
        data:findData
      })
    }
  } catch (error) {
    console.log(error.message);
    
  }
}

export { authAdmin, registerUser,logoutAdmin, userList,deleteUser,addFeesStudents, getAdminProfile, updateAdminProfile,getFeesData };
