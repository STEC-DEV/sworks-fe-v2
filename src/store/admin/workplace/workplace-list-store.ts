import api from "@/lib/api-manager";
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
          const params = new URLSearchParams(window.location.search);
          console.log(params);
          const res = await api.get(`Site/W/Sign/AllSiteList`);

          console.log(await res.json());
        },
      }),
      { name: "workplace-list-store" }
    )
  )
);
