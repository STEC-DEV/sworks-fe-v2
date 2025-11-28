import api from "@/lib/api/api-manager";
import { useAuthStore } from "@/store/auth/auth-store";
import { useUIStore } from "@/store/common/ui-store";
import { Response } from "@/types/common/response";
import { Architecture } from "@/types/normal/building/architecture";
import { Construction } from "@/types/normal/building/building";
import { objectToFormData } from "@/utils/convert";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const BUILDING_LOADING_KEYS = {
  INFO: "building_info",
} as const;

interface BuildingState {
  loadingKeys: typeof BUILDING_LOADING_KEYS;
  construction: Construction | undefined;
  getConstruction: () => Promise<void>;
  //건축뭃
  architecture: Architecture | undefined;
  getArchitecture: () => Promise<void>;
  postAddArchitecture: (data: Record<string, any>) => Promise<boolean>;

  //건물
  createBuilding: CreateBuilding;
  setCreateBuilding: (values: Record<string, any>) => void;
  postAddBuilding: () => Promise<Response<boolean>>;
  resetCreateBuilding: () => void;
}

const initialCreateBuilding: CreateBuilding = {
  buildingSeq: undefined,
  dongName: "",
  completeDt: new Date(),
  address: "",
  totalArea: "",
  usage: "",
  selfParkingSpaces: 0,
  autoParkingSpaces: 0,
  handicapParkingSpaces: 0,
  basementFloors: 0,
  towerTypeYn: false,
  groundFloors: 0,
  elvPassenger: 0,
  elvCargo: 0,
  elvEmr: 0,
  subsCapacity: 0,
  genCapacity: 0,
  upsYn: false,
  overheadTank: 0,
  overheadTankFireWater: 0,
  underTank: 0,
  underTankFireWater: 0,
  firePanelType: undefined,
  sprinklerYn: false,
  gasExtYn: false,
  images: null,
  hvacDetails: [],
  pumpDetails: [],
};

export const useBuildingStore = create<BuildingState>()(
  devtools(
    persist<BuildingState>(
      (set, get) => ({
        loadingKeys: BUILDING_LOADING_KEYS,
        construction: undefined,
        getConstruction: async () => {
          const { enteredWorkplace } = useAuthStore.getState();
          if (!enteredWorkplace) return;
          const { setLoading, setError } = useUIStore.getState();
          setLoading(BUILDING_LOADING_KEYS.INFO, true);
          try {
            const res: Response<Construction> = await api
              .get(`building/w/sign/sitebuildinglist`, {
                searchParams: { siteSeq: enteredWorkplace.siteSeq },
              })
              .json();

            set({ construction: res.data });
          } catch (err) {
            console.error(err);
            const errorMessage =
              err instanceof Error
                ? err.message
                : "건물조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            setError(BUILDING_LOADING_KEYS.INFO, errorMessage);
            toast.error(errorMessage);
          } finally {
            setLoading(BUILDING_LOADING_KEYS.INFO, false);
          }
        },
        //건축물
        architecture: undefined,
        getArchitecture: async () => {
          try {
          } catch (err) {
            console.error(err);
            toast.error("건축물 정보 조회 실패");
          }
        },
        postAddArchitecture: async (data) => {
          try {
            const res: Response<Architecture> = await api
              .post(`building/w/sign/addbuilding`, {
                json: data,
              })
              .json();
            set({ architecture: res.data });
            return true;
          } catch (err) {
            console.error(err);
            toast.error("문제가 발생하였습니다. 잠시후 다시 시도해주세요.");
            return false;
          }
        },
        /**건물 생성 */
        createBuilding: initialCreateBuilding,
        setCreateBuilding: (values) => {
          set((prev) => ({
            createBuilding: { ...prev.createBuilding, ...values },
          }));
        },
        postAddBuilding: async () => {
          try {
            const { createBuilding } = get();

            const { hvacDetails, pumpDetails, ...rest } = createBuilding;
            const finalValue = {
              ...rest,
              details: [...hvacDetails, ...pumpDetails],
            };

            const formData = objectToFormData(finalValue, true);
            console.log(formData);
            const res: Response<boolean> = await api
              .post(`building/w/sign/addbuildingdong`, {
                body: formData,
              })
              .json();
            return res;
          } catch (err) {
            const res: Response<boolean> = {
              data: false,
              code: 500,
              message: "에러 발생",
            };
            return res;
          }
        },

        resetCreateBuilding: () => {
          set({ createBuilding: initialCreateBuilding });
        },
      }),

      { name: "building-store" }
    )
  )
);
