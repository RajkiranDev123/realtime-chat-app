import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import {
  GET_ALL_MESSAGES_ROUTE,
  GET_CHANNEL_MESSAGES,

} from "@/utils/constants";
import moment from "moment";
import { useRef, useEffect, useState } from "react";

import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { MdDelete } from "react-icons/md";
import { Eye } from "lucide-react";


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
  content?: string;
  // message.content is always guaranteed to exist, no ts complain
  messageType: string;
  fileUrl?: string;
  // ? == string | undefined , so ts complains

  sender: UserRef;
  recipient?: UserRef;
  createdAt: string;
};

const MessageContainer = () => {

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const {
    selectedChatType,
    //
    selectedChatData,
    //
    userInfo,
    //
    selectedChatMessages,
    setSelectedChatMessages,
    //
    setIsDownloading,
    setFileDownloadProgress,
  } = useAppStore();

  const [showImage, setShowImage] = useState(false);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const getMessages = async () => {
    
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
    const getChannelMessages = async () => {
      try {
        const res = await apiClient.get(
          `${GET_CHANNEL_MESSAGES}/${selectedChatData?._id}`,
          { withCredentials: true },
        );
        if (res.data.messages) {
          setSelectedChatMessages(res.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedChatData?._id) { // selectedChatData?._id is receiver / channel id
      if (selectedChatType === "contact") getMessages();
      else if (selectedChatType === "channel") getChannelMessages();
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

    setShowImage(false)

    setIsDownloading(true);
    setFileDownloadProgress(0);

    const res = await apiClient.get(`${url}`, {
      responseType: "blob", // Treat the server response as binary file data like pdf , jpg etc

      // onDownloadProgress = Axios download progress callback.
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;

        if (total) {
          const percentCompleted = Math.round((loaded * 100) / total);
          setFileDownloadProgress(percentCompleted);
        }
      },
    });
    
    // createObjectURL() creates a temporary browser URL pointing to that Blob.
    // the browser creates and manages a temporary Blob URL in its memory/resource storage.
    // blob:http://localhost/abc123
    const urlBlob = window.URL.createObjectURL(new Blob([res.data]));
   

    const link = document.createElement("a");
    link.href = urlBlob;
    // <a href="blob:http://localhost/abc123">

    // .pop() returns the last item OR undefined if array is empty
    // ?? only uses fallback for null or undefined.
    link.setAttribute("download", url.split("/").pop() ?? "download");
    // <a href="blob:..." download="myfile.pdf">
    // So download is an HTML <a> attribute specifically used to trigger downloading.
    // we can give a name too!

    document.body.appendChild(link);

    link.click(); // Programmatically click it
    link.remove(); // Remove the <a> You don't need that temporary element anymore.

    window.URL.revokeObjectURL(urlBlob); // "I'm finished using this temporary Blob URL. Release its memory

    setIsDownloading(false);
    setFileDownloadProgress(0);

  };

  const renderMessages = () => {

    let lastDate: string | null = null;

    return selectedChatMessages.map((message, index) => {

      const messageDate = moment(message.createdAt).format("YYYY-MM-DD");

      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index} className="">

          {showDate && (
            <div className="text-center text-white my-2 border-b rounded-sm">
              {moment(message.createdAt).format("LL")} 
            </div>
          )}
           
          {selectedChatType === "contact" && renderDmMessages(message)}

          {selectedChatType === "channel" && renderChannelMessages(message)}

        </div>
      );

    });

  };

  // render dm messagee
  const renderDmMessages = (message: Message) => {
    
    return (
      
      <div className={`${message.sender === selectedChatData?._id ? "text-left" : "text-right"} `}>

        {message.messageType === "text" && (
           <>
            {selectedMessage === message._id && 
            <div className={` flex ${message.sender === selectedChatData?._id ? "justify-start":"justify-end"}  `}>
            <MdDelete className="text-2xl text-red-500 cursor-pointer  hover:text-red-400"/>
            </div>
            }

          <div onClick={()=>setSelectedMessage(selectedMessage === message._id ? null : message._id)}
            className={`${
              message.sender !== selectedChatData?._id
                ? "bg-[#730beb] text-white/90 border-[#8417ff]/50"
                : "bg-[#2a2b33] text-white/90 border-[#ffffff]/20"
            } 
             ${selectedMessage === message._id ? "border-2 border-white" : "border"}  
            inline-block p-4 rounded my-1 max-w-[50%] break-words cursor-pointer text-left`}
          >

             {message.content}

          </div>
          </>
        )}

        {/* if message is of file type */}

        {message.messageType === "file" && (
          <>

            {selectedMessage === message._id && 
            <div  className={`flex  ${message.sender === selectedChatData?._id ? "justify-start":"justify-end"}  `}>
            <MdDelete className="text-2xl text-red-500 cursor-pointer  hover:text-red-400"/>
            </div>
            }

          <div onClick={()=>setSelectedMessage(selectedMessage === message._id ? null : message._id)}
            className={`${
              message.sender !== selectedChatData?._id
                ? "bg-[#730beb] text-white/90 border-[#8417ff]/50"
                : "bg-[#2a2b33] text-white/90 border-[#ffffff]/20"
            } 
           inline-block p-1 rounded my-1 max-w-[50%] break-words cursor-pointer
           ${selectedMessage === message._id ? "border-2 border-white" : "border"}  
            `}
          >

            {/* for image */}
            {message.fileUrl && checkIfImage(message.fileUrl) ? (
              // TS already knows message.fileUrl exists.
              // But inside onClick, narrowing is lost sometimes because of closure/function scope.
              // So just use non-null assertion:
              <div
                className="cursor-pointer"
           
              >
                <img
                  src={`${message.fileUrl}`}
                  height={200}
                  width={200}
                  className="object-cover rounded-xs"
                />

               {/* eye */}
                <div className="flex justify-center items-center"
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl!);
                }}
                >
                  <Eye/>
                </div>

              </div>
            ) : (
              //  file
              <div className="flex items-center justify-center gap-2 flex-wrap ">

                <span className=""> 
                  <MdFolderZip className="text-fuchsia-950 text-2xl"/>
               </span>

                <span className="break-all">{message.fileUrl?.split("/").pop()}</span>

                <span
                  onClick={() =>
                    message.fileUrl && downloadFile(message.fileUrl)
                  }
                  className="bg-black/20 p-1 text-md rounded-full
                hover:bg-black/50 cursor-pointer transition-all duration-300"
                >
                  <IoMdArrowRoundDown />
                </span>

              </div>

            )}

          </div>
          </>
        )}
        
        {/* if message is of file type */}

        {/* time */}
        <div className="text-xs text-white/90 mb-4">
          {moment(message.createdAt).format("LT")}
        </div>
        {/* time */}

      </div>
    );
  };

  // This is a TypeScript type guard that narrows sender from UserRef to User.
  // type UserRef = string | User
  const isUser = (sender: UserRef): sender is User =>
    typeof sender !== "string";

  //
  const getSenderId = (sender: UserRef) =>
    typeof sender === "string" ? sender : sender._id;

  // render channel messages
  const renderChannelMessages = (message: Message) => {
    const senderId = getSenderId(message.sender);
    const isMine = senderId === userInfo?.id;

    return (
      <div className={`mt-5  ${isMine ? "text-right" : "text-left"}`}>

        {/* text msg */}
        {message.messageType === "text" && (
          <div
            className={`${
              isMine
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/20"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 my-1 max-w-[50%] break-words ml-9`}
          >
            {message.content}
          </div>
        )}
        {/* text msg ends */}

        {/* file  */}

        {message.messageType === "file" && (

          <div
            className={`${
              isMine
                ? "bg-[#8417ff] text-white/80 border-[#8417ff]/50"
                : "bg-[#2a2b33] text-white/80 border-[#ffffff]/20"
            } 
            border inline-block p-2 rounded my-1 max-w-[50%] break-words`}
          >
            {message.fileUrl && checkIfImage(message.fileUrl) ? (
              // TS already knows message.fileUrl exists.
              // But inside onClick, narrowing is lost sometimes because of closure/function scope.
              // So just use non-null assertion:
              <div
                className="cursor-pointer"
             
              >
                <img
                  src={`${message.fileUrl}`}
                  height={200}
                  width={200}
                />
                <div className="flex justify-center items-center">
                  <Eye
                  onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl!);
                }}
                  />
                </div>
              </div>
            ) : (

              <div className="flex items-center justify-center gap-4 flex-wrap">

                <span className="">
                  <MdFolderZip className="text-fuchsia-950" />
                </span>

                <span className="break-all">{message.fileUrl?.split("/").pop()}</span>

                <span
                  onClick={() =>
                    message.fileUrl && downloadFile(message.fileUrl)
                  }
                  className="bg-black/20  text-2xl rounded-full
                hover:bg-black/50 cursor-pointer transition-all duration-300"
                >
                  <IoMdArrowRoundDown />
                </span>

              </div>

            )}
          </div>
        )}

        {/* file ends  */}

        {/* if me then only content and time otherwise profile pic and name */}
        {isMine ? (
          <div className="text-xs text-white mt-1">
            {moment(message.createdAt).format("LT")}
          </div>
        ) : (

          <div className="flex items-center justify-start gap-2 ">

            <Avatar className="h-6 w-6 rounded-full overflow-hidden">

              {isUser(message.sender) && message.sender.image && (

                <AvatarImage
                  src={`${message.sender.image}`}
                  alt="profile"
                  className="object-cover "
                />
              )}

              <AvatarFallback
                className={`uppercase h-6 w-6 text-md
                            flex items-center justify-center
                            rounded-full ${getColor(isUser(message.sender) ? (message.sender.color ?? 0) : 0)}
                          `}
                // ts says : “I can’t pass undefined into something that requires a number”
                // ?? ==> It gives a default value only when the left side is null or undefined.
                // nullish coalescing operator.
              >
                {isUser(message.sender)
                  ? (message.sender.firstName?.[0] ?? message.sender.email?.[0])
                  : "U"}
                  
              </AvatarFallback>

            </Avatar>
             
             {/* first and last name */}
            <span>
              {isUser(message.sender)
                ? `${message.sender.firstName ?? ""} ${message.sender.lastName ?? ""}`
                : "Unknown"}
            </span>

            {/* time */}
            <span className="text-xs text-white">
              {moment(message.createdAt).format("LT")}
            </span>
            {/* time */}

          </div>
        )}

        {/*  */}

      </div>
    );
  };

  // jsx

  return (
    // If you give flex-1 to MessageContainer, then it will take all remaining vertical space inside the flex column parent.
    // Parent = outer box
    // xs sm md lg xl 2xl....
    // In a flex column (flex-col): align-items: stretch is the default (items-stretch)
    // That means : Every child automatically stretches to full width of the parent , no need md:w-[60vw] here...
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-3 px-8">

      {renderMessages()}

       {/* self close div */}
      <div ref={scrollRef} />

      {/* modal for image show  */}
      {showImage && (
        <div
          className="fixed z-1000 inset-0 flex items-center
          justify-center backdrop-blur-lg flex-col
          "
        >

          {/* col item-1 : img */}
          <div className="bg-gray-500 p-1 m-2 rounded-sm">
            <img
              className="h-[70vh]  "
              src={`${imageUrl}`}
            />
          </div>

          {/* download and close button col item-2 */}
          <div className="flex gap-5">

            <button
              onClick={() => imageUrl && downloadFile(imageUrl)}
              className="bg-black/20 p-3 text-xl rounded-full hover:bg-black/50
            cursor-pointer transition-all duration-300"
            >
              <IoMdArrowRoundDown />
            </button>

            <button
              onClick={() => {
                setShowImage(false);
                setImageUrl(null);
              }}
              className="bg-black/20 p-3 text-xl rounded-full hover:bg-black/50
            cursor-pointer transition-all duration-300"
            >
              <IoCloseSharp />
            </button>

          </div>
            {/* download and close button */}

        </div>
      )}
      {/* modal for image show ends */}

    </div>
  );

};

export default MessageContainer;
