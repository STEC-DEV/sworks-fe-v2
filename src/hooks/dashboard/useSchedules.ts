import api from "@/lib/api/api-manager";
import { useAuthStore } from "@/store/auth/auth-store";
import { Response } from "@/types/common/response";
import { useQuery } from "@tanstack/react-query";
import { defaultOptions } from "./useNotices";

export interface DashSch {
  dates: string;
  schSeq: number;
  schTitle: string;
  viewColor: string;
  isAllday: boolean;
  serviceTypeSeq: number;
  serviceTypeName: string;
  startTime: string;
  endTime: string;
}
export const useSchedules = () => {
  const { enteredWorkplace } = useAuthStore();

  const fetchData = () => {
    return api.get(`DashBoard/W/sign/GetSch`).json<Response<DashSch[]>>();
  };

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["dashboard", enteredWorkplace?.siteSeq ?? 0, "schedules"],
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
