import jwt from "jsonwebtoken";

import { requestAsycHandler } from "../utils/requestAsycHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

const generateAccessandRefreshToken = async (id) => {
  // get user obj
  // call token generation methods
  // return token
  try {
    const user = await User.findById(id);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(500, "something went wrong while genrating token!");
  }
};

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

const loginUser = requestAsycHandler(async (req, res) => {
  // login user steps -
  // get user input - req.body
  const { email, password } = req.body;
  // validate all should not empty
  if (!(email && password)) {
    throw new ApiError("400", "Enter user details!");
  }
  // check if those details available in db or not
  const user = await User.findOne({
    $and: [{ email }, { password }],
  });
  // if not response back with error
  if (!user) {
    throw new ApiError(404, "User does not exist!");
  }
  // once user login we should generate token
  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id);
  // set tokens to user cookies
  const option = {
    httpOnly: true,
    secure: true,
  };
  console.log({ accessToken });
  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(200, { user: loggedInUser }, "User login successfully!!")
    );
});

const logoutUser = requestAsycHandler(async (req, res) => {
  // take token from req  -done in middleware
  // takeout id from token  -done in middleware
  // get userdetails from id  -done in middleware
  // check if that user exist in db  -done in middleware
  // now remove refreshtoken from db
  await User.findByIdAndUpdate(req.user._id, {
    $unset: {
      refreshToken: 1,
    },
  });
  // remove cookie from req and res
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out!!"));
});

const updatePassword = requestAsycHandler(async (req, res) => {
  // check oldPasswod and new password - req.body
  const { oldPassword, newPassword } = req.body;
  // should not empty
  if (!(oldPassword && newPassword)) {
    throw new ApiError(400, "Field should not empty."); // this validation is UI responsbility
  }
  // take out id from token - req.cookies.refreshToken - in middleware
  // decode token - in middleware
  // takeout all details - in middleware
  const user = await User.findById(req.user._id);
  // check if oldPassword matching with db passwod
  if (user.password !== oldPassword) {
    throw new ApiError(400, "Passwod not matching.");
  }
  // if matching update that fileld
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  // return res
  return res.status(200).json(new ApiResponse(200, {}, "Password updated!!"));
});

export { registerUser, loginUser, logoutUser, updatePassword };
