import { Document } from "mongoose";

export default interface IGalleryImage extends Document {
  url: string;
}
