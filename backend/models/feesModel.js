import mongoose from "mongoose";

const FeesDataSchema = new mongoose.Schema(
  {
    amount: {
      type: String,
      required: true,
    },
    receiptNo: {
      type: String,
      required: true,
    },
      month: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    parentVerified: {
      type: Boolean,
      required: true,
    },
    swadarVerified: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const FeesSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to another model
    ref: "Student", // Reference model name
    required: true,
  },
  feesData: [FeesDataSchema],
});

const Fees = mongoose.model("Fees", FeesSchema);

export default Fees;
