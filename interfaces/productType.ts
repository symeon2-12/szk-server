import { Document } from "mongoose";

export default interface IProductType extends Document {
  productType: string;
}
