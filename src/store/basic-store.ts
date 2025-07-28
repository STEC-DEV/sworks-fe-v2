import api from "@/lib/api/api-manager";
import { BasicCodeType } from "@/types/common/basic-code";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface BasicState {
  basicCode: BasicCodeType;
  getBasicCode: () => Promise<void>;
}

export const useBasicStore = create<BasicState>()(
  devtools(
    persist<BasicState>(
      (set, get) => ({
        basicCode: {},
        getBasicCode: async () => {
          try {
            const res = await api.get(`Comm/W/GetBCCode`);
            const data: Record<string, any> = await res.json();
            if (!res.ok) return;

            set({ basicCode: data.data });
          } catch (err) {
            console.log(err);
          }
        },
      }),
      { name: "basic-store" }
    )
  )
);
