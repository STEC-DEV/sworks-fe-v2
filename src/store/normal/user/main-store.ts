import api from "@/lib/api/api-manager";
import { useAuthStore } from "@/store/auth/auth-store";
import { Response } from "@/types/common/response";
import { ListMeta, ListState } from "@/types/list-type";
import {
  CreateUser,
  CreateUserClassification,
} from "@/types/normal/user/create";
import { convertRecordDataToFormData } from "@/utils/convert";
import { paramsCheck } from "@/utils/param";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UserMainState {
  userList: ListState<UserListItem>;
  getUserList: (param: URLSearchParams) => Promise<void>;
  /* 사용자 관련 */
  createUser: CreateUser;
  updateCreateUser: (value: Record<string, any>) => void;
  resetCreateUser: () => void;
  postAddUser: () => Promise<Response<boolean>>;
  //사용자 업무유형 조회
  createUserClassification: CreateUserClassification | undefined;
  getCreateUserClassification: () => Promise<void>;
}

const initialCreateUser: CreateUser = {
  codeSeq: undefined,
  userName: "",
  sabun: "",
  job: "",
  email: undefined,
  phone: "",
  images: [],
};

export const useUserMainStore = create<UserMainState>()(
  devtools(
    persist<UserMainState>(
      (set, get) => ({
        userList: { type: "loading" },
        getUserList: async (param) => {
          if (!param) return;
          const params = paramsCheck(param);
          //임시 사업장 정보
          const { enteredWorkplace } = useAuthStore.getState();

          if (!enteredWorkplace) return;

          params.set("siteSeq", enteredWorkplace.siteSeq.toString());

          try {
            const res = await api.get(`user/w/sign/userlist`, {
              searchParams: params,
            });

            const response = (await res.json()) as Response<{
              data: UserListItem[];
              meta: ListMeta;
            }>;

            set({ userList: { type: "data", ...response.data } });
          } catch (err) {
            console.log(err);
          }
        },
        createUser: initialCreateUser,
        updateCreateUser: (values) => {
          set((prev) => ({
            createUser: { ...prev.createUser, ...values },
          }));
        },
        resetCreateUser: () => {
          set({ createUser: initialCreateUser });
        },
        postAddUser: async () => {
          const { createUser } = get();
          const formData = convertRecordDataToFormData(createUser);

          try {
            const res: Response<boolean> = await api
              .post("user/w/sign/adduser", {
                body: formData,
              })
              .json();

            return res;
          } catch (err) {
            const response: Response<boolean> = {
              code: 500,
              message: "요청 중 오류가 발생했습니다.",
              data: false,
            };

            return response;
          }
        },
        createUserClassification: undefined,
        getCreateUserClassification: async () => {
          //임시 헤더로 변경될거임
          const { enteredWorkplace } = useAuthStore.getState();

          if (!enteredWorkplace) return;
          try {
            const res: Response<CreateUserClassification> = await api
              .get("user/w/sign/upsertclassification", {
                searchParams: { siteSeq: enteredWorkplace.siteSeq.toString() },
              })
              .json();

            set({ createUserClassification: res.data });
          } catch (err) {}
        },
      }),
      { name: "user-main-store" }
    )
  )
);
