import dotenv from "dotenv";
import express from "express";


dotenv.config();
const PORT = process.env.PORT || 8000;
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import cors from 'cors'
const app = express();

app.use(cors({
  origin:process.env.BASE_URL,
  credentials: true,
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
connectDB();
app.get("/", (req, res) => {
  res.send("Server Ready");
});

app.use("/api/student", userRoutes);
app.use("/api/admin", adminRoutes);
app.use(errorHandler);
app.use(notFound);


app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
