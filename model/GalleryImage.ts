import mongoose, { Schema } from "mongoose";
import IGalleryImage from "../interfaces/galleryImage";

const GalleryImageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IGalleryImage>(
  "GalleryImage",
  GalleryImageSchema
);
