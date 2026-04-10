import React, { useEffect } from "react";
import { useAppStore } from "@/store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo?.profileSetup) {
      toast("Please setup profile to continue");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  return <div>Chat</div>;
};

export default Chat;
