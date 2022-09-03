"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("./routes/user"));
const auth_1 = __importDefault(require("./routes/auth"));
const refresh_1 = __importDefault(require("./routes/refresh"));
const filters_1 = __importDefault(require("./routes/filters"));
const productType_1 = __importDefault(require("./routes/productType"));
const productFamily_1 = __importDefault(require("./routes/productFamily"));
const product_1 = __importDefault(require("./routes/product"));
const galleryImage_1 = __importDefault(require("./routes/galleryImage"));
const dbConn_1 = __importDefault(require("./config/dbConn"));
const credentials_1 = __importDefault(require("./middleware/credentials"));
const logEvents_1 = require("./middleware/logEvents");
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const cors = require("cors");
const corsOptions_1 = __importDefault(require("./config/corsOptions"));
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const helmet = require("helmet");
// Connect to MongoDB
(0, dbConn_1.default)();
// custom middleware logger
app.use(logEvents_1.logger);
//use helemt
app.use(helmet());
// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials_1.default);
// Cross Origin Resource Sharing
app.use(cors(corsOptions_1.default));
// app.use(cors());
// built-in middleware to handle urlencoded form data
app.use(express_1.default.urlencoded({ extended: false }));
// built-in middleware for json
app.use(express_1.default.json());
app.use(cookieParser());
app.get("/", (req, res) => {
    res.send("Server working");
});
app.use("/users", user_1.default);
app.use("/auth", auth_1.default);
app.use("/refresh", refresh_1.default);
app.use("/filters", filters_1.default);
app.use("/producttypes", productType_1.default);
app.use("/productfamilies", productFamily_1.default);
app.use("/product", product_1.default);
app.use("/galleryimages", galleryImage_1.default);
app.use(errorHandler_1.default);
mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(port, () => console.log(`[server]: Server is running at https://localhost:${port}`));
});
