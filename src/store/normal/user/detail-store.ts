import { UserEditFormType } from "@/components/form/normal/user/edit";
import api from "@/lib/api/api-manager";
import { useUIStore } from "@/store/common/ui-store";
import { Response } from "@/types/common/response";
import { User } from "@/types/normal/user/list";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const USER_DETAIL_LOADING_KEYS = {
  DETAIL: "user_detail",
} as const;

interface UserDetailState {
  loadingKeys: typeof USER_DETAIL_LOADING_KEYS;
  user: User | null;
  getUserDetail: (userSeq: string) => Promise<void>;
  patchUpdateUser: (data: FormData) => Promise<void>;
  deleteUser: (userSeq: string) => Promise<boolean>;
}

export const useUserDetailStore = create<UserDetailState>()(
  devtools(
    persist<UserDetailState>(
      (set, get) => ({
        loadingKeys: USER_DETAIL_LOADING_KEYS,
        user: null,
        getUserDetail: async (userSeq) => {
          const { setError, setLoading } = useUIStore.getState();
          setLoading(USER_DETAIL_LOADING_KEYS.DETAIL, true);
          try {
            const res: Response<User> = await api
              .get(`user/w/sign/getuserprofile`, {
                searchParams: { userSeq: userSeq },
              })
              .json();

            set({ user: res.data });
          } catch (err) {
            console.error(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "사용자 조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            setError(USER_DETAIL_LOADING_KEYS.DETAIL, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(USER_DETAIL_LOADING_KEYS.DETAIL, false);
          }
        },
        patchUpdateUser: async (data) => {
          try {
            const res: Response<boolean> = await api
              .patch(`user/w/sign/updateuser`, {
                body: data,
              })
              .json();

            toast.success("저장");
          } catch (err) {
            console.error(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "사용자 수정 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            toast.error(errMessage);
          }
        },
        deleteUser: async (userSeq) => {
          try {
            const res: Response<boolean> = await api
              .delete(`user/w/sign/deluser`, {
                searchParams: { delSeq: userSeq },
              })
              .json();

            toast.success("삭제");
            return res.data;
          } catch (err) {
            console.error(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "사용자 삭제 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            toast.error(errMessage);
            return false;
          }
        },
      }),
      { name: "user-detail-store" }
    )
  )
);
