import api from "@/lib/api/api-manager";
import { ListState } from "@/types/list-type";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface WorkplaceListState {
  workplaceList: ListState<Record<string, any>>;
  getWorkplaceList: () => Promise<void>;
}

export const useWorkplaceListStore = create<WorkplaceListState>()(
  devtools(
    persist<WorkplaceListState>(
      (set, get) => ({
        workplaceList: { type: "loading" },
        getWorkplaceList: async () => {
          if (typeof window === "undefined") return;
          const params = new URLSearchParams(window.location.search);

          if (
            params.size === 0 &&
            !params.get("pageNumber") &&
            !params.get("pageSize")
          ) {
            params.set("pageNumber", "1");
            params.set("pageSize", "20");
          }

          const res = await api.get(`Site/W/Sign/AllSiteList`, {
            searchParams: params,
          });

          console.log(await res.json());
        },
      }),
      { name: "workplace-list-store" }
    )
  )
);
