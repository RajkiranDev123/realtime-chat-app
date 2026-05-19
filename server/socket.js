import { Server as SocketIOServer } from "socket.io";




const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`Client Disconnected ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
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

    // Disconnect event
    socket.on("disconnect", () => disconnect(socket));
  });
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