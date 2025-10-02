import api from "@/lib/api/api-manager";
import { useAuthStore } from "@/store/auth/auth-store";
import { Response } from "@/types/common/response";
import { Construction } from "@/types/normal/building/building";
import { convertRecordDataToFormData } from "@/utils/convert";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface BuildingState {
  construction: Construction | undefined;
  getConstruction: () => Promise<void>;
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
  images: [],
  hvacDetails: [],
  pumpDetails: [],
};

export const useBuildingStore = create<BuildingState>()(
  devtools(
    persist<BuildingState>(
      (set, get) => ({
        construction: undefined,
        getConstruction: async () => {
          const { enteredWorkplace } = useAuthStore.getState();
          if (!enteredWorkplace) return;
          try {
            const res: Response<Construction> = await api
              .get(`building/w/sign/sitebuildinglist`, {
                searchParams: { siteSeq: enteredWorkplace.siteSeq },
              })
              .json();

            set({ construction: res.data });
          } catch (err) {
            console.log(err);
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
              detail: [...hvacDetails, ...pumpDetails],
            };
            console.log(finalValue);
            const formData = convertRecordDataToFormData(finalValue, true);
            console.log(formData);
            const res: Response<boolean> = await api
              .post(`building/w/sign/addbuildingdong`, {
                body: formData,
              })
              .json();

            // const res: Response<boolean> = {
            //   data: false,
            //   code: 500,
            //   message: "에러 발생",
            // };

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
