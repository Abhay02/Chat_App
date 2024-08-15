import { ConversationModel } from "../models/ConversationModel.js";

const getConversation = async (currentUserId) => {
  if (currentUserId) {
    const currentUserConversation = await ConversationModel.find({
      $or: [{ sender: currentUserId }, { reciver: currentUserId }],
    })
      .sort({ updatedAt: -1 })
      .populate("message")
      .populate("sender")
      .populate("reciver");

    const conversation = currentUserConversation.map((conv) => {
      const countUnseenMsg = conv?.message?.reduce((preve, curr) => {
        const msgByUserId = curr?.msgByUserId?.toString();

        if (msgByUserId !== currentUserId) {
          return preve + (curr?.seen ? 0 : 1);
        } else {
          return preve;
        }
      }, 0);

      return {
        _id: conv?._id,
        sender: conv?.sender,
        receiver: conv?.reciver,
        unseenMsg: countUnseenMsg,
        lastMsg: conv.message[conv?.message?.length - 1],
      };
    });

    return conversation;
  } else {
    return [];
  }
};

export default getConversation;
