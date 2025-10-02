import api from "@/lib/api/api-manager";
import { UserServiceType } from "@/types/common/basic-code";
import { Response } from "@/types/common/response";
import { ListData, ListState } from "@/types/list-type";
import { paramsCheck } from "@/utils/param";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface RequestState {
  reqTaskList: ListState<RequestListItem>;
  getRequestTask: (searchParams: URLSearchParams) => Promise<void>;
  //업무요청가능 업무유형 조회
  addServiceType: UserServiceType[] | undefined;
  getServiceType: () => Promise<void>;
  //업무요청 등록
  postAddReqTask: (formData: FormData) => Promise<boolean>;
}

export const useRequestTaskStore = create<RequestState>()(
  devtools(
    persist<RequestState>(
      (set, get) => ({
        reqTaskList: { type: "loading" },
        getRequestTask: async (searchParams) => {
          const check = paramsCheck(searchParams);
          try {
            const res: Response<ListData<RequestListItem>> = await api
              .get(`siteRequest/w/sign/getsiterequestlist`, {
                searchParams: check,
              })
              .json();
            set({ reqTaskList: { type: "data", payload: res.data } });
          } catch (err) {
            console.error(err);
            toast.error("조회 실패");
          }
        },
        addServiceType: undefined,
        getServiceType: async () => {
          try {
            const res: Response<UserServiceType[]> = await api
              .get(`siterequest/w/sign/getaddclassification`)
              .json();
            set({ addServiceType: res.data });
          } catch (err) {
            console.error(err);
            toast.error("조회 실패");
          }
        },
        postAddReqTask: async (formData) => {
          try {
            const res: Response<boolean> = await api
              .post(`siterequest/w/sign/addrequest`, {
                body: formData,
              })
              .json();
            toast.success("등록");
            return true;
          } catch (err) {
            console.error(err);
            toast.error("등록 실패");
            return false;
          }
        },
      }),
      { name: "req-store" }
    )
  )
);
