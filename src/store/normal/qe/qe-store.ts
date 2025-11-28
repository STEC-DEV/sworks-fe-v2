import { QeAddFormValueType } from "@/components/form/normal/qe/add";
import api from "@/lib/api/api-manager";
import { useUIStore } from "@/store/common/ui-store";
import { Response } from "@/types/common/response";
import { ListData } from "@/types/list-type";
import { QeChecklist } from "@/types/normal/qe/checklist";
import { EvaluateListItem, QeListItem } from "@/types/normal/qe/qe";
import { paramsCheck } from "@/utils/param";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const QE_LOADING_KEYS = {
  LIST: "qe_list",
  EVALUATE_LIST: "evaluate_list",
  EVALUATE_CHECKLIST: "evaluate_checklist",
} as const;

interface QeState {
  loadingKeys: typeof QE_LOADING_KEYS;
  qeList: ListData<QeListItem> | null;
  getQeList: (searchParams: URLSearchParams) => Promise<void>;
  evaluateList: EvaluateListItem[] | null;
  getEvaluateList: () => Promise<void>;
  evaluateChecklist: QeChecklist | null;
  getEvaluateChecklist: (searchParams: URLSearchParams) => Promise<void>;
  postAddEvaluate: (data: QeAddFormValueType) => Promise<boolean>;
}

export const useQeStore = create<QeState>()(
  devtools(
    persist<QeState>(
      (set, get) => ({
        loadingKeys: QE_LOADING_KEYS,
        qeList: null,
        getQeList: async (searchParams) => {
          const checkParams = paramsCheck(searchParams);
          const { setLoading, setError } = useUIStore.getState();
          setLoading(QE_LOADING_KEYS.LIST, true);
          try {
            const res: Response<ListData<QeListItem>> = await api
              .get(`qe/w/sign/getallqelist`, {
                searchParams: searchParams,
              })
              .json();
            set({ qeList: res.data });
          } catch (err) {
            console.error(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "품질평가 조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            setError(QE_LOADING_KEYS.LIST, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(QE_LOADING_KEYS.LIST, false);
          }
        },
        evaluateList: null,
        getEvaluateList: async () => {
          const { setError, setLoading } = useUIStore.getState();
          setLoading(QE_LOADING_KEYS.EVALUATE_LIST, true);
          try {
            const res: Response<EvaluateListItem[]> = await api
              .get(`qe/w/sign/getqelist`)
              .json();

            set({ evaluateList: res.data });
          } catch (err) {
            console.error(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "평가항목 조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            setError(QE_LOADING_KEYS.EVALUATE_LIST, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(QE_LOADING_KEYS.EVALUATE_LIST, false);
          }
        },
        evaluateChecklist: null,
        getEvaluateChecklist: async (searchParams) => {
          const { setError, setLoading } = useUIStore.getState();
          setLoading(QE_LOADING_KEYS.EVALUATE_CHECKLIST, true);
          try {
            const res: Response<QeChecklist> = await api
              .get(`qe/w/sign/getqedetail`, { searchParams: searchParams })
              .json();
            const transformData = {
              ...res.data,
              mains: res.data.mains.map((main) => ({
                ...main,
                subs: main.subs.map((sub) => ({
                  ...sub,
                  details: sub.details.map((detail) => ({
                    ...detail,
                    score: undefined,
                  })),
                })),
              })),
            };
            set({ evaluateChecklist: transformData });
          } catch (err) {
            const errMessage =
              err instanceof Error
                ? err.message
                : "평가 체크리스트 조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            setError(QE_LOADING_KEYS.EVALUATE_CHECKLIST, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(QE_LOADING_KEYS.EVALUATE_CHECKLIST, true);
          }
        },
        postAddEvaluate: async (data) => {
          try {
            const res: Response<boolean> = await api
              .post(`qe/w/sign/addqeinfo`, {
                json: data,
              })
              .json();
            return res.data;
          } catch (err) {
            console.error(err);
            return false;
          } finally {
          }
        },
      }),
      { name: "qe-store" }
    )
  )
);
