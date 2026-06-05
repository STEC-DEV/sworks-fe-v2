import api from "@/lib/api/api-manager";
import { useAuthStore } from "@/store/auth/auth-store";
import { Response } from "@/types/common/response";
import { useQuery } from "@tanstack/react-query";
import { defaultOptions } from "./useNotices";

export interface VocTransition {
  dates: string;
  counts: number;
}

export const useVocTrend = () => {
  const { enteredWorkplace } = useAuthStore();

  const fetchData = () => {
    return api
      .get(`DashBoard/W/sign/GetVocTransition`)
      .json<Response<VocTransition[]>>();
  };

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["dashboard", enteredWorkplace?.siteSeq ?? 0, "vocTrend"],
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
