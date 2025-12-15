import api from "@/lib/api/api-manager";
import { Admin, LoginProfile } from "@/types/admin/admin/admin.types";
import {
  UserWorkplaceDetail,
  WorkplaceDetail,
} from "@/types/admin/workplace/workplace-detail";
import { Response } from "@/types/common/response";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  loginProfile: LoginProfile | undefined;
  normalModeProfile: LoginProfile | undefined;
  adminProfile: Admin | undefined;
  //접속 사이트 아이디
  workplaceId: number | undefined;
  setWorkplaceId: (workplaceId: number) => void;
  resetWorkplaceId: () => void;
  resetPassword: (userSeq: string) => Promise<void>;

  //최초 로그인 시 패스워드 변경
  patchPasswordChange: (data: Record<string, any>) => Promise<void>;

  adminWorkplaceList: AdminWorkplaceSelectListItem[] | undefined;
  //관리자모드 프로필 조회
  getAdminProfile: () => Promise<void>;
  //관리자 일반모드 로그인 시 사업장 조회
  getAdminWorkplaceList: () => Promise<void>;
  //일반보드 프로필 조회
  getNormalModeProfile: () => Promise<void>;
  //사업장 접속한 사업장 정보
  enteredWorkplace: UserWorkplaceDetail | undefined;
  //사업장 권한 조회
  getWorkplacePermission: (siteSeq?: string) => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        loginProfile: undefined,
        normalModeProfile: undefined,
        adminProfile: undefined,
        workplaceId: undefined,
        setWorkplaceId: (workplaceId) => {
          set({ workplaceId: workplaceId });
        },
        resetWorkplaceId: () => {
          set({ workplaceId: undefined });
        },
        resetPassword: async (userSeq) => {
          try {
            const res = await api
              .put(`user/w/sign/clearuserpassword`, {
                json: parseInt(userSeq),
              })
              .json();
            toast.success("초기화");
          } catch (err) {
            console.error(err);
            toast.error("문제가 발생하였습니다. 잠시후 다시 시도해주세요.");
          }
        },
        patchPasswordChange: async (data) => {
          try {
            const res: Response<boolean> = await api
              .patch(`login/w/updatepassword`, {
                json: data,
              })
              .json();

            toast.success("변경되었습니다. 다시 로그인해주세요.");
          } catch (err) {
            console.error(err);
            toast.error("문제가 발생했습니다. 잠시후 다시 시도해주세요.");
          }
        },
        getAdminProfile: async () => {
          try {
            const res: Response<Admin> = await api
              .get(`adminuser/w/sign/adminprofile`)
              .json();

            set({ adminProfile: res.data });
            set({ loginProfile: res.data });
          } catch (err) {
            console.error(err);
            toast.error("관리자 프로필 조회 실패");
          }
        },
        adminWorkplaceList: undefined,
        getNormalModeProfile: async () => {
          try {
            const res: Response<LoginProfile> = await api
              .get(`user/w/sign/gettokenprofile`)
              .json();

            set({ normalModeProfile: res.data });
            set({ loginProfile: res.data });
          } catch (err) {
            console.error(err);
            toast.error("계정정보 조회 실패");
          }
        },
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
            const res: Response<UserWorkplaceDetail> = await api
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

        reset: () => {
          set({
            loginProfile: undefined,
            enteredWorkplace: undefined,
          });
        },
      }),
      { name: "auth-store" }
    )
  )
);
