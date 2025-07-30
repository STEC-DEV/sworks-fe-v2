import api from "@/lib/api/api-manager";
import { Response } from "@/types/common/response";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface DeptState {
  departmentList: Department[] | undefined;
  getDepartmentList: () => Promise<void>;
}

export const useDeptStore = create<DeptState>()(
  devtools(
    persist<DeptState>(
      (set, get) => ({
        departmentList: undefined,
        getDepartmentList: async () => {
          const res = await api.get(`dept/w/sign/deptlist`);
          const data = ((await res.json()) as Response<Department[]>).data;
          set({ departmentList: data });
        },
      }),
      { name: "dept-store" }
    )
  )
);
