import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middlewares/errorHandlers";
import userRouter from "./routes/user";
import shopRouter from "./routes/shop";
import transportRouter from "./routes/transport";
import orderRouter from "./routes/order";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

//Middlewares
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

//Routes
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/transport", transportRouter);
app.use("/api/order", orderRouter);

// Error handler
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is Running http://localhost:${PORT}`);
});
