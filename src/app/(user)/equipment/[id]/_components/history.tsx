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
import { ChevronRight, ChevronRightIcon, ClockIcon } from "lucide-react";
import HistoryPagination from "./paginaion";
import Link from "next/link";

const mockup: EquipmentHistoryListItem[] = [
  {
    detailSeq: 1,
    detailDt: new Date("2025-02-11"),
    contents: "장비 점검 기록 1",
    remark: undefined,
  },
  {
    detailSeq: 2,
    detailDt: new Date("2025-05-26"),
    contents: "장비 점검 기록 2",
    remark: "정상",
  },
  {
    detailSeq: 3,
    detailDt: new Date("2025-02-11"),
    contents: "장비 점검 기록 3",
    remark: "추가 확인 필요",
  },
  {
    detailSeq: 4,
    detailDt: new Date("2025-05-23"),
    contents: "장비 점검 기록 4",
    remark: undefined,
  },
  {
    detailSeq: 5,
    detailDt: new Date("2025-05-13"),
    contents: "장비 점검 기록 5",
    remark: "추가 확인 필요",
  },
  {
    detailSeq: 6,
    detailDt: new Date("2025-02-16"),
    contents: "장비 점검 기록 6",
    remark: undefined,
  },
  {
    detailSeq: 7,
    detailDt: new Date("2025-04-21"),
    contents: "장비 점검 기록 7",
    remark: "정상",
  },
  {
    detailSeq: 8,
    detailDt: new Date("2025-05-02"),
    contents: "장비 점검 기록 8",
    remark: "비고 8",
  },
  {
    detailSeq: 9,
    detailDt: new Date("2025-05-06"),
    contents: "장비 점검 기록 9",
    remark: undefined,
  },
  {
    detailSeq: 10,
    detailDt: new Date("2025-03-19"),
    contents: "장비 점검 기록 10",
    remark: "추가 확인 필요",
  },
  {
    detailSeq: 11,
    detailDt: new Date("2025-05-20"),
    contents: "장비 점검 기록 11",
    remark: undefined,
  },
  {
    detailSeq: 12,
    detailDt: new Date("2025-03-22"),
    contents: "장비 점검 기록 12",
    remark: "비고 12",
  },
  {
    detailSeq: 13,
    detailDt: new Date("2025-01-15"),
    contents: "장비 점검 기록 13",
    remark: "정상",
  },
  {
    detailSeq: 14,
    detailDt: new Date("2025-05-04"),
    contents: "장비 점검 기록 14",
    remark: undefined,
  },
  {
    detailSeq: 15,
    detailDt: new Date("2025-06-15"),
    contents: "장비 점검 기록 15",
    remark: "추가 확인 필요",
  },
  {
    detailSeq: 16,
    detailDt: new Date("2025-02-25"),
    contents: "장비 점검 기록 16",
    remark: "정상",
  },
  {
    detailSeq: 17,
    detailDt: new Date("2025-06-20"),
    contents: "장비 점검 기록 17",
    remark: undefined,
  },
  {
    detailSeq: 18,
    detailDt: new Date("2025-05-09"),
    contents: "장비 점검 기록 18",
    remark: "비고 18",
  },
  {
    detailSeq: 19,
    detailDt: new Date("2025-04-29"),
    contents: "장비 점검 기록 19",
    remark: "정상",
  },
  {
    detailSeq: 20,
    detailDt: new Date("2025-03-11"),
    contents: "장비 점검 기록 20",
    remark: undefined,
  },
  {
    detailSeq: 21,
    detailDt: new Date("2025-04-05"),
    contents: "장비 점검 기록 21",
    remark: "추가 확인 필요",
  },
  {
    detailSeq: 22,
    detailDt: new Date("2025-06-12"),
    contents: "장비 점검 기록 22",
    remark: undefined,
  },
  {
    detailSeq: 23,
    detailDt: new Date("2025-01-29"),
    contents: "장비 점검 기록 23",
    remark: "정상",
  },
  {
    detailSeq: 24,
    detailDt: new Date("2025-04-14"),
    contents: "장비 점검 기록 24",
    remark: "비고 24",
  },
  {
    detailSeq: 25,
    detailDt: new Date("2025-03-01"),
    contents: "장비 점검 기록 25",
    remark: undefined,
  },
  {
    detailSeq: 26,
    detailDt: new Date("2025-02-07"),
    contents: "장비 점검 기록 26",
    remark: "추가 확인 필요",
  },
  {
    detailSeq: 27,
    detailDt: new Date("2025-05-15"),
    contents: "장비 점검 기록 27",
    remark: "정상",
  },
  {
    detailSeq: 28,
    detailDt: new Date("2025-06-05"),
    contents: "장비 점검 기록 28",
    remark: undefined,
  },
  {
    detailSeq: 29,
    detailDt: new Date("2025-03-27"),
    contents: "장비 점검 기록 29",
    remark: "비고 29",
  },
  {
    detailSeq: 30,
    detailDt: new Date("2025-04-10"),
    contents: "장비 점검 기록 30",
    remark: "정상",
  },
];

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

  return (
    <>
      <AppTitle title="관리이력" />
      <HistoryFilter />
      {/* {historyList.type === "data" ? (
        historyList.data.map((h, i) => <HistoryCard key={i} data={h} />)
      ) : (
        <BaseSkeleton />
      )} */}
      <HistoryPagination />
      <div className="flex flex-col gap-2">
        {mockup.map((v, i) => (
          <HistoryCard key={i} data={v} />
        ))}
      </div>
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
