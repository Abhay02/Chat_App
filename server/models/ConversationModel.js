import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    text: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    seen: { type: Boolean, default: false },
    msgByUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "user",
    },
  },
  { timestamps: true }
);

const conversationSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.ObjectId, required: true, ref: "user" },
    reciver: { type: mongoose.Schema.ObjectId, required: true, ref: "user" },
    message: [{ type: mongoose.Schema.ObjectId, ref: "Message" }],
  },
  { timestamps: true }
);

const MessageModel = mongoose.model("Message", messageSchema);
const ConversationModel = mongoose.model("conversation", conversationSchema);

export { ConversationModel, MessageModel };
