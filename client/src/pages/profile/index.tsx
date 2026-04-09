import React from "react";
import { useAppStore } from "@/store";

const Profile = () => {
  const { userInfo } = useAppStore();
  console.log(99, userInfo);
  return <div>{userInfo?.id}</div>;
};

export default Profile;
