import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker, { Theme } from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";
const MessageBar = () => {
  const emojiRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState<string>("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);

  const handleSendMessage = async () => {};

  const handleAddEmoji = (emojiData: EmojiClickData) => {
    setMessage((msg) => msg + emojiData.emoji);
  };

  // as = Type Assertion (you force a type)

  // ! = Non-null assertion (value is NOT null/undefined)
  // const name: string | null = "Rj";
  // console.log(name!.toUpperCase()); // ❌ crash at runtime
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
          <button
            onClick={() => setEmojiPickerOpen(true)}
            className="text-neutral-500 focus:text-white duration-300 transition-all"
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme={Theme.DARK}
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      {/* flex item 1 : input , emoji  */}

      {/*  */}

      <button
        onClick={handleSendMessage}
        className="
      bg-[#8417ff] rounded-md flex items-center justify-center p-5 
      focus:border-none hover:bg-[#741bda] focus:bg-[#741bda]
      focus:outline-none focus:text-white text-neutral-300 duration-300 transition-all
      "
      >
        <IoSend className="text-2xl" />
      </button>

      {/*  */}
    </div>
  );
};

export default MessageBar;
