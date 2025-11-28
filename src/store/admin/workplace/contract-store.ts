import api from "@/lib/api/api-manager";
import { useUIStore } from "@/store/common/ui-store";
import { Contract } from "@/types/admin/workplace/contract-info";
import { ContractType } from "@/types/common/basic-code";
import { Response } from "@/types/common/response";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const ADMIN_WORKPLACE_DETAIL_CONTRACT_LOADING_KEYS = {
  CONTRACT: "admin_workplace_contract",
} as const;

interface WorkplaceDetailContractState {
  ////계약정보
  //조회
  loadingKeys: typeof ADMIN_WORKPLACE_DETAIL_CONTRACT_LOADING_KEYS;
  contractList: Contract[] | null;
  getContractList: (workplaceId: string) => Promise<void>;
  workplaceContractTypeList: ContractType[] | undefined;
  getWorkplaceServiceType: (workplaceId: string) => Promise<void>;
  //등록
  postAddContract: (value: Record<string, any>) => Promise<Response<number>>;
  //수정
  patchContract: (updateContract: Record<string, any>) => Promise<void>;
}

export const useWorkplaceDetailContractStore =
  create<WorkplaceDetailContractState>()(
    devtools(
      persist<WorkplaceDetailContractState>(
        (set, get) => ({
          loadingKeys: ADMIN_WORKPLACE_DETAIL_CONTRACT_LOADING_KEYS,
          contractList: null,
          getContractList: async (workplaceId) => {
            const { setLoading, setError } = useUIStore.getState();
            setLoading(
              ADMIN_WORKPLACE_DETAIL_CONTRACT_LOADING_KEYS.CONTRACT,
              true
            );
            try {
              const res: Response<Contract[]> = await api
                .get(`site/w/sign/getcontractdetail`, {
                  searchParams: { siteSeq: workplaceId },
                })
                .json();
              const data = res.data;
              set({ contractList: data });
            } catch (err) {
              console.error(err);
              const errMessage =
                err instanceof Error
                  ? err.message
                  : "계약정보 조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
              setError(
                ADMIN_WORKPLACE_DETAIL_CONTRACT_LOADING_KEYS.CONTRACT,
                errMessage
              );
              toast.error(errMessage);
            } finally {
              setLoading(
                ADMIN_WORKPLACE_DETAIL_CONTRACT_LOADING_KEYS.CONTRACT,
                false
              );
            }
          },
          postAddContract: async (value): Promise<Response<number>> => {
            console.log(value);
            try {
              const res: Response<number> = await api
                .post(`site/w/sign/addcontract`, {
                  json: { ...value },
                })
                .json();
              return res;
            } catch (err) {
              console.log(err);

              return {
                code: 500,
                data: 0,
                message: "등록 실패",
              };
            }
          },
          patchContract: async (updateContract) => {
            console.log(updateContract);
            try {
              const res: Response<number> = await api
                .patch(`site/w/sign/updatecontract`, {
                  json: { ...updateContract },
                })
                .json();
              toast.success("저장");
            } catch (err) {
              console.log(err);
              toast.error("저장 실패. 다시 시도해주세요.");
            }
          },
          workplaceContractTypeList: undefined,
          getWorkplaceServiceType: async (workplaceId) => {
            try {
              const res: Response<ContractType[]> = await api
                .get(`site/w/sign/classificationlist`, {
                  searchParams: { siteSeq: workplaceId },
                })
                .json();
              console.log(res.data);
              const data = res.data;

              set({ workplaceContractTypeList: data });
            } catch (err) {
              console.log(err);
            }
          },
        }),
        {
          name: "workplace-detail-contract-store",
        }
      )
    )
  );
