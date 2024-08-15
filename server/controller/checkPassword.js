import UserModel from "../models/UserModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

async function checkPassword(req, res) {
  try {
    const { password, userId } = req.body;
    const user = await UserModel.findById(userId);
    const verifyPassword = await bcryptjs.compare(password, user.password);

    if (!verifyPassword) {
      res.status(400).json({
        message: "Please Check Password",
        error: true,
      });
    }

    const tokenData = {
      id: user._id,
      password: user.password,
    };
    const token = await jwt.sign(tokenData, `${process.env.JWT_SECRET_KEY}`, {
      expiresIn: "1d",
    });

    const cookieOption = {
      http: true,
      secure: true,
    };

    return res.cookie("token", token, cookieOption).status(200).json({
      message: "login Successfully",
      token: token,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: error,
    });
  }
}

export default checkPassword;
