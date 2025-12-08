import api from "@/lib/api/api-manager";
import { handleApiError } from "@/lib/api/errorHandler";
import { useUIStore } from "@/store/common/ui-store";
import { AdminListItem } from "@/types/admin/admin/user-list";
import {
  SelectWorkplaceList,
  WorkplaceListItem,
} from "@/types/admin/workplace/workplace-list";
import { Response } from "@/types/common/response";
import { ListData, ListMeta, ListState } from "@/types/list-type";
import { convertRecordDataToFormData, objectToFormData } from "@/utils/convert";
import { paramsCheck } from "@/utils/param";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const ADMIN_DETAIL_LOADING_KEYS = {
  INFO: "admin_detail_info",
  WORKPLACE: "admin_detail_workplace_list",
} as const;

interface AdminDetailState {
  loadingKeys: typeof ADMIN_DETAIL_LOADING_KEYS;
  admin: AdminDetail | null;
  getAdminDetail: (id: string) => Promise<void>;
  deleteAdmin: (id: string) => Promise<boolean>;
  resetAdmin: () => void;
  adminWorkplaceList: ListData<WorkplaceListItem> | null;
  getAdminWorkplaceList: (params: URLSearchParams, id: string) => Promise<void>;

  //--관리자 정보 수정--
  patchAdminInfo: (admin: Record<string, any>) => Promise<void>;

  //담당 사업장 수정 시 전체 조회 api
  getAllWorkplace: (id: string, search?: string) => Promise<void>;
  allWorkplace: WorkplaceListItem[] | undefined;
  //선택된 사업장
  selectedWorkplaceList: number[];
  //리스트 수정
  updateSelectedWorkplaces: (listId: number) => void;
  //담당 사업장 수정 put
  putAdminWorkplaceList: (userId: string) => Promise<void>;
}

export const useAdminDetailStore = create<AdminDetailState>()(
  devtools(
    persist<AdminDetailState>(
      (set, get) => ({
        loadingKeys: ADMIN_DETAIL_LOADING_KEYS,
        admin: null,
        getAdminDetail: async (id) => {
          const { setLoading, setError } = useUIStore.getState();
          setLoading(ADMIN_DETAIL_LOADING_KEYS.INFO, true);
          try {
            const res = await api.get(`adminuser/w/sign/getadmindetail`, {
              searchParams: { userSeq: id },
            });
            const response: Response<AdminDetail> = await res.json();

            set({ admin: response.data });
          } catch (err) {
            console.log(err);
            const errMessage = await handleApiError(err);
            setError(ADMIN_DETAIL_LOADING_KEYS.INFO, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(ADMIN_DETAIL_LOADING_KEYS.INFO, false);
          }
        },
        deleteAdmin: async (id) => {
          try {
            const res: Response<boolean> = await api
              .delete(`adminuser/w/sign/deleteadmin`, {
                searchParams: { delSeq: id },
              })
              .json();
            toast.success("삭제");
            return res.data;
          } catch (err) {
            console.error(err);
            const errMessage = await handleApiError(err);
            toast.error(errMessage);
            return false;
          }
        },
        resetAdmin: () => {
          set({ admin: undefined });
        },
        adminWorkplaceList: null,
        getAdminWorkplaceList: async (params, id) => {
          const checkParams = paramsCheck(params);
          checkParams.set("userSeq", id);
          const { setLoading, setError } = useUIStore.getState();
          setLoading(ADMIN_DETAIL_LOADING_KEYS.WORKPLACE, true);

          try {
            const res: Response<ListData<WorkplaceListItem>> = await api
              .get(`adminuser/w/sign/adminusersite`, {
                searchParams: params,
              })
              .json();

            set({
              adminWorkplaceList: res.data,
            });
          } catch (err) {
            console.log(err);
            const errMessage = await handleApiError(err);
            setError(ADMIN_DETAIL_LOADING_KEYS.WORKPLACE, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(ADMIN_DETAIL_LOADING_KEYS.WORKPLACE, false);
          }
        },
        patchAdminInfo: async (admin) => {
          const formData = objectToFormData(admin);

          try {
            const res: Response<number> = await api
              .patch(`adminuser/w/sign/updateadmin`, {
                body: formData,
              })
              .json();
            toast.success("저장");
          } catch (err) {
            console.log(err);
            const errMessage = await handleApiError(err);
            toast.error(errMessage);
          }
        },
        getAllWorkplace: async (id, search) => {
          try {
            const res: Response<object[]> = await api
              .get(`adminuser/w/sign/adminsiteclassification`, {
                searchParams: { userSeq: id, searchKey: search ?? "" },
              })
              .json();
            const data = res.data;

            set({ allWorkplace: data as WorkplaceListItem[] });
            set({
              selectedWorkplaceList: (data as SelectWorkplaceList[])
                .filter((v, i) => v.isAdminSite === true)
                .map((v) => v.siteSeq),
            });
          } catch (err) {
            console.log(err);
            const errMessage = await handleApiError(err);
            toast.error(errMessage);
          }
        },
        allWorkplace: undefined,
        selectedWorkplaceList: [],
        updateSelectedWorkplaces: (id) => {
          set((prev) => {
            const workplaces = prev.selectedWorkplaceList;
            return {
              selectedWorkplaceList: workplaces.includes(id)
                ? workplaces.filter((v) => v !== id)
                : [...workplaces, id],
            };
          });
        },
        putAdminWorkplaceList: async (userId) => {
          const { selectedWorkplaceList } = get();

          try {
            const res: Response<boolean> = await api
              .put(`adminuser/w/sign/updateadminsite`, {
                json: {
                  userSeq: userId,
                  siteSeq: selectedWorkplaceList,
                },
              })
              .json();
            toast.success("저장");
          } catch (err) {
            console.log(err);
            const errMessage = await handleApiError(err);
            toast.error(errMessage);
          }
        },
      }),
      { name: "admin-detail-store" }
    )
  )
);
