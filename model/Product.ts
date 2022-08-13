import mongoose, { Schema } from "mongoose";
import IProduct from "./../interfaces/product";
import changeNoToRanges from "../utils/changeNoToRanges";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    productType: {
      type: Schema.Types.ObjectId,
      ref: "productType",
    },
    productFamily: {
      type: Schema.Types.ObjectId,
      ref: "productFamily",
    },
    filters: [
      {
        type: Schema.Types.ObjectId,
        ref: "Filter",
      },
    ],
    seasonality: [
      {
        type: Number,
      },
    ],
    availability: {
      type: String,
    },
    price: {
      type: String,
    },
    description: {
      type: String,
    },
    imagesurls: [
      {
        type: String,
      },
    ],
    thumbnailurl: {
      type: String,
    },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

ProductSchema.virtual("seasonality_hr").get(function () {
  return changeNoToRanges(this.seasonality as number[]);
});

export default mongoose.model<IProduct>("Product", ProductSchema);
