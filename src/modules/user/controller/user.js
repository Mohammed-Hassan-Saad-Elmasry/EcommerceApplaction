import userModel from "../../../../db/models/User.model.js";
import { asyncHandler } from "../../../utils/errorhandling.js";

export const userList = asyncHandler(async (req, res, next) => {
  const users = await userModel.find({ _id: req.user._id });
  return res.status(200).json({ message: "Done", users });
});
