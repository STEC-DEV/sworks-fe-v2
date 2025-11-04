"use client";
import { KeyValueItem } from "@/app/(user)/equipment/[id]/[history-id]/page";
import BaseSkeleton from "@/components/common/base-skeleton";
import IconButton from "@/components/common/icon-button";
import AppTitle from "@/components/common/label/title";
import Tab, { TabConfig } from "@/components/common/tab";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useBuildingStore } from "@/store/normal/building/building";
import { BuildingInfo, Construction } from "@/types/normal/building/building";
import { format } from "date-fns";
import { Building2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Building = () => {
  const router = useRouter();
  const { construction, getConstruction } = useBuildingStore();

  useEffect(() => {
    getConstruction();
  }, []);

  return (
    <>
      <AppTitle title="건물" />

      <Tab
        configs={[
          {
            tabTitle: "건물",
            options: !construction ? null : (
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
                ) : (
                  <div className="flex gap-6 w-max">
                    {construction.dongs?.map((b, i) => {
                      return <BuildingBox key={i} data={b} />;
                    })}
                  </div>
                )}

                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ),
          },
          {
            tabTitle: "정보",
            options:
              construction === null ? (
                <IconButton
                  icon="Plus"
                  onClick={() => router.push("/workplace/construction/add")}
                />
              ) : (
                <IconButton
                  icon="SquarePen"
                  onClick={() => router.push("/workplace/construction/edit")}
                />
              ),
            render: construction ? (
              <ConstructionBox data={construction} />
            ) : (
              <span className="text-[var(--description-light)]">
                {" "}
                건물정보를 생성해주세요.
              </span>
            ),
          },
        ]}
      />
    </>
  );
};

const ConstructionBox = ({ data }: { data: Construction }) => {
  return (
    <div className="base-flex-col gap-2 w-full xl:w-100 ">
      <KeyValueItem
        mainStyle="flex-row justify-between"
        valueStyle="text-sm"
        label={"명칭"}
        value={data.buildingName}
      />
      <KeyValueItem
        mainStyle="flex-row justify-between"
        valueStyle="text-sm"
        label={"준공일"}
        value={format(data.completeDt, "yyyy-MM-dd")}
      />
      <KeyValueItem
        mainStyle="flex-row justify-between"
        valueStyle="text-sm"
        label={"주소"}
        value={data.address}
      />
      <KeyValueItem
        mainStyle="flex-row justify-between"
        valueStyle="text-sm"
        label={"연면적"}
        value={data.totalArea}
      />
      <KeyValueItem
        mainStyle="flex-row justify-between"
        valueStyle="text-sm"
        label={"건물용도"}
        value={data.usage}
      />
      <KeyValueItem
        mainStyle="flex-row justify-between"
        valueStyle="text-sm"
        label={"자주식 주차장"}
        value={data.selfParkingSpaces.toString()}
      />
      <KeyValueItem
        mainStyle="flex-row justify-between"
        valueStyle="text-sm"
        label={"기계식 주차장"}
        value={data.autoParkingSpaces.toString()}
      />
      <KeyValueItem
        mainStyle="flex-row justify-between"
        valueStyle="text-sm"
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
        <div className="flex-center rounded-[4px] w-60 h-40 bg-[var(--background)]   overflow-hidden group relative ">
          {data.images !== null ? (
            <img className="object-cover " src={data.images} />
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
