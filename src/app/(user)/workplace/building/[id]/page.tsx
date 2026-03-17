"use client";
import CustomAccordion from "@/components/common/accordion/custom-accordion";
import BaseSkeleton from "@/components/common/base-skeleton";
import AppTitle from "@/components/common/label/title";
import { useDecodeParam } from "@/hooks/params";
import { useBuildingDetailStore } from "@/store/normal/building/detail";
import { Building2, Building2Icon } from "lucide-react";
import React, { useEffect } from "react";
import { BuildingInfo, FacilityInfo, FireInfo } from "./_components/info-item";
import Image from "next/image";
import { useUIStore } from "@/store/common/ui-store";
import { SingleImageBox } from "@/components/common/image-box";
import IconButton from "@/components/common/icon-button";
import CheckDialog from "@/components/common/check-dialog";
import { dialogText } from "../../../../../../public/text";
import { useRouter } from "next/navigation";
import PrevLayout from "@/components/layout/prev-layout";
import CustomCard from "@/components/common/card";
import { format } from "date-fns";
import BaseTable from "@/components/common/base-table";
import { hvacColumns } from "./_components/hvac-columns";
import { pumpColumns } from "./_components/pump-columns";

const Page = () => {
  const { rawValue } = useDecodeParam("id");
  const { building, getBuildingDetail, deleteBuilding, loadingKeys } =
    useBuildingDetailStore();
  const router = useRouter();
  const { isLoading, hasError } = useUIStore();

  useEffect(() => {
    if (!rawValue) return;
    getBuildingDetail(rawValue);
  }, [rawValue]);

  if (isLoading(loadingKeys.DETAIL) || !building)
    return <BuildingDetailSkeleton />;
  if (hasError(loadingKeys.DETAIL)) return <div>에러 발생</div>;

  const handleDelete = async () => {
    await deleteBuilding(building?.dongSeq.toString());
    router.replace("/workplace");
  };

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <AppTitle title={building?.dongName} isPrev prevPath="/workplace" />
        <CheckDialog
          title={dialogText.defaultDelete.title}
          description={dialogText.defaultDelete.description}
          actionLabel={dialogText.defaultDelete.actionLabel}
          onClick={handleDelete}
        >
          <IconButton
            icon="Trash2"
            bgClassName="!rounded-DEFAULT border border-border-strong shadow-sm hover:border-destructive hover:bg-red-50"
            className="group-hover:text-destructive"
          />
        </CheckDialog>
      </div>

      {/* <div className="w-full h-80 border rounded-[4px] shrink-0 relative">
          {building.images ? (
            <SingleImageBox path={building.images} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-background">
              <Building2
                size={24}
                className="text-[var(--icon)] "
                strokeWidth={1.5}
              />
            </div>
          )}
        </div> */}
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* 기본정보 영역 */}
          <CustomCard className="py-0 gap-0 border-border-strong relative">
            {building.images ? (
              <SingleImageBox path={building.images} />
            ) : (
              <div className="w-full h-50  bg-gray-100 flex flex-col gap-2 items-center justify-center">
                <Building2Icon className="text-description-light" />
                <span className="text-description-light text-sm">
                  이미지 없음
                </span>
              </div>
            )}
            <div className="flex flex-col gap-2 p-4 justify-between flex-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-description-light">준공일</span>
                <span className="text-xs">
                  {format(building.completeDt, "yyyy-MM-dd")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-description-light">건물용도</span>
                <span className="text-xs px-2 py-1 bg-primary-background text-primary border border-border-strong rounded-DEFAULT">
                  {building.usage}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-description-light">연면적</span>
                <span className="text-xs">{building.totalArea}</span>
              </div>
            </div>
            {/* 수정 */}
            <div className="!absolute right-3 top-3">
              <IconButton
                icon="SquarePen"
                bgClassName="border border-border-strong "
                onClick={() => router.push(`${rawValue}/edit/BUILDING`)}
              />
            </div>
          </CustomCard>
          <div className="flex flex-col gap-6 col-span-2">
            <BuildingCard title="주차장">
              <div className="flex-1 divide-x divide-border  flex flex-col xl:flex-row ">
                <BuildingItem
                  title="자주식"
                  value={`${building.selfParkingSpaces}`}
                  unit="대"
                />
                <BuildingItem
                  title="기계식"
                  value={`${building.autoParkingSpaces}`}
                  unit="대"
                />
                <BuildingItem
                  title="장애인"
                  value={`${building.handicapParkingSpaces}`}
                  unit="대"
                />
              </div>
            </BuildingCard>
            <BuildingCard title="층">
              <div className="flex-1 divide-x divide-border flex flex-col xl:flex-row ">
                <BuildingItem
                  title="지상"
                  value={`${building.groundFloors}`}
                  unit="대"
                />
                <BuildingItem
                  title="지하"
                  value={`${building.basementFloors}`}
                  unit="대"
                />
              </div>
            </BuildingCard>
          </div>

          {/* <BuildingInfo /> */}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <BuildingCard
            title="설비"
            optionButton={
              <IconButton
                icon="SquarePen"
                bgClassName="!rounded-DEFAULT border border-border-strong shadow-sm hover:bg-primary-background"
                onClick={() => router.push(`${rawValue}/edit/FACILITY`)}
              />
            }
          >
            <div className="p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-sm text-description">승강기</span>
                <div className="flex gap-6 border divide-x rounded-DEFAULT shadow-sm">
                  <BuildingItem
                    title="승객용"
                    value={`${building.elvPassenger}`}
                    unit="대"
                  />
                  <BuildingItem
                    title="화물용"
                    value={`${building.elvCargo}`}
                    unit="대"
                  />
                  <BuildingItem
                    title="비상용"
                    value={`${building.elvEmr} `}
                    unit="대"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm text-description">전기</span>
                <div className="flex gap-6 border divide-x rounded-DEFAULT shadow-sm">
                  <BuildingItem
                    title="수변전실 수전용량"
                    value={`${building.subsCapacity}`}
                    unit="kw"
                  />
                  <BuildingItem
                    title="발전기실 수전용량"
                    value={`${building.genCapacity} `}
                    unit=" kw"
                  />
                  <BuildingItem
                    title="UPS"
                    value={`${building.upsYn ? "유" : "무"}`}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-sm text-description">냉·난방</span>
                <BaseTable data={building.hvacDetails} columns={hvacColumns} />
                {/* {building.hvacDetails.map((v, i) => (
                    <div
                      className="flex gap-6 border divide-x rounded-DEFAULT shadow-sm"
                      key={i}
                    >
                      <BuildingItem title="구분" value={`${v.typeName}`} />
                      <BuildingItem title="용량" value={`${v.capacity} RT`} />
                      <BuildingItem title="수량" value={`${v.qty} 대`} />
                      <BuildingItem
                        title="비고"
                        value={`${v.comments ?? "내용없음"}`}
                      />
                    </div>
                  ))} */}
              </div>
            </div>
          </BuildingCard>
          <BuildingCard
            title="소방정보"
            optionButton={
              <IconButton
                icon="SquarePen"
                bgClassName="!rounded-DEFAULT border border-border-strong shadow-sm hover:bg-primary-background"
                onClick={() => router.push(`${rawValue}/edit/FIRE`)}
              />
            }
          >
            <div className="p-6 flex flex-col gap-6">
              <div className="flex gap-6 border divide-x rounded-DEFAULT shadow-sm">
                <BuildingItem
                  title="수신기"
                  value={`${building?.firePanelType === 1 ? "R형" : "P형"}`}
                />
                <BuildingItem
                  title="스프링클러"
                  value={`${building.sprinklerYn ? "유" : "무"}`}
                />
                <BuildingItem
                  title="가스기계소화설비"
                  value={`${building.gasExtYn ? "유" : "무"}`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm text-description">소화용수</span>
                <div className="flex gap-6 border divide-x rounded-DEFAULT shadow-sm">
                  <BuildingItem
                    title="고가수조"
                    value={`${building.overheadTank}`}
                    unit="ton"
                  />
                  <BuildingItem
                    title="중소화용수"
                    value={`${building.overheadTankFireWater}`}
                    unit="ton"
                  />
                  <BuildingItem
                    title="저수조"
                    value={`${building.underTank}`}
                    unit="ton"
                  />
                  <BuildingItem
                    title="중 소화용수"
                    value={`${building.underTankFireWater}`}
                    unit="ton"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-sm text-description">펌프</span>
                <BaseTable data={building.pumpDetails} columns={pumpColumns} />
                {/* {building.pumpDetails.map((v, i) => (
                    <div className="flex gap-6" key={i}>
                      <BuildingItem title="구분" value={`${v.typeName}`} />
                      <BuildingItem
                        title="토출량"
                        value={`${v.flowRate} m³/hr`}
                      />
                      <BuildingItem title="전양정" value={`${v.totalHead} m`} />
                      <BuildingItem title="수량" value={`${v.qty} 대`} />
                      <BuildingItem title="비고" value={`${v.comments}`} />
                    </div>
                  ))} */}
              </div>
            </div>
          </BuildingCard>
          {/* <FacilityInfo />
            <FireInfo /> */}
        </div>
      </div>
    </>
  );
};

