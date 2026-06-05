import api from "@/lib/api/api-manager";
import { useAuthStore } from "@/store/auth/auth-store";
import { Response } from "@/types/common/response";
import { useQuery } from "@tanstack/react-query";
import { defaultOptions } from "./useNotices";

export interface TodayVoc {
  unprocessed: number;
  processing: number;
  completed: number;
  total: number;
}

export const useTodayVoc = () => {
  const { enteredWorkplace } = useAuthStore();

  const fetchData = () => {
    return api
      .get(`DashBoard/W/sign/GetTodaySiteVoc`)
      .json<Response<TodayVoc>>();
  };

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["dashboard", enteredWorkplace?.siteSeq ?? 0, "todayVoc"],
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
