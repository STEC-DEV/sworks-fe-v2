"use client";
import AppTitle from "@/components/common/label/title";
import React, { useCallback, useEffect } from "react";
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

const EquipmentHistory = () => {
  const { historyList, getHistoryList } = useEquipmentHistoryMainStore();
  const { rawValue } = useDecodeParam("id");
  const searchParams = useSearchParams();

  const fetchData = useCallback(async () => {
    await getHistoryList(new URLSearchParams(searchParams), rawValue);
  }, [rawValue, searchParams, getHistoryList]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    console.log(historyList);
  }, [historyList]);

  const getList = () => {
    if (historyList.type === "loading") return <BaseSkeleton />;
    if (historyList.type === "error") return <BaseSkeleton />;
    return historyList.payload.data.length > 0 ? (
      historyList.payload.data.map((h, i) => <HistoryCard key={i} data={h} />)
    ) : (
      <EmptyBox />
    );
  };

  return (
    <>
      <AppTitle title="관리이력" />
      <HistoryFilter />

      <HistoryPagination />
      {getList()}
    </>
  );
};

const HistoryCard = ({ data }: { data: EquipmentHistoryListItem }) => {
  const { rawValue: id } = useDecodeParam("id");
  return (
    <Link href={`${id}/${data.detailSeq}`}>
      <CustomCard
        className="flex-row gap-6 items-center hover:border-blue-500 hover:bg-blue-50"
        variant={"list"}
      >
        <div className="tabular-nums flex gap-2 items-center px-2 py-1 text-xs bg-[var(--primary)] bg-blue-500 text-white rounded-[50px] w-fit ">
          <ClockIcon size={16} />
          {format(data.detailDt, "yyyy-MM-dd")}
        </div>
        <div className="flex-1">
          <span className="text-xs">{data.contents}</span>
        </div>

        <span className="text-xs text-[var(--description-dark)]">
          {data.remark}
        </span>

        <div>
          <ChevronRightIcon className="text-[var(--icon)]" strokeWidth={1.5} />
        </div>
      </CustomCard>
    </Link>
  );
};

export default EquipmentHistory;
