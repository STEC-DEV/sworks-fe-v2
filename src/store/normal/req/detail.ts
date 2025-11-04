import api from "@/lib/api/api-manager";
import { Response } from "@/types/common/response";
import { Request, RequestWorker } from "@/types/normal/request/req-detail";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ReqDetailState {
  request: Request | undefined;
  getRequestDetail: (id: string) => Promise<void>;
  patchUpdateRequestDetail: (formData: FormData) => Promise<boolean>;
  //업무요청 처리 담당자 조회
  reqWorker: RequestWorker[] | undefined;
  getClassificationReqManager: (search?: string | null) => Promise<void>;
  //처리내용 등록
  postAddReply: (data: FormData) => Promise<boolean>;
  //처리내용 삭제
  deleteReply: (seq: string) => Promise<void>;
}

export const useReqDetailStore = create<ReqDetailState>()(
  devtools(
    persist<ReqDetailState>(
      (set, get) => ({
        request: undefined,
        getRequestDetail: async (id) => {
          try {
            const res: Response<Request> = await api
              .get("siterequest/w/sign/getdetailrequestinfo", {
                searchParams: { requestSeq: id },
              })
              .json();
            set({ request: res.data });
          } catch (err) {
            console.error(err);
            toast.error("조회 실패");
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
      }),
      { name: "req-detail-store" }
    )
  )
);
