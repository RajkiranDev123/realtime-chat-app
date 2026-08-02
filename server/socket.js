import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessageModel.js";
import Channel from "./models/ChannelModel.js";

// socket.emit()	            Current client only
// socket.broadcast.emit()	  Everyone except current client

// io.emit()	                All connected clients

// io.to(room).emit()	        All clients in a specific room
// io.to(socketId).emit()	    One specific client (by socket ID)

const setupSocket = (server) => {
  // This code creates a Socket.IO server and attaches it to your existing HTTP server.
  // io is a socket server.
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  console.log("userSocketMap ==> ", userSocketMap);

  // Another user connects:
  // Map(2) {
  //   "101" => "abc123",
  //   "205" => "xyz789"
  // }

  // map.set("1", "socket123") userId and socket.id
  // map.get("1")
  // map.has("1")

  // disconnect ======================================>

  const disconnect = (socket) => {
    console.log(`Client Disconnected ${socket.id}`);

    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
        // The break keyword is used to immediately exit the nearest enclosing loop
        // or switch statement. It is written inside an if block or a case block
      }
    }
  };

  // sendMessage ==============================>

  // This function saves a message in the database and sends it in real time using Socket.IO.

  const sendMessage = async (message) => {
    // get sender socket id
    const senderSocketId = userSocketMap.get(message.sender);
    console.log(
      "senderSocketId ==> ",
      senderSocketId,
      "message.sender ==> ",
      message.sender,
    );

    // get recepient socket id
    const recipientSocketId = userSocketMap.get(message.recipient);

    console.log(
      "recipientSocketId ==> ",
      recipientSocketId,
      " message.recipient ==>",
      message.recipient,
    );

    // save in db ==>
    const createdMessage = await Message.create(message);

    // get message from db ==>
    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id firstName lastName email image color")
      .populate("recipient", "id firstName lastName email image color");
    console.log("map after connect", userSocketMap);

    // Emit to recipient
    if (recipientSocketId) {
      // Send event only to this specific connected socket id, Not broadcast to everyone.
      // io.to(recipientSocketId).emit("receiveMessage", "Hello!");
      io.to(recipientSocketId).emit("receiveMessage", messageData);
    }

    // Emit to sender
    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
    }
  };

  //sendChannelMessage ============================>

  const sendChannelMessage = async (message) => {
    const { channelId, sender, content, messageType, fileUrl } = message;

    // sender , recipient , messageType , content , fileUrl
    const createdMessage = await Message.create({
      sender,
      recipient: null,
      content,
      messageType,
      fileUrl,
    });

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color") // email  , password , firstName , lastName , image , color , profileSetup : User
      .exec();

    // await query → Mongoose executes the query automatically.
    // await query.exec() → you explicitly tell Mongoose to execute it.
    // For normal async/await code, you can usually omit exec().

    await Channel.findByIdAndUpdate(channelId, {
      $push: { messages: createdMessage._id },
    });

    const channel = await Channel.findById(channelId).populate("members");

    const finalData = { ...messageData._doc, channelId: channel._id };
    //  _doc converts a Mongoose document into a normal JavaScript object so you can easily send or modify the data.
    //  ._doc is an internal Mongoose property and is generally not recommended for application code.
    //  Use direct fields (user.name) or .lean() when you need plain objects.

    if (channel && channel.members) {
      // So your current code is basically manually broadcasting to channel members one by one.
      // It works, but Socket.IO rooms are the built-in feature for this use case.

      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());
        if (memberSocketId) {
        
          io.to(memberSocketId).emit("receive-channel-message", finalData);
        }
      });

      const adminSocketId = userSocketMap.get(channel.admin._id.toString());

      if (adminSocketId) {
        io.to(adminSocketId).emit("receive-channel-message", finalData);
      }
    }
  };

  // Before io.on() runs, Socket.IO does a handshake.

  // io.emit() → Broadcast to all connected clients.
  // io.to(socketId).emit() → Send to one specific client.
  // socket.emit() → Send only to the client represented by that socket.

  io.on("connection", (socket) => {
    // socket : is an object that represents one user & has methods to communicate with them.
    // it  has : id , Event methods ==> socket.on("event", handler) , socket.emit("event", data)
    // socket.handshake , Rooms system and Disconnect event
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected : ${userId} with socket id : ${socket.id}`);
    } else {
      console.log(`user id is not provided during connection.`);
    }

    console.log("userSocketMap after connect ==> ", userSocketMap);

    // sendMessage :
    // Register the callback
    // Later... when Event arrives from the server
    // Socket.IO automatically does : sendMessage(message);
    socket.on("sendMessage", sendMessage);

    // send channel message
    socket.on("send-channel-message", sendChannelMessage);

    // Disconnect event
    socket.on("disconnect", () => disconnect(socket));
  });
};

// ✅ io.on("connection") → runs once when the user connects.
// ✅ socket.on("message") → runs every time that connected user sends a "message" event.

// If the user disconnects and later reconnects, then io.on("connection") runs again because a new socket connection is created.

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
