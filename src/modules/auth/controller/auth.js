import userModel from "../../../../db/models/User.model.js";
import { asyncHandler } from "../../../utils/errorhandling.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { nanoid, customAlphabet } from "nanoid";
import sendemail from "../../../utils/email.js";
import cloudinary from "../../../utils/cloudinary.js";

export const signup = asyncHandler(async (req, res, next) => {
  const { userName, email, password } = req.body;
  const usercheck = await userModel.findOne({ email: email.toLowerCase() });
  if (usercheck) {
    return next(new Error("email exist", { cause: 409 }));
  }
  const hashpassword = bcrypt.hashSync(password, +process.env.SALT_ROUNT);
  const { _id } = await userModel.create({
    userName,
    email: email.toLowerCase(),
    password: hashpassword,
  });
  return res.status(201).json({ message: "done", _id });
});

export const Login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new Error("Not register account"));
  }
  const math = bcrypt.compareSync(password, user.password);
  if (!math) {
    return next(new Error("in-valid login data"));
  }

  const access_token = jwt.sign(
    {
      id: user._id,
      username: user.userName,
      role: user.role,
    },
    "hamohamo"
  );
  user.status = "online";
  await user.save();
  return res.status(200).json({ message: "done", access_token });
});

export const sendCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const nanoid = customAlphabet("123456789", 4);
  const user = await userModel.findOneAndUpdate(
    { email: email.toLowerCase() },
    { forgetCode: nanoid() },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new Error("not register account"));
  }

  const html = `<h1> code ${user.forgetCode}</h1>`;
  await sendemail({
    to: email,
    subject: `forget password `,
    text: ` forget password`,
    html,
  });

  return res.json({ message: "done" });
});

export const forgetpassword = asyncHandler(async (req, res, next) => {
  const { email, forgetCode, password } = req.body;
  const user = await userModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new Error("not register account"));
  }

  if (user.forgetCode != forgetCode || !forgetCode) {
    return next(new Error("invalid reset code "));
  }
  const hashpassword = bcrypt.hashSync(password, +process.env.SALT_ROUNT);
  user.password = hashpassword;
  user.forgetCode = null;
  user.changePasswordTime = Date.now();
  await user.save();

  return res.json({ message: "done" });
});
