import { Server as SocketIOServer } from "socket.io"; // use after as one
import Message from "./models/MessageModel.js";
import Channel from "./models/ChannelModel.js";

const setupSocket = (server) => {
  // This code creates a Socket.IO/socket.io server and attaches it to your existing HTTP server.

  // io is a socket server.
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      // PUT	  : Replace/update the entire resource
      // PATCH	: Partially update a resource
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  console.log("userSocketMap ==> ", userSocketMap);

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

  // This function saves a message in the database and then sends it in real time using Socket.IO.

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

    // save in db first ==>
    const createdMessage = await Message.create(message);
    // You can't chain populate() directly to create()
    // but ==> await createdMessage.populate("sender") can be done...

    // get saved message from db ==>
    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id firstName lastName email image color")
      .populate("recipient", "id firstName lastName email image color");

    // Emit to recipient
    if (recipientSocketId) {
      // Send event only to this specific connected socket id, Not broadcast to everyone.
      // io.to(recipientSocketId).emit("eventName", {data});
      io.to(recipientSocketId).emit("receiveMessage", messageData);
    }

    // Emit to sender
    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
    }
  };

  //sendChannelMessage ============================>

  const sendChannelMessage = async (message) => {
    const { channelId, sender, messageType, content, fileUrl } = message;

    // sender{} , recipient{} , messageType , content , fileUrl ==> Message
    // 1st : save in db
    const createdMessage = await Message.create({
      sender,
      recipient: null, // no need recipient when sending to channel
      content,
      messageType,
      fileUrl,
    });

    // 2nd : get saved msg from db and Populate the sender reference with only these User fields.
    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color") // email  , password , firstName , lastName , image , color , profileSetup ,  imagePublicId : User
      .exec();

    // better ==>
    // createdMessage.populate() gets the User directly, while findById().populate() gets the Message again first, then the User.
    // await createdMessage.populate(
    //   "sender",
    //   "id email firstName lastName image color"
    // );

    // await query → Mongoose executes the query automatically.
    // await query.exec() → you explicitly tell Mongoose to execute it.
    // For normal async/await code, you can usually omit exec().

    // 3rd : update channel by pushing message id
    await Channel.findByIdAndUpdate(channelId, {
      // (_id / id / channelId), name , members[] , admin{} , messages[] ==> Channel
      $push: { messages: createdMessage._id },
    });

    // (_id / id / channelId), name , members[] , admin{} , messages[] ==> Channel

    // 4th : get channel by id , we need channel later... in 6th step.
    const channel = await Channel.findById(channelId).populate("members");

    // 3rd and 4th steps can be combined ==>

    // const channel = await Channel.findByIdAndUpdate(
    //   channelId,
    //   {
    //     $push: { messages: createdMessage._id },
    //   },
    //   { new: true },
    // ).populate("members");

    // 5th : prepare data
    const finalData = { ...messageData._doc, channelId: channel._id };

    //  _doc converts a Mongoose document into a normal JavaScript object so you can easily send or modify the data.
    //  ._doc is an internal Mongoose property and is generally not recommended for application code.

    // Query time → .lean()
    // After getting a document → .toObject()

    // lean() is not a method on a Mongoose document. It is a query method that must be called before the query executes.
    // Message.findById(id).lean() // "When MongoDB returns the result, give me a plain object instead of a Mongoose Document."

    // 6th :
    if (channel && channel.members) {
      // So your current code is basically manually broadcasting to channel members one by one.
      // It works, but Socket.IO rooms are the built-in feature for this use case.
      // broadcast means sending the same message/data to multiple connected clients (users) at the same time.

      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("receive-channel-message", finalData);
          // socket isn't available inside this function (unless you pass it).
          // Even if it were, it only represents the sender, while io.to(socketId) can send to any connected user.
        }
      });

      const adminSocketId = userSocketMap.get(channel.admin._id.toString());

      if (adminSocketId) {
        io.to(adminSocketId).emit("receive-channel-message", finalData);
      }

      // if Sender is both member and admin :
      // The sender can receive it twice: Once from channel.members.forEach and Once from adminSocketId
    }
  };

  // Before io.on() runs, Socket.IO does a handshake.

  // io.emit() → Broadcast to all connected clients.

  // io.to(socketId).emit("messageReceived",{data}) → Send to one specific client.

  // socket.emit("messageReceived",{data}) → Send only to the client (represented by that socket).

  // pattern ==> .on : ("eventName",cb)   &  .emit : (eventName,{data})

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

// ✅ io.on("connection",(socket)=>{}) → runs once when the user connects.
// ✅ socket.on("sendMessage",sendMessage) → runs every time when that connected user sends a "sendMessage" event.

// "sendMessage" = name/key
//  sendMessage = cb function registered/attached to that event in memory.

// If the user disconnects and later reconnects, then io.on("connection",(socket)=>{}) runs again because a new socket connection is created.

export default setupSocket;

// const userMap = new Map();

// Objects as keys → allowed in Map
// Also : String, Number, Boolean, BigInt, Symbol, Undefined, Null, Array, Function
// userMap.set(key, value) , userMap.has(key) , userMap.size , userMap.delete(key);

// userMap.set("name", "Ravi");
// userMap.set("age", 22);

// console.log(userMap) // Map(2) { 'name' => 'Ravi', 'age' => 22 }
// console.log(userMap.get("name")); // Ravi
// userMap.delete("name");

// Map in JavaScript does not allow duplicate keys.
// If you add the same key again, the old value gets replaced by new one.

// Problems with plain objects : Keys are only strings

// WeakMap : keys MUST be objects only but Map ==> any data type as keys

//////////////////////////////// xxxxxxxxxxxxxxxxxxxx//////////////////////////////

// Send to the same client using ==> io.to(socket.id).emit("messageReceived",{data}) vs socket.emit("messageReceived",{data})

// io.on("connection", (socket) => {

//   socket.emit("welcome",{data}) // it can also be used outside socket.on("message",(data)=>{})
//   For example, send a welcome message immediately after a client connects :

//    socket.emit("welcome", {
//     text: "Welcome"
//    });

//   socket.on("message", (data) => {

//     console.log(data);
//     io.to(socket.id).emit("messageReceived", {
//       status: "OK"
//     });

///////////////////// or ///////////////////////////

//    socket.emit("messageReceived", {
//    status: "OK"
//    });

//   });

//////////////////////////////// xxxxxxxxxxxxxxxxxxxx//////////////////////////////
