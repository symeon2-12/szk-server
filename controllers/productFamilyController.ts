import { NextFunction, Request, Response } from "express";
import mongoose, { ObjectId, Schema } from "mongoose";
import Product from "../model/Product";
import ProductType from "../model/ProductType";
import ProductFamily from "../model/ProductFamily";

const createProductFamily = async (req: Request, res: Response) => {
  const { productFamily, productType } = req.body;
  if (!productType) {
    return res.status(400).json({ message: "product type required" });
  }
  if (!productFamily) {
    return res.status(400).json({ message: "product family required" });
  }

  // check for duplicate in the db
  const duplicate = await ProductFamily.findOne({
    productType: productType,
    productFamily: productFamily,
  }).exec();
  if (duplicate)
    return res.status(409).json({ message: "product family already exists" }); //Conflict

  const productTypeCheck = await ProductType.exists({
    _id: productType,
  });

  if (!productTypeCheck)
    return res.status(409).json({ message: "product type check incorrect" }); //Conflict

  try {
    const result = await ProductFamily.create({
      productFamily: productFamily,
      productType: productType,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const updateProductFamily = async (req: Request, res: Response) => {
  try {
    if (!req?.body?.id) {
      return res
        .status(400)
        .json({ message: "Product family ID parameter is required." });
    }

    const productFamily = await ProductFamily.findOne({
      _id: req.body.id,
    }).exec();
    if (!productFamily) {
      return res
        .status(409)
        .json({ message: `No product family matches ID ${req.body.id}.` });
    }

    const productFamily2 = await ProductFamily.findOne({
      productFamily: req.body.productFamily,
      productType: req.body.productType,
    }).exec();
    if (productFamily2 && productFamily2?.id !== productFamily?.id) {
      console.log({ message: `Naming conflict` });
      return res.status(409).json({ message: `Naming conflict`, aa: "bb" });
    }
    const productTypeCheck = await ProductType.exists({
      _id: req.body.productType,
    });

    if (!productTypeCheck)
      return res.status(409).json({ message: "product type check incorrect" }); //Conflict

    if (req.body?.productType) {
      productFamily.productFamily = req.body.productFamily;
      productFamily.productType = req.body.productType;
    }
    const result = await productFamily.save();
    res.json(result);
  } catch (error) {
    res.status(400).json(error);
  }
};

const getAllProductFamilies = async (req: Request, res: Response) => {
  const productFamilies = await ProductFamily.find()
    .populate("productType", "productType")
    .exec((err, list) => {
      if (err) {
        return res.status(500).json(err.message);
      } else {
        console.log(
          list.sort((a, b) => {
            console.log(a.productFamily.toLowerCase());
            return a.productFamily.toLowerCase() !== "inne"
              ? a.productFamily.localeCompare(b.productFamily)
              : 1;
          })
        );
        res.status(200).json(
          list.sort((a, b) => {
            if (a.productFamily.toLowerCase() === "inne") return 1;
            if (b.productFamily.toLowerCase() === "inne") return -1;
            return a.productFamily.localeCompare(b.productFamily);
          })
        );
      }
    });
};

const getProductFamiliesWithType = async (req: Request, res: Response) => {
  console.log(req?.body?.productType);
  if (!req?.body?.productType)
    return res.status(400).json({ message: "Product type required" });
  const productFamiliy = await ProductFamily.find({
    productType: req.body.productType,
  }).exec();
  console.log(productFamiliy);
  if (!productFamiliy) {
    return res.status(204).json({
      message: `Product families with product type ${req.body.productType} not found`,
    });
  }
  res.json(
    productFamiliy.sort((a, b) =>
      a.productFamily.localeCompare(b.productFamily)
    )
  );
};

const deleteProductFamily = async (req: Request, res: Response) => {
  const id = req?.body?.id;
  if (!id) return res.status(400).json({ message: "Family ID required" });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Incorrect ID format" });
  const productFamily = await ProductFamily.findOne({
    _id: req.body.id,
  }).exec();
  if (!productFamily) {
    return res.status(204).json({ message: "" });
  }
  const productFamilyUsed = await Product.findOne({
    productFamily: req.body.id,
  }).exec();
  if (productFamilyUsed) {
    return res.status(400).json({
      message: `Product family used in ${productFamilyUsed.name}`,
    });
  }
  const result = await productFamily.deleteOne({ _id: req.body.id });
  res.json(result);
};

export default {
  createProductFamily,
  getAllProductFamilies,
  getProductFamiliesWithType,
  deleteProductFamily,
  updateProductFamily,
};
