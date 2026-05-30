import { compare } from "bcrypt"; // genSalt , hash , compare ==> bcrypt
import User from "../models/UserModel.js";

import jwt from "jsonwebtoken"; // sign , verify ==> jwt
import { renameSync, unlinkSync } from "fs"; // existsSync , mkdirSync , renameSync , unlinkSync ==> fs
import cloudinary from "../config/cloudinary.js";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  // jwt.sign({payload}, secretKey, {options})
  return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: "3d" });
};

////////////////////////////// signup /////////////////////////////

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      // (false || false ) ==> last false taken , false then go forward , true ==> stop
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Yes, it works, but 400 is not the most correct status code here.
    // 400 Bad Request → means the request itself is invalid (missing fields, wrong format, etc.)
    // 409 Conflict → means request is valid, but conflicts with existing data (like duplicate email)

    // const user = new User(data) and await user.save() == User.create({})

    // firstName : Since you did not provide , fields usually omitted from DB
    // This field gets auto-added because of default : profileSetup
    const user = await User.create({
      email,
      password,
    });

    // res.cookie(name, value, {options});
    // small data stored in browser that is automatically sent to the server with every request.
    res.cookie("jwt", createToken(email, user._id), {
      httpOnly: true, // JS (frontend) cannot access cookie.
      maxAge,
      //
      secure: true, // cookie will only be sent over HTTPS.
      sameSite: "none", // cookie can be sent in cross-site requests

      // "strict" → safest , "lax" → balanced (commonly used) , "none" → requires ==> secure: true

      // “Allow cross-site cookie, but only over encrypted connection (https)” ==> secure : true , sameSite : "none"

      //  secure: false, sameSite: "lax" ==> dev

      //  prod ==>   secure: true , sameSite: "none",

      // https://raj.com        -> frontend
      // https://raj.com/api    -> backend
      // Path does NOT make it cross-site. Browser mainly checks: protocol (https://) and domain (raj.com) ==> sameSite: "Strict"
      // Generic TLDs (gTLD) : .com and Country Code TLDs (ccTLD) : .in
      // raj → Second-level domain (the name you register)
      // .com → TLD (Top-Level Domain)
      // raj.com → Complete domain name
    });
    return res.status(201).json({
      // axios : const { user, message, success } = res.data;
      user: {
        id: user._id,
        email: user.email,
        profileSetup: user.profileSetup, // user is from db after creation
      },
      message: "Account Created. Setup your profile now.",
      success: true,
    });
  } catch (error) {
    // console.log("catch block of signup ==>", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

/////////////////////////////// login ////////////////////////////

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User with given email not found. Create an account now.",
      });
    }
    const comparePassword = await compare(password, user.password);

    if (!comparePassword) {
      return res.status(400).json({
        success: false,
        message: "Password is not correct.",
      });
    }
    res.cookie("jwt", createToken(email, user._id), {
      httpOnly: true,
      maxAge,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName, // user.firstName does not exist, value becomes : undefined and
        // then firstName may disappear from JSON because undefined is omitted.
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
      success: true,
    });
    // undefined fields are automatically removed in JSON (response) : "firstName": undefined,
    // null and "" (empty string) included in JSON
  } catch (error) {
    // console.log("catch block of login ==>", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

/////////////////////////////// getUserInfo ///////////////////////

export const getUserInfo = async (req, res) => {
  // req.userId = decoded.userId; // in middleware
  try {
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(400).json({
        success: false,
        message: "User with given id not found.",
      });
    }
    return res.status(200).json({
      user: {
        id: userData._id,
        email: userData.email,
        profileSetup: userData.profileSetup,
        //
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        color: userData.color,
      },
      success: true,
    });
  } catch (error) {
    // console.log("catch block of user info ==>", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

//////////////////// updateProfile /////////////////////////////////

export const updateProfile = async (req, res) => {
  // req.userId = decoded.userId;
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;
    // if color value is 0 then ==> !0 == true
    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "firstName , lastName is required.",
      });
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }, // Mongoose mainly validates only the fields being updated , not email etc.
      // but whole validation is done by ==> user.validate() , User.create({}) , user.save()
      // These methods in Mongoose run schema validation automatically: user.save(), User.create() automatically
      // updateOne() , updateMany() , findOneAndUpdate() , findByIdAndUpdate() , replaceOne() need runValidators : true
    );

    return res.status(200).json({
      id: userData._id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      //
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

///////////// addProfileImage ////////////////////////////////////

export const addProfileImage = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User id not found.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "File is required.",
        success: false,
      });
    }

    const date = Date.now(); // machine format
    // console.log(new Date(Date.now())); // readable date object
    let fileName = "uploads/profiles/" + date + req.file.originalname;
    // console.log(fileName); // uploads/profiles/7867543467raj.png
    // / = folder separator (path structure) and last part = actual file name
    renameSync(req.file.path, fileName); // renameSync(oldPath, newPath)

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        image: fileName,
      },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      image: updatedUser.image,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

