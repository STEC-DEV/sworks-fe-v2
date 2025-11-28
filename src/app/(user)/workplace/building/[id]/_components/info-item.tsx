"use client";

import { AccordionContents } from "@/components/common/accordion/custom-accordion";
import CustomCard from "@/components/common/card";
import IconButton from "@/components/common/icon-button";
import { KeyValueItem } from "@/components/ui/custom/key-value";
import { useBuildingDetailStore } from "@/store/normal/building/detail";
import { format } from "date-fns";
import {
  Building2Icon,
  CogIcon,
  FireExtinguisherIcon,
  FlameIcon,
  icons,
  LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const BuildingInfo = () => {
  const router = useRouter();
  const { building } = useBuildingDetailStore();
  useEffect(() => {
    console.log(building);
  }, [building]);

  return (
    <InfoBox
      title="건물정보"
      icon={Building2Icon}
      options={
        <IconButton
          icon="SquarePen"
          onClick={() => router.push(`${building?.dongSeq}/edit/building`)}
        />
      }
    >
      <div className="mt-2 space-y-6 xl:grid xl:grid-cols-2 xl:gap-x-12 xl:gap-y-6 xl:space-y-0">
        <AccordionContents>
          <KeyValueItem
            label="위치"
            value={building?.address ?? ""}
            isHorizontal
          />
          <KeyValueItem
            label="준공일"
            value={
              building?.completeDt
                ? format(building?.completeDt, "yyyy-MM-dd")
                : ""
            }
            isHorizontal
          />
          <KeyValueItem
            label="연면적"
            value={building?.totalArea ?? ""}
            isHorizontal
          />
          <KeyValueItem
            label="건물용도"
            value={building?.usage ?? ""}
            isHorizontal
          />
        </AccordionContents>
        <AccordionContents title="주차장">
          <KeyValueItem
            label="자주식"
            value={building?.selfParkingSpaces.toString() ?? ""}
            isHorizontal
          />
          <KeyValueItem
            label="기계식"
            value={building?.autoParkingSpaces.toString() ?? ""}
            isHorizontal
          />
          <KeyValueItem
            label="장애인"
            value={building?.handicapParkingSpaces.toString() ?? ""}
            isHorizontal
          />
        </AccordionContents>
        <AccordionContents title="층">
          <KeyValueItem
            label="지상"
            value={building?.groundFloors?.toString() ?? ""}
            isHorizontal
          />
          <KeyValueItem
            label="지하"
            value={building?.basementFloors?.toString() ?? ""}
            isHorizontal
          />
        </AccordionContents>
      </div>
    </InfoBox>
  );
};

export const FacilityInfo = () => {
  const router = useRouter();
  const { building } = useBuildingDetailStore();
  return (
    <InfoBox
      title="설비정보"
      icon={CogIcon}
      options={
        <IconButton
          icon="SquarePen"
          onClick={() => router.push(`${building?.dongSeq}/edit/facility`)}
        />
      }
    >
      <div className="mt-2 space-y-6 xl:grid xl:grid-cols-2 xl:gap-x-12 xl:gap-y-6 xl:space-y-0">
        {/* <AccordionContents>
          <KeyValueItem
            label="승객용"
            value={`${building?.elvPassenger?.toString() ?? ""} 대`}
            isHorizontal
          />
          <KeyValueItem
            label="화물용"
            value={`${building?.elvCargo?.toString() ?? ""} 대`}
            isHorizontal
          />
          <KeyValueItem
            label="비상용"
            value={`${building?.elvEmr?.toString() ?? ""} 대`}
            isHorizontal
          />
        </AccordionContents> */}
        <AccordionContents title="승강기">
          <KeyValueItem
            label="승객용"
            value={`${building?.elvPassenger?.toString() ?? ""} 대`}
            isHorizontal
          />
          <KeyValueItem
            label="화물용"
            value={`${building?.elvCargo?.toString() ?? ""} 대`}
            isHorizontal
          />
          <KeyValueItem
            label="비상용"
            value={`${building?.elvEmr?.toString() ?? ""} 대`}
            isHorizontal
          />
        </AccordionContents>
        <AccordionContents title="전기">
          <KeyValueItem
            label="수변전실 수전용량"
            value={`${building?.subsCapacity?.toString() ?? ""} kw`}
            isHorizontal
          />
          <KeyValueItem
            label="발전기 수전용량"
            value={`${building?.genCapacity?.toString() ?? ""} kw`}
            isHorizontal
          />
          <KeyValueItem
            label="UPS"
            value={`${building?.upsYn ? "유" : "무"} `}
            isHorizontal
          />
        </AccordionContents>
      </div>
      <AccordionContents title="냉·난방">
        <div className="space-y-6 xl:grid xl:grid-cols-2 xl:gap-x-12 xl:gap-y-6 xl:space-y-0">
          {building?.hvacDetails.map((d, i) => (
            <div key={i} className="flex flex-col gap-2">
              <KeyValueItem label="구분" value={d.typeName} isHorizontal />
              <KeyValueItem
                label="용량"
                value={`${d.capacity?.toString() ?? ""} RT`}
                isHorizontal
              />
              <KeyValueItem
                label="수량"
                value={`${d.qty.toString() ?? ""} 대`}
                isHorizontal
              />
              <KeyValueItem label="비고" value={d.comments} isHorizontal />
            </div>
          ))}
        </div>
      </AccordionContents>
    </InfoBox>
  );
};

export const FireInfo = () => {
  const router = useRouter();
  const { building } = useBuildingDetailStore();
  const firePanelTypeName = () => {
    switch (building?.firePanelType) {
      case 1:
        return "R형";
      case 2:
        return "p형";
      default:
        return "";
    }
  };
  return (
    <InfoBox
      title="소방정보"
      icon={FlameIcon}
      options={
        <IconButton
          icon="SquarePen"
          onClick={() => router.push(`${building?.dongSeq}/edit/fire`)}
        />
      }
    >
      <div className="mt-2 space-y-6 xl:grid xl:grid-cols-2 xl:gap-x-12 xl:gap-y-6 xl:space-y-0">
        <AccordionContents title="">
          <KeyValueItem
            label="수신기"
            value={`${firePanelTypeName()}`}
            isHorizontal
          />
          <KeyValueItem
            label="스프링클러"
            value={`${building?.sprinklerYn ? "유" : "무"} `}
            isHorizontal
          />
          <KeyValueItem
            label="가스계소화설비"
            value={`${building?.gasExtYn ? "유" : "무"} `}
            isHorizontal
          />
        </AccordionContents>
        <AccordionContents title="소화용수">
          <KeyValueItem
            label="고가수조"
            value={`${building?.overheadTank ?? ""} ton`}
            isHorizontal
          />
          <KeyValueItem
            label="중 소화용수"
            value={`${building?.overheadTankFireWater ?? ""} ton`}
            isHorizontal
          />
          <KeyValueItem
            label="저수조"
            value={`${building?.underTank ?? ""} ton`}
            isHorizontal
          />
          <KeyValueItem
            label="중 소화용수"
            value={`${building?.underTankFireWater ?? ""} ton`}
            isHorizontal
          />
        </AccordionContents>
      </div>
      <AccordionContents title="펌프">
        <div className="space-y-6 xl:grid xl:grid-cols-2 xl:gap-x-12 xl:gap-y-6 xl:space-y-0">
          {building?.pumpDetails.map((d, i) => (
            <div key={i} className="flex flex-col gap-2">
              <KeyValueItem label="구분" value={d.typeName} isHorizontal />
              <KeyValueItem
                label="토출량"
                value={`${d.flowRate?.toString() ?? ""} m³/hr`}
                isHorizontal
              />
              <KeyValueItem
                label="전양정"
                value={`${d.totalHead?.toString() ?? ""} m`}
                isHorizontal
              />
              <KeyValueItem
                label="수량"
                value={`${d.qty.toString() ?? ""} 대`}
                isHorizontal
              />
              <KeyValueItem label="비고" value={d.comments} isHorizontal />
            </div>
          ))}
        </div>
      </AccordionContents>
    </InfoBox>
  );
};

interface InfoBoxProps {
  title: string;
  icon?: LucideIcon;
  options?: React.ReactNode;
  children: React.ReactNode;
}

const InfoBox = ({ title, icon: Icon, options, children }: InfoBoxProps) => {
  return (
    <CustomCard>
      <div className="flex justify-between items-center px-6">
        <div className="flex gap-2 items-center">
          {Icon ? (
            <Icon className="text-blue-500" size={20} strokeWidth={1.5} />
          ) : null}
          <span className="text-sm">{title}</span>
        </div>
        {options}
      </div>

      {children}
    </CustomCard>
  );
};
