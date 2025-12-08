import { DeptEditType } from "@/components/form/admin/user/dept-edit";
import api from "@/lib/api/api-manager";
import { handleApiError } from "@/lib/api/errorHandler";
import { useUIStore } from "@/store/common/ui-store";
import { Response } from "@/types/common/response";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const DEPARTMENT_LOADING_KEYS = {
  LIST: "department_list",
} as const;

interface DeptState {
  loadingKeys: typeof DEPARTMENT_LOADING_KEYS;
  departmentList: Department[] | undefined;
  getDepartmentList: () => Promise<void>;
  postAddDept: (data: Record<string, string>) => Promise<void>;
  putUpdateDept: (data: DeptEditType) => Promise<void>;
  deleteDept: (seq: number) => Promise<void>;
}

export const useDeptStore = create<DeptState>()(
  devtools(
    persist<DeptState>(
      (set, get) => ({
        loadingKeys: DEPARTMENT_LOADING_KEYS,
        departmentList: undefined,
        getDepartmentList: async () => {
          const { setError, setLoading } = useUIStore.getState();
          setLoading(DEPARTMENT_LOADING_KEYS.LIST, true);
          try {
            const res = await api.get(`dept/w/sign/deptlist`);
            const data = ((await res.json()) as Response<Department[]>).data;
            set({ departmentList: data });
          } catch (err) {
            console.log(err);
            const errMessage = await handleApiError(err);
            setError(DEPARTMENT_LOADING_KEYS.LIST, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(DEPARTMENT_LOADING_KEYS.LIST, false);
          }
        },
        postAddDept: async (data) => {
          try {
            const res: Response<boolean> = await api
              .post("dept/w/sign/addDept", {
                json: data,
              })
              .json();

            if (res.data) toast.success("생성");
          } catch (err) {
            console.error(err);
            const errMessage = await handleApiError(err);
            toast.error(errMessage);
          }
        },
        putUpdateDept: async (data) => {
          try {
            const res: Response<boolean> = await api
              .put(`dept/w/sign/updatedept`, {
                json: data,
              })
              .json();

            toast.success("저장");
          } catch (err) {
            console.error(err);
            const errMessage = await handleApiError(err);
            toast.error(errMessage);
          }
        },
        deleteDept: async (seq) => {
          const params = new URLSearchParams();
          params.append("delSeq", seq.toString());

          try {
            const res: Response<boolean> = await api
              .delete(`dept/w/sign/deletedept`, {
                searchParams: params,
              })
              .json();
          } catch (err) {
            console.error(err);
            // const errMessage =
            //   err instanceof Error
            //     ? err.message
            //     : "부서 삭제 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            const errMessage = await handleApiError(err);
            toast.error(errMessage);
          }
        },
      }),
      { name: "dept-store" }
    )
  )
);
