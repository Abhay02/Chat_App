import express from "express";
import registerUser from "../controller/registerUser.js";
import checkEmail from "../controller/checkEmail.js";
import checkPassword from "../controller/checkPassword.js";
import userDetails from "../controller/userDetails.js";
import logout from "../controller/logout.js";
import updateUserDetails from "../controller/updateUserDetails.js";
import searchUser from "../controller/searchUser.js";

const router = express.Router();

router.post("/register", registerUser);
//Check User Email
router.post("/email", checkEmail);
//check Password
router.post("/password", checkPassword);
//Login User Details
router.get("/user-details", userDetails);
//Logout User
router.get("/logout", logout);
//Update User Details
router.post("/update-user", updateUserDetails);
//Search User
router.post("/search-user", searchUser);

export default router;
