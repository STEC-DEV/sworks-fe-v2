import { SSENotification } from "@/types/normal/sse-noti";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type NotificationType = "voc" | "sch" | "req" | "notice";

export interface NotificationCounts {
  voc: number;
  sch: number;
  req: number;
  notice: number;
}

interface SSEState {
  sseNotification: SSENotification[] | null;
  counts: NotificationCounts;
  isConnected: boolean;

  //actions
  addSSENotification: () => void;
  incrementCount: (type: NotificationType) => void;
  resetCount: (type: NotificationType) => void;
  setConnected: (connected: boolean) => void;
  clearAllCounts: () => void;
}

export const useSSENotificationStore = create<SSEState>()(
  devtools(
    persist<SSEState>(
      (set) => ({
        sseNotification: [],
        counts: {
          voc: 0,
          notice: 0,
          req: 0,
          sch: 0,
        },
        isConnected: false,
        addSSENotification: () => {},
        incrementCount: (type) => {
          set((state) => ({
            counts: { ...state.counts, [type]: state.counts[type] + 1 },
          }));
        },
        resetCount: (type) => {
          console.log("리셋 타입 :", type);
          set((state) => ({
            counts: { ...state.counts, [type]: 0 },
          }));
        },
        setConnected: (connected) => {},
        clearAllCounts: () => {
          set((state) => ({
            counts: {
              voc: 0,
              notice: 0,
              req: 0,
              sch: 0,
            },
          }));
        },
      }),
      { name: "sse-alarm" }
    )
  )
);
