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
import { useBuildingStore } from "./building";
import { convertRecordDataToFormData } from "@/utils/convert";

interface BuildingState {
  building: UiBuildingInfo | undefined;
  getBuildingDetail: (buildingSeq: string) => Promise<void>;
  patchEditBuildingDetail: (values: Record<string, any>) => Promise<void>;
}

export const useBuildingDetailStore = create<BuildingState>()(
  devtools(
    persist<BuildingState>(
      (set, get) => ({
        building: undefined,
        getBuildingDetail: async (buildingSeq) => {
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

            console.log(convertData);

            set({ building: convertData });
          } catch (err) {
            console.error(err);
            toast.error("에러 발생");
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
            detail: [...facilityDetails, ...fireDetails],
            removeImage,
          };
          const formData = convertRecordDataToFormData(updateBuilding, true);
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