//////////////////////////// addProfileImage cloudinary /////////////////////

// export const addProfileImage = async (req, res) => {
//   try {
//     const { userId } = req;

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User id not found.",
//       });
//     }

//     if (!req.file) {
//       return res.status(400).json({
//         message: "File is required.",
//         success: false,
//       });
//     }

//     const date = Date.now();

//     let fileName = "uploads/profiles/" + date + req.file.originalname;

//     // move file inside uploads/profiles
//     renameSync(req.file.path, fileName);

//     // 🔥 upload to cloudinary from server file
//     const result = await cloudinary.uploader.upload(fileName, {
//       folder: "profile_images",
//     });

//     // delete local file after upload
//     unlinkSync(fileName);

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       {
//         image: result.secure_url, // store cloudinary URL
//       },
//       { new: true, runValidators: true }
//     );

//     return res.status(200).json({
//       success: true,
//       image: updatedUser.image,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Internal Server Error",
//       success: false,
//     });
//   }
// };

////////// removeProfileImage //////////////////////////////////////

export const removeProfileImage = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User  not found.",
      });
    }

    if (user.image) {
      unlinkSync(user.image);
      //user.image : "uploads/profiles/1778140869800login2.png"
    }
    user.image = null;
    // If you use:

    // image: {
    //   type: String,
    //   required: true,
    // }
    // user.image = null ==> will fail validation. field must exist and and cannot be null or empty.

    // null is completely valid in a JSON response.
    // res.json({ image: undefined, name: "RJ" }) ==>  { "name": "RJ" }
    // null → intentionally empty value , undefined : field may be omitted from MongoDB document entirely.
    // true ==> "true" and 12 ==> "12" : Mongoose  may convert types based on schema.

    await user.save();

    // If email is missing and you do : user.save() , Mongoose will throw validation error if schema has : email {type : String , required : true}
    // Because save() validates the whole document.
    // ValidationError : email is required when we do email = null

    return res.status(200).json({
      message: "Profile image removed.",
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

//////////////////////////// removeProfileImage cloudinary ////////////////

// export const removeProfileImage = async (req, res) => {
//   try {
//     const { userId } = req;

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found.",
//       });
//     }

//     // if user has image in cloudinary
//     if (user.image) {
//       // extract public_id from url
//       const parts = user.image.split("/");
//       const fileWithExt = parts[parts.length - 1];
//       const publicId = "profile_images/" + fileWithExt.split(".")[0];

//       // delete from cloudinary
//       await cloudinary.uploader.destroy(publicId);
//     }

//     // remove from DB
//     user.image = null;
//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "Profile image removed.",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

////////////////////////////////// logout //////////////////////////////////

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      message: "Logout done.",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////

// | Method       | Argument Type        | Returns                   |
// | ------------ | -------------------- | ------------------------- |
// | `find()`     | Object (filter)      | Array of documents or []  |
// | `findOne()`  | Object (filter)      | Single document or `null` |
// | `findById()` | ID (string/ObjectId) | Single document or `null` |
