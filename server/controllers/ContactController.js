import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessageModel.js";

export const searchContacts = async (req, res) => {
  try {
    const { searchTerm } = req.body;

    if (searchTerm === undefined || searchTerm === null) {
      return res.status(400).json({
        message: "searchTerm is required",
        success: false,
      });
    }

    const sanitizeSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

    const regex = new RegExp(sanitizeSearchTerm, "i");

    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        {
          $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
        },
      ],
    });

    return res.status(200).json({
      contacts: contacts,
      success: true,
      message: "Contacts fetched.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// $ on the LEFT  -> MongoDB operator : $or
// $ inside a STRING -> document field : "$sender"

export const getContactsForDMList = async (req, res) => {
  try {
    let { userId } = req;
    userId = new mongoose.Types.ObjectId(userId);

    // mongoose.Schema.Types.ObjectId → schema definition
    // new mongoose.Types.ObjectId(id) → convert a value to ObjectId

    // find(), findOne(), findById(), updateOne() → Mongoose casts automatically.

    // aggregate() → convert strings to ObjectId yourself when matching ObjectId fields.

    const contacts = await Message.aggregate([
      // stage 1
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      // stage 2
      {
        $sort: { createdAt: -1 },
      },

      // stage 3
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$createdAt" }, // max : aggregate function : count , sum , avg , min , max
        },
      },

      // stage 4
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },

      // stage 5
      {
        $unwind: "$contactInfo",
      },

      // stage 6
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
      // stage 7
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    return res.status(200).json({
      contacts,
      success: true,
      message: "Contacts For DM List.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.userId } },
      "firstName lastName _id email",
    );
    const contacts = users.map((user) => ({
      label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
      value: user._id,
    }));
    return res.status(200).json({ success: true, contacts });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

///////////////////////////////////////////////

// Query
// { age: { $gt: 18 } }   =========> field    ==> operator

// Update
// { $set: { age: 18 } }  =========> operator ==> field
