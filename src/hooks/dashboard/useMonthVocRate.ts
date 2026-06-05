import api from "@/lib/api/api-manager";
import { useAuthStore } from "@/store/auth/auth-store";
import { Response } from "@/types/common/response";
import { useQuery } from "@tanstack/react-query";
import { defaultOptions } from "./useNotices";

export interface MonthVocRate {
  completedPercent: number;
  //   status: string; // "양호" | "주의" | "위험"
}
export const useMonthVocRate = () => {
  const { enteredWorkplace } = useAuthStore();

  const fetchData = () => {
    return api
      .get(`DashBoard/W/sign/GetMonthVocRate`)
      .json<Response<MonthVocRate>>();
  };

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["dashboard", enteredWorkplace?.siteSeq ?? 0, "monthVocRate"],
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
