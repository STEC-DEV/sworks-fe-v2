import api from "@/lib/api/api-manager";
import { useAuthStore } from "@/store/auth/auth-store";
import { Response } from "@/types/common/response";
import { useQuery } from "@tanstack/react-query";

export interface DashNotice {
  id: string; // 현재 api에 없음
  title: string;
  isPin: boolean;
  creator: boolean;
  createDt: string;
}

export const defaultOptions = {
  staleTime: 60 * 1000, // 1분 캐시 유지
  refetchOnWindowFocus: false,
  retry: 1,
};

export const useNotice = () => {
  const { enteredWorkplace } = useAuthStore();

  const fetchData = () => {
    return api.get(`DashBoard/W/sign/GetNotice`).json<Response<DashNotice[]>>();
  };

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["dashboard", enteredWorkplace?.siteSeq ?? 0, "notices"],
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
