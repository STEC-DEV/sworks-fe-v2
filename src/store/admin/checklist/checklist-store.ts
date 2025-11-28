import api from "@/lib/api/api-manager";
import { ListData } from "@/types/list-type";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Response } from "@/types/common/response";
import { paramsCheck } from "@/utils/param";
import { useUIStore } from "@/store/common/ui-store";
import { toast } from "sonner";

export const COMMON_CHECKLIST_LOADING_KEYS = {
  LIST: "common_checklist",
} as const;

interface ChecklistState {
  loadingKeys: typeof COMMON_CHECKLIST_LOADING_KEYS;
  commonChecklist: ListData<ChecklistTableItem> | null;
  getCommonChecklist: () => Promise<void>;
}

export const useChecklistStore = create<ChecklistState>()(
  devtools(
    persist<ChecklistState>(
      (set, get) => ({
        loadingKeys: COMMON_CHECKLIST_LOADING_KEYS,
        commonChecklist: null,
        getCommonChecklist: async () => {
          if (typeof window === "undefined") return;
          const params = new URLSearchParams(window.location.search);
          const check = paramsCheck(params);

          const { setLoading, setError } = useUIStore.getState();
          setLoading(COMMON_CHECKLIST_LOADING_KEYS.LIST, true);

          try {
            const res: Response<ListData<ChecklistTableItem>> = await api
              .get(`checklist/w/sign/commchecklist`, {
                searchParams: check,
              })
              .json();

            set({ commonChecklist: res.data });
          } catch (err) {
            console.log(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "체크리스트 조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            setError(COMMON_CHECKLIST_LOADING_KEYS.LIST, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(COMMON_CHECKLIST_LOADING_KEYS.LIST, false);
          }
        },
      }),
      { name: "checklist-store" }
    )
  )
);
