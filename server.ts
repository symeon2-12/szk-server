import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user";
import authRoutes from "./routes/auth";
import refreshRoutes from "./routes/refresh";
import filtersRoutes from "./routes/filters";
import productTypeRoutes from "./routes/productType";
import productFamilyRoutes from "./routes/productFamily";
import productRoutes from "./routes/product";
import galleryImagesRoutes from "./routes/galleryImage";
import connectDB from "./config/dbConn";
import credentials from "./middleware/credentials";
import { logger } from "./middleware/logEvents";
import errorHandler from "./middleware/errorHandler";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const cors = require("cors");
import corsOptions from "./config/corsOptions";
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const helmet = require("helmet");

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);
//use helemt
app.use(helmet());

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));
// app.use(cors());
// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Server working");
});

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/refresh", refreshRoutes);
app.use("/filters", filtersRoutes);
app.use("/producttypes", productTypeRoutes);
app.use("/productfamilies", productFamilyRoutes);
app.use("/product", productRoutes);
app.use("/galleryimages", galleryImagesRoutes);

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(port, () =>
    console.log(`[server]: Server is running at https://localhost:${port}`)
  );
});
