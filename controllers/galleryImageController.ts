import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import GalleryImage from "../model/GalleryImage";

const createGalleryImages = async (req: Request, res: Response) => {
  const { galleryImages } = req.body;
  if (!galleryImages) {
    return res.status(400).json({ message: "gallery images urls required" });
  }

  for (const img of galleryImages) {
    const duplicate = await GalleryImage.findOne({
      url: img,
    }).exec();
    if (duplicate)
      return res
        .status(409)
        .json({ message: "gallery image url already exists" }); //Conflict
  }
  // check for duplicate usernames in the db
  let resultArr = [];
  for (const img of galleryImages) {
    console.log(img);
    try {
      const result = await GalleryImage.create({
        url: img,
      });

      resultArr.push(result);
    } catch (err) {
      console.error(err);
    }
  }

  res.status(201).json(resultArr);
};

const getAllGalleryImages = async (req: Request, res: Response) => {
  const galleryImage = await GalleryImage.find();
  if (!galleryImage)
    return res.status(204).json({ message: "No images found" });
  res.json(galleryImage);
};

const deleteGalleryImage = async (req: Request, res: Response) => {
  const ids = req?.body?.ids;
  if (!ids)
    return res.status(400).json({ message: "Gallery image ID required" });
  for (const id of ids) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Incorrect ID format" });
  }

  let resultArr = [];
  for (const id of ids) {
    const galleryImage = await GalleryImage.findOne({ _id: id }).exec();
    if (!galleryImage) {
      return res.status(204).json({ message: "" });
    }
    const result = await galleryImage.deleteOne({ _id: id });
    resultArr.push(result);
  }

  res.json(resultArr);
};

export default { createGalleryImages, getAllGalleryImages, deleteGalleryImage };
