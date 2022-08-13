import mongoose, { Schema } from "mongoose";
import IProductType from "../interfaces/productType";

const ProductTypeSchema = new Schema(
  {
    productType: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProductType>("productType", ProductTypeSchema);
