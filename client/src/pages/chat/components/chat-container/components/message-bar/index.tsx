import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker, { Theme } from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react"; // otherwise you must manually define it:
import { useAppStore } from "@/store";
import { useSocket } from "@/context/SocketContext";

const MessageBar = () => {
  const socket = useSocket();
  const emojiRef = useRef<HTMLDivElement | null>(null);
  const { selectedChatData, selectedChatType, userInfo } = useAppStore();
  const [message, setMessage] = useState<string>("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);

  const handleSendMessage = async () => {
    // type SocketContextType = Socket | null ==> 'socket' is possibly 'null'.
    if (
      selectedChatType === "contact" &&
      socket &&
      userInfo &&
      selectedChatData
    ) {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    }
  };

  const handleAddEmoji = (emojiData: EmojiClickData) => {
    setMessage((msg) => msg + emojiData.emoji);
  };

  // as = Type Assertion (you force a type)

  // ! = Non-null assertion (value is NOT null/undefined)
  // const name: string | null = "Rj";
  // console.log(name!.toUpperCase()); // ❌ crash at runtime if name=null , console.log(name!.toUpperCase())
  // ! ==> removes null | undefined from a type by forcing TypeScript to trust you — but it does NOT guarantee safety at runtime.

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // without MouseEvent : TypeScript loses type info , Now event becomes implicitly any (or very loosely typed depending on config).
      // TypeScript loses type info , So TS no longer knows : what event is , what target is
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target as Node)
        // EventTarget includes things like: DOM elements (div, button) ✅ (these ARE Nodes) ,document ✅ (Node)
        // window ❌ (NOT a Node in TS DOM typings) ,other custom event targets
        // ts : “I cannot promise this is always a Node.”
      ) {
        setEmojiPickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    // It is attached to the global document object in the browser DOM after mounting.
    // From this moment onward, every mouse click triggers your handler.

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="h-[10vh] bg-[#1c1d25] flex  items-center px-3 mb-6 gap-1">
      {/* flex item 1 : input , attachment and emoji */}
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center  gap-5 pr-5">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Message..."
          className="flex-1 p-3 bg-transparent rounded-md focus:border-none 
         focus:outline-none"
        />
        {/* attachment  */}
        <button
          className="
        text-neutral-500 focus:text-white duration-300 transition-all
        "
        >
          <GrAttachment className="text-xl" />
        </button>
        {/* attachment ends */}

        {/* emoji */}
        <div className="relative ">
          <button
            onClick={() => setEmojiPickerOpen(true)}
            className="text-neutral-500 focus:text-white duration-300 transition-all"
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>

          <div className="absolute bottom-12 right-0 " ref={emojiRef}>
            <EmojiPicker
              theme={Theme.DARK}
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
        {/* emoji ends */}
      </div>
      {/* flex item 1 : input , attachment and emoji ends */}

      {/* send button */}

      {/* focus ==> Triggered when an element is selected  (usually via click or keyboard tab). */}

      <button
        onClick={handleSendMessage}
        className=" 
       rounded-md flex items-center justify-center p-3
     bg-[#8417ff]  focus:outline-none focus:border-none hover:bg-[#741bda] focus:bg-[#741bda]
      focus:text-white text-neutral-300 duration-300 transition-all
      "
      >
        <IoSend className="text-2xl" />
      </button>

      {/* send button ends */}
    </div>
  );
};

export default MessageBar;
