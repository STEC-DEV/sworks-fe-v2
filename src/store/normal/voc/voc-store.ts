import api from "@/lib/api/api-manager";
import { useAuthStore } from "@/store/auth/auth-store";
import { Response } from "@/types/common/response";
import { ListData, ListMeta, ListState } from "@/types/list-type";
import { paramsCheck } from "@/utils/param";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface VocState {
  vocList: ListState<VocListItem>;
  getVocList: (searchParam: URLSearchParams) => Promise<void>;
  userPermission: UserServiceType[] | undefined;
  getUserPermission: () => Promise<void>;
  postAddVoc: (values: FormData) => Promise<Response<boolean>>;
}

export const useVocStore = create<VocState>()(
  devtools(
    persist<VocState>(
      (set, get) => ({
        vocList: { type: "loading" },
        getVocList: async (searchParam) => {
          const { enteredWorkplace } = useAuthStore.getState();
          //재로그인 대상
          if (!enteredWorkplace) return;
          const checkParams = paramsCheck(searchParam);
          checkParams.set("siteSeq", enteredWorkplace.siteSeq.toString());
          try {
            const res: Response<ListData<VocListItem>> = await api
              .get(`voc/w/sign/getvocloglist`, {
                searchParams: checkParams,
              })
              .json();

            set({ vocList: { type: "data", payload: res.data } });
          } catch (err) {
            console.log(err);
            toast.error("조회 실패");
          }
        },
        userPermission: undefined,
        getUserPermission: async () => {
          const { enteredWorkplace } = useAuthStore.getState();
          if (!enteredWorkplace) return;
          const searchParams = new URLSearchParams();
          searchParams.set("siteSeq", enteredWorkplace.siteSeq.toString());
          try {
            const res: Response<UserServiceType[]> = await api
              .get("voc/w/sign/getclassification", {
                searchParams: searchParams,
              })
              .json();

            set({ userPermission: res.data });
          } catch (err) {
            console.log(err);
          }
        },
        postAddVoc: async (values) => {
          try {
            const res: Response<boolean> = await api
              .post(`voc/w/addvoc`, {
                body: values,
              })
              .json();
            return res;
          } catch (err) {
            const res: Response<boolean> = {
              data: false,
              code: 500,
              message: "에러 발생",
            };
            return res;
          }
        },
      }),
      { name: "voc-store" }
    )
  )
);
