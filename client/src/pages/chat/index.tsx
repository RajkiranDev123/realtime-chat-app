import { useEffect } from "react";
import { useAppStore } from "@/store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {
  const {
    userInfo,
    selectedChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo?.profileSetup) {
      toast("Please setup your profile first to continue");
      navigate("/profile");
    }
    // userInfo → effect should re-run when user info changes
    // navigate → used inside effect , navigate from React Router is usually stable and won't change.
    // But ESLint still asks to include it.
  }, [userInfo, navigate]);
  return (
    <div className="flex h-[100vh] text-white overflow-hidden gap-1 bg-gray-300 p-2">
      {isUploading && (
        <div
          className="
          h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 
          flex items-center justify-center flex-col gap-5 backdrop-blur-lg
          "
        >
          <h5 className="text-5xl animate-pulse ">Uploading File</h5>
          {fileUploadProgress}
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