export default Page;

const BuildingDetailSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 overflow-hidden">
      <BaseSkeleton className="h-7" />
      <BaseSkeleton className="h-60" />
      <BaseSkeleton className="h-75" />
      <BaseSkeleton className="h-75" />
      <BaseSkeleton className="h-75" />
    </div>
  );
};

const BuildingItem = ({
  title,
  value,
  unit,
}: {
  title: string;
  value: string;
  unit?: string;
}) => {
  return (
    <div className={`flex-1 flex flex-col items-start gap-1 p-4 `}>
      <span className="text-sm text-description font-semibold">{title}</span>
      <div>
        <span className="text-xl text-primary font-bold">{value}</span>
        <span className="text-sm text-description-light font-medium">
          &nbsp; {unit}
        </span>
      </div>
    </div>
  );
};

const BuildingCard = ({
  title,
  children,
  optionButton,
}: {
  title: string;
  children: React.ReactNode;
  optionButton?: React.ReactNode;
}) => {
  return (
    <CustomCard className="py-0 gap-0 border-border-strong h-fit  ">
      <div className="w-full flex items-center justify-between bg-background py-4 px-4 border-b">
        <span className="text-sm text-primary font-semibold">{title}</span>
        {optionButton && optionButton}
      </div>
      {children}
    </CustomCard>
  );
};
