import { v2 as cloudinary } from "cloudinary"; // use after as ==> my naming
import dotenv from "dotenv";
dotenv.config();

// configure cloudinary with your account credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// export configured instance
export default cloudinary;


// Website URL → Which website? (like Cloud Name)
// Username    → Who are you? (like API Key)
// Password    → Prove it's you. (like API Secret)