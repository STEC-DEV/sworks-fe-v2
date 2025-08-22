import api from "@/lib/api/api-manager";
import { WorkplaceDetail } from "@/types/admin/workplace/workplace-detail";
import { Response } from "@/types/common/response";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  //접속 사이트 아이디
  workplaceId: number | undefined;
  setWorkplaceId: (workplaceId: number) => void;
  resetWorkplaceId: () => void;

  adminWorkplaceList: AdminWorkplaceSelectListItem[] | undefined;
  //관리자 일반모드 로그인 시 사업장 조회
  getAdminWorkplaceList: () => Promise<void>;
  //사업장 접속한 사업장 정보
  enteredWorkplace: WorkplaceDetail | undefined;
  //사업장 권한 조회
  getWorkplacePermission: (siteSeq?: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        workplaceId: undefined,
        setWorkplaceId: (workplaceId) => {
          set({ workplaceId: workplaceId });
        },
        resetWorkplaceId: () => {
          set({ workplaceId: undefined });
        },
        adminWorkplaceList: undefined,
        getAdminWorkplaceList: async () => {
          try {
            const res: Response<AdminWorkplaceSelectListItem[]> = await api
              .get(`login/w/sign/mysitelist`)
              .json();

            set({ adminWorkplaceList: res.data });
          } catch (err) {
            console.log(err);
          }
        },
        enteredWorkplace: undefined,
        getWorkplacePermission: async (siteSeq) => {
          try {
            const res: Response<WorkplaceDetail> = await api
              .post(`login/w/sign/permission`, {
                json: { siteSeq },
              })
              .json();

            const data = res.data;
            set({ enteredWorkplace: data });
          } catch (err) {
            console.log(err);
          }
        },
      }),
      { name: "auth-store" }
    )
  )
);
