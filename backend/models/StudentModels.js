import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const StudentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  fatherName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },

  standard: {
    type: Number,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});



const Student = mongoose.model('Student', StudentSchema);
export default Student;
