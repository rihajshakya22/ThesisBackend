import mongoose from "mongoose";

const rateSchema = mongoose.Schema(
  {
    rate: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Rate = mongoose.model("rate", rateSchema);

export default Rate;
