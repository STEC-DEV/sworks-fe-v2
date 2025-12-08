import { useNotificationStore } from "@/store/normal/notification/noti";
import React from "react";

interface SSENotification {
  type: string;
  title: string;
  message: string;
  data?: any;
}

const SSENotificationListener = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  return <div></div>;
};

export default SSENotificationListener;
