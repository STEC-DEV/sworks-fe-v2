"use client";

import BaseSkeleton from "@/components/common/base-skeleton";
import IconButton from "@/components/common/icon-button";
import AppTitle from "@/components/common/label/title";
import Tab from "@/components/common/tab";
import { KeyValueItem } from "@/components/ui/custom/key-value";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { usePermission } from "@/hooks/usePermission";
import { useUIStore } from "@/store/common/ui-store";
import { useBuildingStore } from "@/store/normal/building/building";
import { BuildingInfo, Construction } from "@/types/normal/building/building";
import { format } from "date-fns";
import { Building2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Building = () => {
  const router = useRouter();
  const { canWorkerEdit } = usePermission();
  const { construction, getConstruction, loadingKeys } = useBuildingStore();
  const { isLoading, hasError } = useUIStore();

  useEffect(() => {
    getConstruction();
  }, []);

  const getTab = () => {
    if (isLoading(loadingKeys.INFO)) {
      return (
        <>
          <BaseSkeleton className="h-9" />
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <BaseSkeleton className="w-60 h-40" />
                <BaseSkeleton className="h-6" />
              </div>
            ))}
          </div>
        </>
      );
    }
    if (hasError(loadingKeys.INFO)) {
      return <div>에러 발생</div>;
    }
    return (
      <Tab
        configs={[
          {
            tabTitle: "건물",
            options: construction && canWorkerEdit && (
              <IconButton
                icon="Plus"
                onClick={() => router.push("/workplace/building/add")}
              />
            ),
            render: (
              <ScrollArea className="w-full whitespace-nowrap ">
                {!construction ? (
                  <span className="text-[var(--description-light)]">
                    정보를 먼저 생성해주세요.
                  </span>
                ) : construction.dongs && construction.dongs?.length > 0 ? (
                  <div className="flex gap-6 w-max">
                    {construction.dongs?.map((b, i) => {
                      return <BuildingBox key={i} data={b} />;
                    })}
                  </div>
                ) : (
                  <span className="text-[var(--description-light)]">
                    + 버튼을 눌러 건물을 생성해주세요.
                  </span>
                )}

                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ),
          },
          {
            tabTitle: "정보",
            options:
              canWorkerEdit &&
              (construction === null ? (
                <IconButton
                  icon="Plus"
                  onClick={() => router.push("/workplace/construction/add")}
                />
              ) : (
                <IconButton
                  icon="SquarePen"
                  onClick={() => router.push("/workplace/construction/edit")}
                />
              )),
            render: construction ? (
              <ConstructionBox data={construction} />
            ) : (
              <span className="text-[var(--description-light)]">
                {" "}
                + 버튼을 눌러 건축물정보를 생성해주세요.
              </span>
            ),
          },
        ]}
      />
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <AppTitle title="건물" icon={Building2} />
      {getTab()}
    </div>
  );
};

const ConstructionBox = ({ data }: { data: Construction }) => {
  return (
    <div className="base-flex-col gap-4 w-full ">
      <KeyValueItem
        mainStyle="flex-row justify-between"
        valueStyle="text-sm"
        labelStyle="text-sm"
        label={"명칭"}
        value={data.buildingName}
      />
      <KeyValueItem
        mainStyle="flex-row justify-between"
        valueStyle="text-sm"
        labelStyle="text-sm"
        label={"준공일"}
        value={format(data.completeDt, "yyyy-MM-dd")}
      />
      <KeyValueItem
        mainStyle="flex-row justify-between"
        valueStyle="text-sm"
        labelStyle="text-sm"
        label={"주소"}
        value={data.address}
      />
      <KeyValueItem
        mainStyle="flex-row justify-between"
        valueStyle="text-sm"
        labelStyle="text-sm"
        label={"연면적"}
        value={data.totalArea}
      />
      <KeyValueItem
        mainStyle="flex-row justify-between"
        valueStyle="text-sm"
        labelStyle="text-sm"
        label={"건물용도"}
        value={data.usage}
      />
      <KeyValueItem
        mainStyle="flex-row justify-between"
        valueStyle="text-sm"
        labelStyle="text-sm font-medium"
        label={"자주식 주차장"}
        value={data.selfParkingSpaces.toString()}
      />
      <KeyValueItem
        mainStyle="flex-row justify-between"
        valueStyle="text-sm"
        labelStyle="text-sm"
        label={"기계식 주차장"}
        value={data.autoParkingSpaces.toString()}
      />
      <KeyValueItem
        mainStyle="flex-row justify-between"
        valueStyle="text-sm"
        labelStyle="text-sm"
        label={"장애인 주차장"}
        value={data.handicapParkingSpaces.toString()}
      />
    </div>
  );
};

const BuildingBox = ({ data }: { data: BuildingInfo }) => {
  return (
    <Link href={`/workplace/building/${data.dongSeq}`}>
      <div className="base-flex-col gap-2 cursor-pointer ">
        <div className=" flex-center rounded-[4px] w-60 h-40 bg-[var(--background)]   overflow-hidden group relative ">
          {data.images !== null ? (
            <Image
              className="object-cover "
              fill
              src={data.images}
              alt="이미지"
            />
          ) : (
            <div>
              <Building2
                size={24}
                className="text-[var(--icon)] "
                strokeWidth={1.5}
              />
            </div>
          )}
          <div className="absolute top-0 p-2 items-end  left-0 w-full h-full hidden bg-opacity-50 bg-gradient-to-b from-[rgba(229,229,229,0.5)] to-[rgba(75,85,99,0.5)] group-hover:flex">
            <span className="text-xs text-white truncate">{data.address}</span>
          </div>
        </div>
        <div>
          <span className="text-sm">{data.dongName}</span>
        </div>
      </div>
    </Link>
  );
};

export default Building;
