import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middlewares/errorHandlers";
import userRouter from "./routes/user";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

//Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

//Routes
app.use("/api/user", userRouter);

// Error handler
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is Running http://localhost:${PORT}`);
});
