import mongoose, { Schema } from "mongoose";
import IProductFamily from "../interfaces/productFamily";

const ProductFamilySchema = new Schema(
  {
    productFamily: {
      type: String,
      required: true,
      unique: false,
    },
    productType: {
      type: Schema.Types.ObjectId,
      ref: "productType",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProductFamily>(
  "productFamily",
  ProductFamilySchema
);
