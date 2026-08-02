import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    messageType: {
      type: String,
      enum: ["text", "file"], // enum = whitelist of allowed values
      required: true,
    },
    content: {
      type: String,
      required: function () {
        return this.messageType === "text"; // If messageType = "text" → content must exist
      },
    },
    fileUrl: {
      type: String,
      required: function () {
        return this.messageType === "file";
        // this = the current document you are saving
        //   Message.create({
        //   messageType: "text",
        //   content: "Hello"
        // })

        // 1. mongoose creates an object in memory
        // 2. Validation happens ==> validation runs on the document instance and this points to that document.
        // 3. saved to db
      },
    },
  },
  { timestamps: true },
);

const Message = mongoose.model("Messages", messageSchema);

// Variable = Message
// Model name = "Messages"  // ref looks for the Mongoose model name

export default Message;
