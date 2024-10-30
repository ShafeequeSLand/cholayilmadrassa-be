import asyncHandler from "express-async-handler";
import Student from "../models/StudentModels.js";
import Fees from "../models/feesModel.js";
import generateToken from "../utils/generateToken.js";
import dotenv from "dotenv";
import cloudinary from "../utils/cloudinary.js";
dotenv.config();

// @desc Authenticate user and set token
// @route POST /api/users/auth
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { username, dateofBirth } = req.body;
  console.log(username,dateofBirth)
  const student = await Student.findOne({ username,dob:dateofBirth });
 

  if (student) {
    generateToken(res, student._id);
    res.status(200).json({
      _id: student._id,
      username: student.username,
      name: student.name,
      fatherName: student.fatherName,
      standard: student.standard,
      address: student.address,
      dob: student.dob,
      phone: student.phone,
    });
  } else {
    res.status(400);
    throw new Error("Invalid username or Date of Birth");
  }
});

// @desc Register a new user
// @route POST /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, username, dob, fatherName, address, standard } = req.body;
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
  });

  if (student) {
    generateToken(res, student._id);
    res.status(201).json({
      _id: student._id,
      name: student.name,
      username: student.username,
      fatherName: student.fatherName,
      address: student.address,
      dob: student.dob,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc Logout user
// @route POST /api/users/logout
// @access Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("Jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User logged out" });
});

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };
  res.status(200).json(user);
});

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.file) {
      try {
        // Delete the old image from Cloudinary
        if (user.public_id) {
          await cloudinary.uploader.destroy(user.public_id);
        }

        // Update new image and public ID
        user.image = req.file.path;
        user.public_id = req.file.filename;
      } catch (error) {
        console.error("Error updating image:", error);
        res.status(500);
        throw new Error("Error updating image");
      }
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
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

const verifyFees = async (req, res) => {
  try {
    const { id, userId } = req.params;
    console.log(id,userId,'dfdf');
    

    // Update the specific entry within feesData for the given studentId and entry id
    const verified = await Fees.updateOne(
      { studentId: userId, "feesData._id": id },
      { $set: { "feesData.$.parentVerified": true } } // Set the specific entry as verified
    );

    if (verified.nModified === 0) {
      return res.status(404).json({ message: "Fee entry not found or already verified." });
    }

    res.status(200).json({ message: "Fee successfully verified." });
  } catch (error) {
    console.error("Error verifying fee:", error.message);
    res.status(500).json({ message: "Server error. Could not verify fee." });
  }
};


export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  getFeesData,
  updateUserProfile,
  verifyFees
};
