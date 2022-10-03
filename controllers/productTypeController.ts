import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import ProductType from "../model/ProductType";
import ProductFamily from "../model/ProductFamily";

const createProductType = async (req: Request, res: Response) => {
  const { productType } = req.body;
  if (!productType) {
    return res.status(400).json({ message: "product type required" });
  }

  // check for duplicate usernames in the db
  const duplicate = await ProductType.findOne({
    productType: productType,
  }).exec();
  if (duplicate)
    return res.status(409).json({ message: "product type already exist" }); //Conflict

  try {
    const result = await ProductType.create({
      productType: productType,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const updateProductType = async (req: Request, res: Response) => {
  try {
    if (!req?.body?.id) {
      return res
        .status(400)
        .json({ message: "Product type ID parameter is required." });
    }

    const productType = await ProductType.findOne({ _id: req.body.id }).exec();
    if (!productType) {
      return res
        .status(409)
        .json({ message: `No product type matches ID ${req.body.id}.` });
    }

    const productType2 = await ProductType.findOne({
      productType: req.body.productType,
    }).exec();
    if (productType2 && productType2?.id !== productType?.id) {
      console.log({ message: `Naming conflict` });
      return res.status(409).json({ message: `Naming conflict`, aa: "bb" });
    }

    if (req.body?.productType) {
      productType.productType = req.body.productType;
    }
    const result = await productType.save();
    res.json(result);
  } catch (error) {
    res.status(400).json(error);
  }
};

const getAllProductTypes = async (req: Request, res: Response) => {
  const productTypes = await ProductType.find();
  if (!productTypes)
    return res.status(204).json({ message: "No usages found" });
  res.json(
    productTypes.sort((a, b) => a.productType.localeCompare(b.productType))
  );
};

const deleteProductType = async (req: Request, res: Response) => {
  const id = req?.body?.id;
  if (!id) return res.status(400).json({ message: "Usage ID required" });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Incorrect ID format" });
  const productType = await ProductType.findOne({ _id: req.body.id }).exec();
  if (!productType) {
    return res.status(204).json({ message: "" });
  }
  const productTypeUsed = await ProductFamily.findOne({
    productType: req.body.id,
  }).exec();
  if (productTypeUsed) {
    return res.status(400).json({
      message: `Product type used in ${productTypeUsed.productFamily}`,
    });
  }
  const result = await productType.deleteOne({ _id: req.body.id });
  res.json(result);
};

export default {
  createProductType,
  getAllProductTypes,
  deleteProductType,
  updateProductType,
};
