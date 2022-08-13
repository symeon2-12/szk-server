import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Filter from "../model/Filter";
import Product from "../model/Product";

const createFilter = async (req: Request, res: Response) => {
  const { filter } = req.body;
  if (!filter) {
    return res.status(400).json({ message: "filter required" });
  }

  // check for duplicate usernames in the db
  const duplicate = await Filter.findOne({ filter: filter }).exec();
  if (duplicate)
    return res.status(409).json({ message: "filter already exist" }); //Conflict

  try {
    const result = await Filter.create({
      filter: filter,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const getAllFilters = async (req: Request, res: Response) => {
  const filters = await Filter.find();
  if (!filters) return res.status(204).json({ message: "No filters found" });
  res.json(filters.sort((a, b) => a.filter.localeCompare(b.filter)));
};

const deleteFilter = async (req: Request, res: Response) => {
  const id = req?.body?.id;
  if (!id) return res.status(400).json({ message: "Filter ID required" });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Incorrect ID format" });
  const filter = await Filter.findOne({ _id: req.body.id }).exec();
  if (!filter) {
    return res.status(204).json({ message: "" });
  }
  try {
    const ProductsWithFilter = await Product.find({
      filters: req.body.id,
    }).exec();
    for (const product of ProductsWithFilter) {
      const newFilters = product.filters.filter(
        (filter) => filter.toString() !== req.body.id
      );
      await product.updateOne({ filters: newFilters });
      console.log(`deleted filter from ${product.name}`);
    }
  } catch (err) {
    console.log(err);
  }

  const result = await filter.deleteOne({ _id: req.body.id });
  res.json(result);
};

export default { createFilter, getAllFilters, deleteFilter };
