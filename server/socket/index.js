import express from "express";
import { Server } from "socket.io";
import http from "http";
import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken.js";
import UserModel from "../models/UserModel.js";
import {
  ConversationModel,
  MessageModel,
} from "../models/ConversationModel.js";
import getConversation from "../helpers/getConversation.js";

const app = express();

// Socket connection
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow requests from this origin
    credentials: true, // Enable cookies if needed
  },
});

//Online User
const onlineUser = new Set();

io.on("connection", async (socket) => {
  console.log("Connected User ", socket.id);

  const token = socket.handshake.auth.token;

  //User Details using token
  const user = await getUserDetailsFromToken(token);

  //Create a Room
  socket.join(user?._id.toString());
  onlineUser.add(user?._id?.toString());

  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("message-page", async (userId) => {
    const userDetails = await UserModel.findById(userId).select("-password");

    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profile_pic: userDetails?.profile_pic,
      online: onlineUser.has(userId),
    };
    socket.emit("message-user", payload);
    // get Previous Message

    const getConversationMessage = await ConversationModel.findOne({
      $or: [
        {
          sender: user?._id,
          reciver: userId,
        },
        {
          sender: userId,
          reciver: user?._id,
        },
      ],
    })
      .populate("message")
      .sort({ updatedAt: -1 });
    socket.emit("message", getConversationMessage?.message || []);
  });

  //new message
  socket.on("new message", async (data) => {
    // Check Conversation is available for both user
    let conversation = await ConversationModel.findOne({
      $or: [
        {
          sender: data?.sender,
          reciver: data?.reciver,
        },
        {
          sender: data?.reciver,
          reciver: data?.sender,
        },
      ],
    });

    // If conversation is not available
    if (!conversation) {
      const createConversation = await ConversationModel({
        sender: data?.sender,
        reciver: data?.reciver,
      });
      conversation = await createConversation.save();
    }

    const message = new MessageModel({
      text: data.text,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      msgByUserId: data?.msgByUserId,
    });
    const saveMessage = await message.save();
    const updateConversation = await ConversationModel.updateOne(
      {
        _id: conversation._id,
      },
      {
        $push: { message: saveMessage?._id },
      }
    );
    const getConversationMessage = await ConversationModel.findOne({
      $or: [
        { sender: data?.sender, reciver: data?.reciver },
        { sender: data?.reciver, reciver: data?.sender },
      ],
    })
      .populate("message")
      .sort({ updatedAt: -1 });

    io.to(data?.sender).emit("message", getConversationMessage?.message || []);
    io.to(data?.reciver).emit("message", getConversationMessage?.message || []);

    //send conversation
    const conversationSender = await getConversation(data?.sender);
    const conversationReciver = await getConversation(data?.reciver);

    io.to(data?.sender).emit("conversation", conversationSender);
    io.to(data?.reciver).emit("conversation", conversationReciver);
  });

  //Sidebar
  socket.on("sidebar", async (currentUserId) => {
    const conversation = await getConversation(currentUserId);
    socket.emit("conversation", conversation);
  });

  socket.on("seen", async (msgByUserId) => {
    let conversation = await ConversationModel.findOne({
      $or: [
        {
          sender: user?._id,
          reciver: msgByUserId,
        },
        {
          sender: msgByUserId,
          reciver: user?._id,
        },
      ],
    });

    const conversationMessageId = conversation?.message || [];

    const updateMessage = await MessageModel.updateMany(
      {
        _id: { $in: conversationMessageId },
        msgByUserId: msgByUserId,
      },
      { $set: { seen: true } }
    );

    //send conversation
    const conversationSender = await getConversation(user?._id?.toString());
    const conversationReciver = await getConversation(msgByUserId);

    io.to(user?._id?.toString()).emit("conversation", conversationSender);
    io.to(msgByUserId).emit("conversation", conversationReciver);
  });

  //Disconnect
  socket.on("disconnect", () => {
    onlineUser.delete(user?._id?.toString());
    console.log("disconnect user ", socket.id);
  });
});

export { app, server };
