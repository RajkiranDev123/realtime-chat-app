import { useEffect } from "react";
import { useAppStore } from "@/store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo?.profileSetup) {
      toast("Please setup profile to continue");
      navigate("/profile");
    }
    // userInfo → effect should rerun when user info changes
    // navigate → used inside effect , navigate from React Router is usually stable and won't change.
  }, [userInfo, navigate]);
  return (
    <div className="flex h-[100vh] text-white overflow-hidden bg-amber-200">
      <ContactsContainer />
      <EmptyChatContainer />
      <ChatContainer />
    </div>
  );
};

export default Chat;
