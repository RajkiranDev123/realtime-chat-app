import { useAppStore } from "@/store";
import moment from "moment";
import { useRef, useEffect } from "react";

type User = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  image?: string;
  color?: number;
};

type UserRef = User | string;

type Message = {
  _id: string;
  content: string;
  messageType: string;
  fileUrl?: string;

  sender: UserRef;
  recipient: UserRef;
  createdAt: string;
};

const MessageContainer = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { selectedChatType, selectedChatData, userInfo, selectedChatMessages } =
    useAppStore();

  useEffect(() => {
    if (scrollRef.current) {
      // It is a DOM method that scrolls the page/container so a specific element becomes visible.
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderMessages = () => {
    let lastDate: string | null = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.createdAt).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.createdAt).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDmMessages(message)}
        </div>
      );
    });
  };

  const renderDmMessages = (message: Message) => {
    return (
      <div
        className={`${message.sender === selectedChatData?._id ? "text-right" : "text-left"}`}
      >
        <div
          className={`${
            message.sender !== selectedChatData?._id
              ? "bg-[#8417ff] text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33] text-white/80 border-[#ffffff]/20"
          } 
            border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>
      </div>
    );
  };
  return (
    // If you give flex-1 to MessageContainer, then it will take all remaining vertical space inside the flex column parent.
    // Parent = outer box
    // xs sm md lg xl 2xl....
    // In a flex column (flex-col): align-items: stretch is the default (items-stretch)
    // That means : Every child automatically stretches to full width of the parent , no need md:w-[60vw] here...
    <div
      className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 

    "
    >
      MessageContainer
    </div>
  );
};

export default MessageContainer;
