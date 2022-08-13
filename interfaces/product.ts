import { Document, Schema } from "mongoose";

export default interface IProduct extends Document {
  name: string;
  productType: Schema.Types.ObjectId;
  productFamily: Schema.Types.ObjectId;
  filters: Schema.Types.ObjectId[];
  seasonality: number[];
  seasonality_hr: string;
  availability: string;
  price: string;
  description: string;
  imagesurls: string[];
  thumbnailurl: string;
}
