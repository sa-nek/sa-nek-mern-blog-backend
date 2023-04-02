import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";
import {
  registerValidation,
  loginValidation,
  postValidation,
} from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import { register, login, checkUser } from "./controllers/UserController.js";
import {
  createPost,
  getAllPosts,
  getOnePost,
  deletePost,
  updatePost,
  getTags,
} from "./controllers/PostController.js";
import handleValidation from "./utils/handleValidation.js";
import cors from "cors";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB is connected"))
  .catch((err) => console.log("DB error", err));

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post("/auth/reg", registerValidation, handleValidation, register);
app.post("/auth/login", loginValidation, handleValidation, login);
app.get("/auth/me", checkAuth, checkUser);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/posts", getAllPosts);
app.get("/posts/tags", getTags);
app.get("/posts/:id", getOnePost);
app.post("/posts", checkAuth, postValidation, handleValidation, createPost);
app.delete("/posts/:id", checkAuth, deletePost);
app.patch(
  "/posts/:id",
  checkAuth,
  postValidation,
  handleValidation,
  updatePost
);

app.listen(process.env.PORT, (err) => {
  if (err) return console.log(err);
  console.log("Server is running on PORT", process.env.PORT);
});
