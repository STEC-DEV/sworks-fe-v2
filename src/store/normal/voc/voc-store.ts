import api from "@/lib/api/api-manager";
import { useAuthStore } from "@/store/auth/auth-store";
import { useUIStore } from "@/store/common/ui-store";
import { UserServiceType } from "@/types/common/basic-code";
import { Response } from "@/types/common/response";
import { ListData } from "@/types/list-type";
import { paramsCheck } from "@/utils/param";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const VOC_LIST_LOADING_KEYS = {
  LIST: "voc_list",
} as const;

interface VocState {
  loadingKeys: typeof VOC_LIST_LOADING_KEYS;
  vocList: ListData<VocListItem> | null;
  getVocList: (searchParam: URLSearchParams) => Promise<void>;
  userPermission: UserServiceType[] | undefined;
  getUserPermission: () => Promise<void>;
  postAddVoc: (values: FormData) => Promise<string | null>;

  //민원접수 인증번호
  postCreateVerificationCode: (seq: number, phone: string) => Promise<void>;
  postValidationCode: (code: string, phone: string) => Promise<boolean>;
}

export const useVocStore = create<VocState>()(
  devtools(
    persist<VocState>(
      (set, get) => ({
        loadingKeys: VOC_LIST_LOADING_KEYS,
        vocList: null,
        getVocList: async (searchParam) => {
          const { enteredWorkplace } = useAuthStore.getState();
          //재로그인 대상
          if (!enteredWorkplace) return;
          const checkParams = paramsCheck(searchParam);
          checkParams.set("siteSeq", enteredWorkplace.siteSeq.toString());
          const { setError, setLoading } = useUIStore.getState();
          setLoading(VOC_LIST_LOADING_KEYS.LIST, true);
          try {
            const res: Response<ListData<VocListItem>> = await api
              .get(`voc/w/sign/getvocloglist`, {
                searchParams: checkParams,
              })
              .json();

            set({ vocList: res.data });
          } catch (err) {
            console.log(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "민원 조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            setError(VOC_LIST_LOADING_KEYS.LIST, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(VOC_LIST_LOADING_KEYS.LIST, false);
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
            const res: Response<string> = await api
              .post(`voc/w/addvoc`, {
                body: values,
              })
              .json();
            return res.data;
          } catch (err) {
            toast.error("문제가 발생하였습니다. 잠시후 다시 시도해주세요.");
            return null;
          }
        },
        postCreateVerificationCode: async (seq, phone) => {
          try {
            const res: Response<boolean> = await api
              .post(`voc/w/createauthcode`, {
                json: { vocSeq: seq, phoneNumber: phone },
              })
              .json();
            toast.message("인증번호를 발송하였습니다.");
          } catch (err) {
            console.error(err);
            toast.error("문제가 발생하였습니다. 잠시후 다시 시도해주세요.");
          }
        },
        postValidationCode: async (code, phone) => {
          try {
            const res: Response<boolean> = await api
              .post(`voc/w/validateauthcode`, {
                json: { authCode: code, phoneNumber: phone },
              })
              .json();
            if (!res.data) {
              toast.error("인증코드를 확인해주세요.");
            } else {
              toast.success("성공");
            }
            return res.data;
          } catch (err) {
            console.error(err);
            toast.error("문제가 발생하였습니다. 잠시후 다시 시도해주세요.");
            return false;
          }
        },
      }),
      { name: "voc-store" }
    )
  )
);
