"use client";

import { useSSENotifications } from "@/lib/sse-noti";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  NotificationType,
  useSSENotificationStore,
} from "../../store/normal/sse-store";

const PATH_TO_CATEGORY: Record<string, string> = {
  "/voc": "voc",
  "/schedule": "sch",
  "/notice": "notice",
  "/req-task": "req-task",
};

export function SSEProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { resetCount } = useSSENotificationStore();
  useSSENotifications();

  useEffect(() => {
    // 현재 경로에 해당하는 카테고리 찾기
    const category = Object.entries(PATH_TO_CATEGORY).find(([path]) =>
      pathname.startsWith(path)
    )?.[1];

    if (category) {
      console.log("✅ 읽음 처리:", category);

      resetCount(category as NotificationType);
    }
  }, [pathname, resetCount]);
  return <>{children}</>;
}
