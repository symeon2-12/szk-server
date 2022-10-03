import { NextFunction, Request, Response } from "express";
import mongoose, { ObjectId, Schema } from "mongoose";
import ProductType from "../model/ProductType";
import ProductFamily from "../model/ProductFamily";
import Product from "../model/Product";

const createProduct = async (req: Request, res: Response) => {
  // deconstruct body
  const {
    name,
    productFamily,
    productType,
    filters,
    seasonality,
    availability,
    price,
    description,
    imagesurls,
    thumbnailurl,
  } = req.body;
  const duplicate = await Product.findOne({
    name: name,
  }).exec();
  if (duplicate)
    return res.status(409).json({ message: "product already exists" }); //Conflict
  if (productType) {
    const productTypeCheck = await ProductType.exists({
      _id: productType,
    });
    if (!productTypeCheck)
      return res.status(409).json({ message: "product type check incorrect" });
  }
  if (productFamily) {
    const productFamilyCheck = await ProductFamily.exists({
      _id: productFamily,
    });
    if (!productFamilyCheck)
      return res
        .status(409)
        .json({ message: "product family check incorrect" });
  }

  try {
    const result = await Product.create({
      name: name,
      productFamily: productFamily,
      productType: productType,
      filters: filters,
      seasonality: seasonality,
      availability: availability,
      price: price,
      description: description,
      imagesurls: imagesurls,
      thumbnailurl: thumbnailurl,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    if (!req?.body?.id) {
      return res
        .status(400)
        .json({ message: "Product ID parameter is required." });
    }

    const product = await Product.findOne({ _id: req.body.id }).exec();
    if (!product) {
      return res
        .status(409)
        .json({ message: `No product matches ID ${req.body.id}.` });
    }
    const product2 = await Product.findOne({ name: req.body.name }).exec();
    if (product2 && product2?.id !== product?.id) {
      console.log({ message: `Naming conflict` });
      return res.status(409).json({ message: `Naming conflict`, aa: "bb" });
    }
    if (req.body?.name) {
      product.name = req.body.name;
      product.productType = req.body.productType;
      product.productFamily = req.body.productFamily;
      product.filters = req.body.filters;
      product.seasonality = req.body.seasonality;
      product.availability = req.body.availability;
      product.price = req.body.price;
      product.description = req.body.description;
      product.imagesurls = req.body.imagesurls;
      product.thumbnailurl = req.body.thumbnailurl;
    }
    const result = await product.save();
    res.json(result);
  } catch (error) {
    res.status(400).json(error);
  }
};

const getAllProducts = async (req: Request, res: Response) => {
  const products = await Product.find()
    .populate("productType", "productType")
    .populate("productFamily", "productFamily")
    .populate("filters", "filter")
    .exec((err, list) => {
      if (err) {
        return res.status(500).json(err.message);
      } else {
        res.status(200).json(list.sort((a, b) => a.name.localeCompare(b.name)));
      }
    });
};

const getProduct = async (req: Request, res: Response) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Product ID required" });
  const product = await Product.findOne({ _id: req.params.id })
    .populate("filters", "filter")
    .exec();
  if (!product) {
    return res
      .status(204)
      .json({ message: `Product ID ${req.params.id} not found` });
  }
  res.json(product);
};

const deleteProduct = async (req: Request, res: Response) => {
  const id = req?.body?.id;
  if (!id) return res.status(400).json({ message: "Producyt ID required" });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Incorrect ID format" });
  const product = await Product.findOne({
    _id: req.body.id,
  }).exec();
  if (!product) {
    return res.status(204).json({ message: "" });
  }
  const result = await product.deleteOne({ _id: req.body.id });
  res.json(result);
};

export default {
  createProduct,
  getAllProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};
