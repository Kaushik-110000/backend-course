import { Router } from "express";
import {
  loginUser,
  logOutUser,
  registerUser,
  getAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  checkRefreshToken,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logOutUser);

router.route("/refresh-tokens").post(getAccessToken);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/current-user").post(verifyJWT, getCurrentUser);

router.route("/update-details").post(verifyJWT, updateAccountDetails);

router.route("/updateAvatar").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  verifyJWT,
  updateAvatar
);

router.route("/updateCoverImage").post(
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  verifyJWT,
  updateCoverImage
);

router.route("/c/:userId").get(verifyJWT, getUserChannelProfile);
router.route("/watch-History").get(verifyJWT, getWatchHistory);
router.route("/check-refresh").get(checkRefreshToken);
export default router;
