import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { requestAsycHandler } from "../utils/requestAsycHandler.js";
import jwt from "jsonwebtoken";

const jwtAuth = requestAsycHandler(async (req, res, next) => {
  try {
    // access token - res.cookie
    const token = req.cookies?.accessToken;
    if (!token) {
      throw new ApiError(401, "Auautherized request!");
    }
    // decode in jwt
    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // check id id exist in db
    const user = await User.findById(decodeToken._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Invalid access token!");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "something went wrong: in requestAsycHandler");
  }
});

export { jwtAuth };
