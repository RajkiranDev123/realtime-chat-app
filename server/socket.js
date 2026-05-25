import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessageModel.js";
import Channel from "./models/ChannelModel.js";

const setupSocket = (server) => {
  //

  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();
  console.log("usm ==> ",userSocketMap)

  const disconnect = (socket) => {
    console.log(`Client Disconnected ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  // sendMessage : This function saves a message in the database and sends it in real time using Socket.IO.
  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    console.log("ssid ==> ",senderSocketId ," messageSender ==>", message.sender)

    const recipientSocketId = userSocketMap.get(message.recipient);
    console.log("rsid ==> ",recipientSocketId ," messageRecipient ==>", message.recipient)


    const createdMessage = await Message.create(message);
    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id firstName lastName email image color")
      .populate("recipient", "id firstName lastName email image color");
    console.log("map after connect", userSocketMap);

    // Emit to recipient
    if (recipientSocketId) {
      // Send event only to this specific connected socket id, Not broadcast to everyone.
      io.to(recipientSocketId).emit("receiveMessage", messageData);
    }

    // Emit to sender
    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
    }
  };

  //channel
  const sendChannelMessage = async (message) => {
    const { channelId, sender, content, messageType, fileUrl } = message;
    const createdMessage = await Message.create({
      sender,
      recipient: null,
      content,
      messageType,
      fileUrl,
    });
    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .exec();
    await Channel.findByIdAndUpdate(channelId, {
      $push: { messages: createdMessage._id },
    });
    const channel = await Channel.findById(channelId).populate("members");
    const finalData = { ...messageData._doc, channelId: channel._id };
    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());
        if (memberSocketId) {
          //if online
          io.to(memberSocketId).emit("receive-channel-message", finalData);
        }
      });
      const adminSocketId = userSocketMap.get(channel.admin._id.toString());

      if (adminSocketId) {
        io.to(adminSocketId).emit("receive-channel-message", finalData);
      }
    }
  };

  // Before this runs, Socket.IO does a handshake.
  io.on("connection", (socket) => {
    // socket : is an object that represents one user + has methods to communicate with them
    // it  has : id , Event methods ==> socket.on("event", handler) , socket.emit("event", data)
    // socket.handshake , Rooms system and Disconnect event
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected : ${userId} with socket id : ${socket.id}`);
    } else {
      console.log(`user id not provided during connection`);
    }

    console.log("map after connect", userSocketMap);

    // send message
    socket.on("sendMessage", sendMessage);
    // send channel message
    socket.on("send-channel-message", sendChannelMessage);

    // Disconnect event
    socket.on("disconnect", () => disconnect(socket));
  });

  //
};

export default setupSocket;

// const userMap = new Map();

// Objects as keys → allowed in Map
// set(key, value) , has(key) , size
// userMap.set("name", "Ravi");
// userMap.set("age", 22);
// console.log(userMap) // Map(2) { 'name' => 'Ravi', 'age' => 22 }
// console.log(userMap.get("name")); // Ravi
// userMap.delete("name");
// Map in JavaScript does not allow duplicate keys.
// If you add the same key again, the old value gets replaced.

// Problems with plain objects : Keys were only strings
// WeakMap : keys MUST be objects only.
