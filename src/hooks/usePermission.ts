import { useAuthStore } from "@/store/auth/auth-store";

export const usePermission = () => {
  const { loginProfile: user } = useAuthStore();

  return {
    canEdit: user?.role === "시스템관리자" || user?.role === "마스터",
    canWorkerEdit:
      user?.role === "현장 관리자" ||
      user?.role === "시스템관리자" ||
      user?.role === "마스터" ||
      user?.role === "매니저",
  };
};
