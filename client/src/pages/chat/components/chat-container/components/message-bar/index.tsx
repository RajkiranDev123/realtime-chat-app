import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker, { Theme } from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react"; // otherwise you must manually define it:
import { useAppStore } from "@/store";
import { useSocket } from "@/context/SocketContext";
import { apiClient } from "@/lib/api-client";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";

const MessageBar = () => {
  const socket = useSocket();
  const emojiRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    selectedChatData,
    //
    selectedChatType,
    //
    userInfo,
    //
    setIsUploading,
    //
    setFileUploadProgress,
  } = useAppStore();

  const [message, setMessage] = useState<string>("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);

  const handleSendMessage = async () => {
    // type SocketContextType = Socket | null ==> 'socket' is possibly 'null'.
    if (!message.trim()) return;
    if (
      selectedChatType === "contact" &&
      socket &&
      userInfo &&
      selectedChatData
    ) {
      console.log(11, typeof userInfo.id, userInfo.id);
      console.log(12, typeof selectedChatData._id, selectedChatData._id);
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    } else if (selectedChatType === "channel") {
      console.log(13, typeof userInfo?.id);
      console.log(14, typeof selectedChatData?._id);
      socket?.emit("send-channel-message", {
        sender: userInfo?.id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData?._id,
      });
    }
    setMessage("");
  };

  const handleAddEmoji = (emojiData: EmojiClickData) => {
    setMessage((msg) => msg + emojiData.emoji);
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      const file = event.target.files?.[0];

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        const res = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            if (data.total) {
              setFileUploadProgress(
                Math.round((100 * data.loaded) / data.total),
              );
            }
          },
        });
        if (res.status === 200 && res.data) {
          setIsUploading(false);
          if (selectedChatType === "contact") {
            socket?.emit("sendMessage", {
              sender: userInfo?.id,
              content: undefined,
              recipient: selectedChatData?._id,
              messageType: "file",
              fileUrl: res.data.filePath,
              filePublicId: res.data.filePublicId,
            });
          } else if (selectedChatType === "channel") {
            socket?.emit("send-channel-message", {
              sender: userInfo?.id,
              content: undefined,
              messageType: "file",
              fileUrl: res.data.filePath,
              channelId: selectedChatData?._id,
              filePublicId: res.data.filePublicId,
            });
          }
        }
      }

      console.log(file);
    } catch (error) {
      setIsUploading(false);
      console.error(error);
    }
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
    
    <div className="h-[10vh] bg-[#1c1d25] flex  items-center px-3 mb-1 gap-1">

      {/* flex item-1 : input , attachment and emoji */}
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center  gap-2 pr-2 min-w-0 flex-wrap">
        {/* why min-w-0 on flex parent ?  */}
        {/* "because parent don't want to shrink smaller than the minimum width the items require." */}
     


        {/* input */}
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Message..."
          className="flex-1 p-3 bg-transparent rounded-md focus:border-none min-w-0
          focus:outline-none focus:ring-1"
        />
        {/* The element is allowed to shrink even down to 0px if necessary if min-w-0 */}

        {/* attachment  */}

        <button
          onClick={handleAttachmentClick}
          className="
        text-neutral-500 focus:text-white duration-300 transition-all
        "
        >
          <GrAttachment className="text-xl" />
        </button>

        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
        {/* attachment ends */}

        {/* emoji */}
        <div className="relative ">

          <button
            onClick={() => setEmojiPickerOpen(true)}
            className="text-neutral-500 focus:text-white duration-300 transition-all"
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>

          <div className="absolute bottom-12 -right-4 " ref={emojiRef}>
            <EmojiPicker
              theme={Theme.DARK}
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
              width={250}
              height={300}
            />
          </div>

        </div>
        {/* emoji ends */}

      </div>

      {/* flex item-1 : input , attachment and emoji ends */}

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
