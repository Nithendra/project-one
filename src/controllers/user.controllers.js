import { requestAsycHandler } from "../utils/requestAsycHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = requestAsycHandler(async (req, res) => {
  // get user details from postman
  const { userName, email, password } = req.body;
  // varify fields not empty
  if ([userName, email, password].some((field) => field.trim() === "")) {
    throw new ApiError(400, "Fields can't be empty!");
  }
  // check if user already exist
  const isUserExist = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (isUserExist) {
    throw new ApiError(409, "user already exist!");
  }
  // create user object - db entry
  const user = await User.create({
    userName,
    email,
    password,
  });
  // check if user created
  const isUserCreated = await User.findById(user._id);
  if (!isUserCreated) {
    throw new ApiError(500, "user not created!");
  }
  // return response
  return res.status(201).json(new ApiResponse(200, { user }, "user created!"));
});

export { registerUser };
