import { body } from "express-validator";

export const loginValidation = [
  body("email", "Email is not valid").isEmail(),
  body("password", "Password length must be >= 6").isLength({ min: 6 }),
];

export const registerValidation = [
  body("email", "Email is not valid").isEmail(),
  body("password", "Password length must be >= 6").isLength({ min: 6 }),
  body("fullName", "Too short username").isLength({ min: 3 }),
  body("avatarUrl", "Url format is not correct").optional().isURL(),
];

export const postValidation = [
  body("title", "Please write title").isLength({ min: 3 }).isString(),
  body("text", "Post is too short").isLength({ min: 10 }).isString(),
  body("tags", "Tags are not valid").optional().isArray(),
  body("imageUrl", "Url format is not correct").optional().isString(),
];
