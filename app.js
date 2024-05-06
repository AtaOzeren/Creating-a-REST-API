require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");

const authRouter = require("./route/authRoute");
const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/appError");
const { stack } = require("sequelize/lib/utils");
const globalErrorHandler = require("./controller/errorController");
const app = express();

app.use(express.json());

//all router will be here

app.use("/api/v1/auth", authRouter);

// 404 hatası için bir ara katman
app.use("*", (req, res, next) => {
  throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
});

// Hata ara katmanı
app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 4000;
app.listen(process.env.APP_PORT, () => {
  console.log("Server is running", PORT);
});
