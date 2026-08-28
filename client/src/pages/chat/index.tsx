import { useEffect } from "react";
import { useAppStore } from "@/store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// components
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {
  const {
    userInfo,
    selectedChatType,
    //
    isUploading,
    isDownloading,
    //
    fileUploadProgress,
    fileDownloadProgress,
  } = useAppStore();

  const navigate = useNavigate();

  useEffect(() => {
    // If you access a property of null or undefined, JavaScript throws a TypeError.
    // TypeError: Cannot read properties of null (reading 'name')
    if (userInfo && !userInfo.profileSetup) {
      // or if(userInfo?.profileSetup)
      toast("Please setup your profile first to continue.");
      navigate("/profile");
    }
    // userInfo → effect should re-run when user info changes
    // navigate → used inside effect , navigate from React Router is usually stable and won't change.
    // But ESLint still asks to include it.
  }, [userInfo, navigate]);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden gap-0.5 bg-gray-500 p-1">
      {isUploading && (
        <div
          className="
          h-[100vh] w-[100vw] z-5 fixed inset-0 bg-black/80 
          flex flex-col items-center justify-center  gap-5 backdrop-blur-xs
          "
        >
          <h5 className="text-3xl animate-pulse ">Uploading File...</h5>
          {fileUploadProgress}%
        </div>
      )}
      {/* 
      Cover the parent → absolute inset-0 ==> used in child
      Cover the screen → fixed inset-0 ==> used in the element */}
      {/* inset-0 = top : 0 , right : 0 ,  bottom : 0 and left : 0 */}

      {isDownloading && (
        <div
          className="
          h-[100vh] w-[100vw] fixed inset-0 z-10  bg-black/80 
          flex items-center justify-center flex-col gap-5 backdrop-blur-xs
          "
        >
          {/* backdrop-blur-lg : whatever behind this div appears blurred  (glassmorphism effect). */}
          <h5 className="text-3xl animate-pulse">Downloading File...</h5>
          {fileDownloadProgress}%
        </div>
      )}

      <ContactsContainer />

      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
};

export default Chat;
