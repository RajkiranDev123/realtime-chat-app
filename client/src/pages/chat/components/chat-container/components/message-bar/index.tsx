import React, { useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
const MessageBar = () => {
  const [message, setMessage] = useState("");
  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">

      {/* flex item 1 : input , emoji */}
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Message..."
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none 
         focus:outline-none"
        />
        <button
          className="
        text-neutral-500 focus:text-white duration-300 transition-all
        "
        >
          <GrAttachment className="text-2xl" />
        </button>
        <div className="relative">
          <button className="text-neutral-500 focus:text-white duration-300 transition-all">
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0">j</div>
        </div>
      </div>
      {/* flex item 1 : input , emoji  */}


      {/*  */}

      <button className="text-neutral-500 bg-gray-500 focus:text-white duration-300 transition-all">
        <IoSend className="text-2xl" />
      </button>

      {/*  */}
    </div>
  );
};

export default MessageBar;
