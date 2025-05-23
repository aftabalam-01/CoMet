import morgan from "morgan";
import express from "express";
import "dotenv/config";
import { notFound, errorHandler } from "./middlewares/errorHandlers";
import userRouter from './routes/user'

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.use("/api/user", userRouter)

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is Running http://localhost:${PORT}`);
});
