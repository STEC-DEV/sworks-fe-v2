"use client";
import AppTitle from "@/components/common/label/title";
import React, { Suspense, useCallback, useEffect } from "react";
import HistoryFilter from "./filter";
import { useEquipmentHistoryMainStore } from "@/store/normal/equipment/history/list-store";
import { useDecodeParam } from "@/hooks/params";
import { useSearchParams } from "next/navigation";
import CustomCard from "@/components/common/card";
import { format } from "date-fns";
import BaseSkeleton from "@/components/common/base-skeleton";
import {
  ChevronRight,
  ChevronRightIcon,
  ClockIcon,
  PackageOpenIcon,
} from "lucide-react";
import HistoryPagination from "./paginaion";
import Link from "next/link";
import EmptyBox from "@/components/ui/custom/empty";
import { useUIStore } from "@/store/common/ui-store";
import { OptionSectionWrapper } from "@/components/common/option-wrapper";

const EquipmentHistory = () => {
  const { historyList, getHistoryList, loadingKeys } =
    useEquipmentHistoryMainStore();
  const { isLoading, hasError } = useUIStore();
  const { rawValue } = useDecodeParam("id");
  const searchParams = useSearchParams();

  const fetchData = useCallback(async () => {
    await getHistoryList(new URLSearchParams(searchParams), rawValue);
  }, [rawValue, searchParams, getHistoryList]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getList = () => {
    if (isLoading(loadingKeys.LIST) || !historyList)
      return <BaseSkeleton className="flex-1" />;
    if (hasError(loadingKeys.LIST)) return <div>에러 발생</div>;
    return historyList.data.length > 0 ? (
      historyList.data.map((h, i) => <HistoryCard key={i} data={h} />)
    ) : (
      <CustomCard className="">
        <EmptyBox message="관리이력이 없어요" />
      </CustomCard>
    );
  };

  return (
    <>
      <AppTitle title="관리이력" />
      <OptionSectionWrapper>
        <HistoryFilter />
        <HistoryPagination />
      </OptionSectionWrapper>

      {getList()}
    </>
  );
};

const HistoryCard = ({ data }: { data: EquipmentHistoryListItem }) => {
  const { rawValue: id } = useDecodeParam("id");
  return (
    <Link href={`${id}/${data.detailSeq}`}>
      <CustomCard
        className="flex-col gpa-2  md:flex-row md:gap-6 md:items-center hover:border-primary hover:bg-primary-background"
        variant={"list"}
      >
        <div className="tabular-nums flex gap-2 items-center px-2 py-1 text-xs bg-primary text-white rounded-[50px] w-fit ">
          <ClockIcon size={16} />
          {format(data.detailDt, "yyyy-MM-dd")}
        </div>
        <div className="flex flex-1 justify-between items-center">
          <div className="flex-1">
            <span className="text-base font-medium">{data.contents}</span>
          </div>
          <span className="text-sm text-description">{data.remark}</span>
          <div>
            <ChevronRightIcon className="text-icon" strokeWidth={1.5} />
          </div>
        </div>
      </CustomCard>
    </Link>
  );
};

export default EquipmentHistory;
