import { Document } from "mongoose";

export default interface IFilter extends Document {
  filter: string;
}
