import mongoose, { Schema } from "mongoose";
import IFilter from "../interfaces/filter";

const FilterSchema = new Schema(
  {
    filter: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IFilter>("Filter", FilterSchema);
