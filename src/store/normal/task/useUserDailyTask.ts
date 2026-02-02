import api from "@/lib/api/api-manager";
import { Response } from "@/types/common/response";
import { UserDailyTaskDetail } from "@/types/normal/task/user-daily-deatil";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UserDailyTaskState {
  data: UserDailyTaskDetail[];
  isLoading: boolean;
  getData: (userSeq: string) => Promise<void>;
}

export const useUserDailyTaskStore = create<UserDailyTaskState>()(
  devtools(
    persist<UserDailyTaskState>(
      (set) => ({
        data: [],
        isLoading: false,
        getData: async (userSeq) => {
          try {
            set({ isLoading: true });
            const res: Response<UserDailyTaskDetail[]> = await api
              .get("sitetask/w/sign/getusertaskdetail", {
                searchParams: { userSeq },
              })
              .json();

            console.log(res.data);
            set({ isLoading: false, data: res.data });
          } catch (err) {
            console.error(err);
            set({ isLoading: false });
          }
        },
      }),
      {
        name: "user-dailyTask-store",
      },
    ),
  ),
);
