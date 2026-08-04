import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  // name , members[] , admin{} , messages[]
  {
    name: {
      type: String,
      required: true,
    },
    members: [{ type: mongoose.Schema.ObjectId, ref: "User", required: true }],
    admin: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    messages: [{ type: mongoose.Schema.ObjectId, ref: "Messages" }],
  },
  { timestamps: true },
);

// mongoose.Schema.Types.ObjectId and mongoose.Schema.ObjectId are same

const Channel = mongoose.model("Channel", channelSchema);

export default Channel;
