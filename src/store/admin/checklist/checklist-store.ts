import api from "@/lib/api/api-manager";
import { ListMeta, ListState } from "@/types/list-type";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Response } from "@/types/common/response";
interface ChecklistState {
  commonChecklist: ListState<ChecklistItem>;
  getCommonChecklist: () => Promise<void>;
}

export const useChecklistStore = create<ChecklistState>()(
  devtools(
    persist<ChecklistState>(
      (set, get) => ({
        commonChecklist: { type: "loading" },
        getCommonChecklist: async () => {
          if (typeof window === "undefined") return;
          const params = new URLSearchParams(window.location.search);

          if (
            params.size === 0 ||
            !params.get("pageNumber") ||
            !params.get("pageSize")
          ) {
            params.set("pageNumber", "1");
            params.set("pageSize", "20");
          }

          try {
            const res = await api.get(`checklist/w/sign/commchecklist`, {
              searchParams: params,
            });

            const response = (await res.json()) as Response<{
              data: ChecklistItem[];
              meta: ListMeta;
            }>;

            set({ commonChecklist: { type: "data", ...response.data } });
          } catch (err) {
            console.log(err);
          }
        },
      }),
      { name: "checklist-store" }
    )
  )
);
