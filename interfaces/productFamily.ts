import { Document, Schema } from "mongoose";

export default interface IProductFamily extends Document {
  productType: Schema.Types.ObjectId;
  productFamily: string;
}
