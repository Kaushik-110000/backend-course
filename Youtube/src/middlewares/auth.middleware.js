import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

//used _ instead of res as it was not used anywhere
export const verifyJWT = asyncHandler(async (req, _ , next) => {
  // console.log("Entering in verify JWT function");
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "").trim();

    console.log("Yout token ", token);

    if (!token) throw new ApiError(403, "Unauthorised request");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid token");
  }
});
