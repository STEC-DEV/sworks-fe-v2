import api from "@/lib/api/api-manager";
import { Response } from "@/types/common/response";
import {
  BuildingInfo,
  EditBuildingInfo,
  UiBuildingInfo,
} from "@/types/normal/building/building";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { objectToFormData } from "@/utils/convert";
import { useUIStore } from "@/store/common/ui-store";

export const BUILDING_DETAIL_LOADING_KEYS = {
  DETAIL: "building_detail",
} as const;

interface BuildingState {
  loadingKeys: typeof BUILDING_DETAIL_LOADING_KEYS;
  building: UiBuildingInfo | null;
  getBuildingDetail: (buildingSeq: string) => Promise<void>;
  patchEditBuildingDetail: (values: Record<string, any>) => Promise<void>;
}

export const useBuildingDetailStore = create<BuildingState>()(
  devtools(
    persist<BuildingState>(
      (set, get) => ({
        loadingKeys: BUILDING_DETAIL_LOADING_KEYS,
        building: null,
        getBuildingDetail: async (buildingSeq) => {
          const { setError, setLoading } = useUIStore.getState();
          setLoading(BUILDING_DETAIL_LOADING_KEYS.DETAIL, true);
          try {
            const res: Response<BuildingInfo> = await api
              .get(`building/w/sign/detaildonginfo`, {
                searchParams: { dongSeq: buildingSeq },
              })
              .json();

            const { details, ...rest } = res.data;

            const convertData: UiBuildingInfo = {
              ...rest,
              hvacDetails: details.filter((d, i) => d.typeGubun === true),
              pumpDetails: details.filter((d, i) => d.typeGubun === false),
            };

            set({ building: convertData });
          } catch (err) {
            console.error(err);
            const errMessage =
              err instanceof Error
                ? err.message
                : "건물상세 조회 문제가 발생하였습니다. 잠시후 다시 시도해주세요.";
            setError(BUILDING_DETAIL_LOADING_KEYS.DETAIL, errMessage);
            toast.error(errMessage);
          } finally {
            setLoading(BUILDING_DETAIL_LOADING_KEYS.DETAIL, false);
          }
        },
        patchEditBuildingDetail: async (values) => {
          const { building } = get();
          if (!building) return;

          const { hvacDetails, pumpDetails, ...rest } = building;
          const {
            hvacDetails: valuesHvacDetails,
            pumpDetails: valuesPumpDetails,
            ...restValues
          } = values;

          //기본 건물정보 수정하는경우 이미지가 존재함
          const removeImage =
            "removeImage" in values ? values.removeImage : false;

          // 설비정보 수정시 hvacDetail존재
          const facilityDetails = valuesHvacDetails || hvacDetails;
          const fireDetails = valuesPumpDetails || pumpDetails;

          const updateBuilding: EditBuildingInfo = {
            ...rest,
            ...restValues, // hvacDetails, pumpDetails가 제거된 values
            details: [...facilityDetails, ...fireDetails],
            removeImage,
          };
          // const formData = convertRecordDataToFormData(updateBuilding, true);
          const formData = objectToFormData(updateBuilding, true);

          console.log(formData);

          try {
            const res: Response<boolean> = await api
              .patch(`building/w/sign/updatebuildingdong`, {
                body: formData,
              })
              .json();

            toast.success("수정 완료");
          } catch (err) {
            console.error(err);
            toast.error("에러 발생");
          }
        },
      }),
      { name: "building-detail-store" }
    )
  )
);
