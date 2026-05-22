import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import moment from "moment";
import { useRef, useEffect, useState } from "react";

import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";

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
  // message.content is always guaranteed to exist, no ts complain
  messageType: string;
  fileUrl?: string;
  // ? == string | undefined , so ts complains

  sender: UserRef;
  recipient: UserRef;
  createdAt: string;
};

const MessageContainer = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useAppStore();

  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const getMessages = async () => {
      console.log(6754, selectedChatData?._id);
      try {
        const res = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData?._id },
          { withCredentials: true },
        );
        if (res.data.messages) {
          setSelectedChatMessages(res.data.messages);
        }
      } catch (error) {
        console.log({ error });
      }
    };
    if (selectedChatData?._id) {
      if (selectedChatType === "contact") getMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      // It is a DOM method that scrolls the page/container so a specific element becomes visible.
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath: string) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  // Fetch file from backend
  // Convert to downloadable browser URL
  // Create hidden link
  // Auto click it
  // Browser downloads file
  // Cleanup memory
  const downloadFile = async (url: string) => {
    const res = await apiClient.get(`${HOST}/${url}`, { responseType: "blob" });

    const urlBlob = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    // .pop() returns the last item OR undefined if array is empty
    // ?? only uses fallback for null or undefined.
    link.setAttribute("download", url.split("/").pop() ?? "download");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
  };

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
        className={`${message.sender === selectedChatData?._id ? "text-left" : "text-right"}`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender !== selectedChatData?._id
                ? "bg-[#8417ff] text-white/80 border-[#8417ff]/50"
                : "bg-[#2a2b33] text-white/80 border-[#ffffff]/20"
            } 
            border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender !== selectedChatData?._id
                ? "bg-[#8417ff] text-white/80 border-[#8417ff]/50"
                : "bg-[#2a2b33] text-white/80 border-[#ffffff]/20"
            } 
            border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.fileUrl && checkIfImage(message.fileUrl) ? (
              // TS already knows message.fileUrl exists.
              // But inside onClick, narrowing is lost sometimes because of closure/function scope.
              // So just use non-null assertion:
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl!);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl?.split("/").pop()}</span>
                <span
                  onClick={() =>
                    message.fileUrl && downloadFile(message.fileUrl)
                  }
                  className="bg-black/20 p-3 text-2xl rounded-full
                hover:bg-black/50 cursor-pointer transition-all duration-300"
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-600">
          {moment(message.createdAt).format("LT")}
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
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div
          className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center
          justify-center backdrop-blur-lg flex-col
          "
        >
          <div>
            <img
              className="h-[80vh] w-full bg-cover"
              src={`${HOST}/${imageUrl}`}
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              onClick={() => imageUrl && downloadFile(imageUrl)}
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50
            cursor-pointer transition-all duration-300"
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              onClick={() => {
                setShowImage(false);
                setImageUrl(null);
              }}
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50
            cursor-pointer transition-all duration-300"
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
