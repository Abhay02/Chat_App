import UserModel from "../models/UserModel.js";
import bcryptjs from "bcryptjs";
async function registerUser(req, res) {
  try {
    const { name, email, password, profile_pic } = req.body;

    const checkEmail = await UserModel.findOne({ email });

    if (checkEmail) {
      return res.status(400).json({
        message: "Already User Exists",
        error: true,
      });
    }
    // Password into hashed
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const payload = {
      name,
      email,
      profile_pic,
      password: hashedPassword,
    };

    const user = new UserModel(payload);
    const userSave = await user.save();

    return res.status(201).json({
      message: "User Created Succesfully",
      data: userSave,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

export default registerUser;
