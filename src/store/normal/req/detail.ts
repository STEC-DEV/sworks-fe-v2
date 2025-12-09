import api from "@/lib/api/api-manager";
import { handleApiError } from "@/lib/api/errorHandler";
import { useUIStore } from "@/store/common/ui-store";
import { Response } from "@/types/common/response";
import { Request, RequestWorker } from "@/types/normal/request/req-detail";
import { HTTPError } from "ky";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const REQUEST_TASK_DETAIL_LOADING_KEYS = {
  INFO: "request_task_detail",
} as const;

interface ReqDetailState {
  loadingKeys: typeof REQUEST_TASK_DETAIL_LOADING_KEYS;
  request: Request | null;
  getRequestDetail: (id: string) => Promise<void>;
  patchUpdateRequestDetail: (formData: FormData) => Promise<boolean>;
  deleteRequest: (delSeq: number) => Promise<void>;

  //업무요청 처리 담당자 조회
  reqWorker: RequestWorker[] | undefined;
  getClassificationReqManager: (search?: string | null) => Promise<void>;
  //처리내용 등록
  postAddReply: (data: FormData) => Promise<boolean>;
  //처리내용 삭제
  deleteReply: (seq: string) => Promise<void>;
  //처리내용 수정
  postUpdateReply: (data: FormData) => Promise<void>;
}

export const useReqDetailStore = create<ReqDetailState>()(
  devtools(
    persist<ReqDetailState>(
      (set, get) => ({
        loadingKeys: REQUEST_TASK_DETAIL_LOADING_KEYS,
        request: null,
        getRequestDetail: async (id) => {
          const { setError, setLoading } = useUIStore.getState();
          setLoading(REQUEST_TASK_DETAIL_LOADING_KEYS.INFO, true);
          try {
            const res: Response<Request> = await api
              .get("siterequest/w/sign/getdetailrequestinfo", {
                searchParams: { requestSeq: id },
              })
              .json();
            set({ request: res.data });
          } catch (err) {
            console.error(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "업무요청 상세조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            setError(REQUEST_TASK_DETAIL_LOADING_KEYS.INFO, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(REQUEST_TASK_DETAIL_LOADING_KEYS.INFO, false);
          }
        },
        patchUpdateRequestDetail: async (data) => {
          try {
            const res: Response<boolean> = await api
              .post("siterequest/w/sign/updaterequest", {
                body: data,
              })
              .json();
            toast.success("저장");
            return res.data;
          } catch (err) {
            console.error(err);
            toast.error("저장 실패");
            return false;
          }
        },
        deleteRequest: async (delSeq) => {
          try {
            const res: Response<boolean> = await api
              .delete(`siterequest/w/sign/delrequest`, {
                searchParams: { delSeq },
              })
              .json();

            toast.success("수정되었습니다.");
          } catch (err) {
            console.error(err);
            const errMessage = await handleApiError(err);
            toast.error(errMessage);
          }
        },
        reqWorker: undefined,
        getClassificationReqManager: async (search) => {
          const { request } = get();
          const searchParams = new URLSearchParams();

          if (!request) return;
          searchParams.set("requestSeq", request?.requestSeq.toString());
          searchParams.set("searchKey", search ?? "");

          try {
            const res: Response<RequestWorker[]> = await api
              .get(`siterequest/w/sign/addlogclassification`, {
                searchParams: searchParams,
              })
              .json();

            set({ reqWorker: res.data });
          } catch (err) {
            console.error(err);
            toast.error("조회 실패");
          }
        },
        postAddReply: async (data) => {
          try {
            const res: Response<boolean> = await api
              .post(`siterequest/w/sign/addrequestlog`, {
                body: data,
              })
              .json();

            return res.data;
          } catch (err) {
            console.error(err);
            toast.error("등록 실패");
            return false;
          }
        },
        deleteReply: async (seq) => {
          try {
            const res: Response<boolean> = await api
              .delete(`siterequest/w/sign/delrequestlog`, {
                searchParams: { delSeq: seq },
              })
              .json();

            toast.success("삭제되었습니다.");
          } catch (err) {
            console.error(err);
            toast.error("문제가 발생하였습니다. 잠시후 다시 시도해주세요.");
          }
        },
        postUpdateReply: async (data) => {
          try {
            const res: Response<boolean> = await api
              .post(`siterequest/w/sign/updatelog`, {
                body: data,
              })
              .json();

            // return res.data;
          } catch (err) {
            console.error(err);
            const errorMessage = await handleApiError(err);
            toast.error(errorMessage);
          }
        },
      }),
      { name: "req-detail-store" }
    )
  )
);
