import api from "@/lib/api/api-manager";
import { useAuthStore } from "@/store/auth/auth-store";
import { Response } from "@/types/common/response";
import { useQuery } from "@tanstack/react-query";
import { defaultOptions } from "./useNotices";

export interface TodayTaskCount {
  notStartedCount: number;
  inProgressCount: number;
  completedCount: number;
}

export const useTodayTask = () => {
  const { enteredWorkplace } = useAuthStore();

  const fetchData = () => {
    return api
      .get(`DashBoard/W/sign/GetTodaySiteTaskCount`)
      .json<Response<TodayTaskCount>>();
  };

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["dashboard", enteredWorkplace?.siteSeq ?? 0, "todayTask"],
    queryFn: fetchData,
    select: (res) => res.data,
    enabled: !!enteredWorkplace?.siteSeq,
    ...defaultOptions,
  });

  return {
    data,
    isError,
    isLoading,
    error,
  };
};
