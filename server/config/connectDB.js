import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://abhay123:abhay1234@chat-app.piwe5zu.mongodb.net/?retryWrites=true&w=majority&appName=chat-app"
    )
    .then(() => console.log("Database is Connected"));
};

export default connectDB;
