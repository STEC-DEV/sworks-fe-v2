"use client";
import AppTitle from "@/components/common/label/title";
import React, { useEffect, useState } from "react";
import TaskFilter from "./_components/filter";
import { useDailyTaskStore } from "@/store/normal/task/dailyTask";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TaskBox } from "./_components/item";
import BaseSkeleton from "@/components/common/base-skeleton";
import {
  BriefcaseBusiness,
  ChevronRight,
  LayoutList,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePermission } from "@/hooks/usePermission";
import { useUIStore } from "@/store/common/ui-store";
import { Switch } from "@/components/ui/switch";
import DonutChart from "@/components/ui/chart/donut-chart";
import CustomCard from "@/components/common/card";

const Page = () => {
  const {
    dailyTaskList,
    dailyTaskListByUser,
    getDailyTaskList,
    getDailyTaskListByUser,
    loadingKeys,
  } = useDailyTaskStore();
  const [viewMode, setViewMode] = useState<"TASK" | "WORKER">("TASK");
  const { isLoading, hasError } = useUIStore();
  const { canWorkerEdit } = usePermission();
  const searchParams = useSearchParams();
  useEffect(() => {
    viewMode === "TASK"
      ? getDailyTaskList(new URLSearchParams(searchParams))
      : getDailyTaskListByUser(new URLSearchParams(searchParams));
  }, [searchParams, getDailyTaskList, viewMode]);

  const getList = () => {
    if (isLoading(loadingKeys.LIST) || !dailyTaskList)
      return (
        <div className="flex flex-col gap-4 xl:grid xl:grid-cols-4 xl:gap-6">
          {Array.from({ length: 20 }, (_, i) => (
            <BaseSkeleton className="h-27.5" key={i} />
          ))}
        </div>
      );
    if (hasError(loadingKeys.LIST)) return <div>에러 발생</div>;
    return dailyTaskList.length > 0 ? (
      <div className="flex flex-col gap-4 md:grid-cols-2 md:grid xl:grid-cols-4 xl:gap-6">
        {dailyTaskList.map((d, i) => (
          <TaskBox key={i} data={d} />
        ))}
      </div>
    ) : (
      // <EmptyBox />
      <span className="text-md text-[var(--description-light)]">
        오늘은 업무가 없습니다
      </span>
    );
  };

  const getWorkerList = () => {
    const display = (total: number, complete: number) => {
      return (
        <div className="flex items-center gap-3 w-full flex-1 shrink-0 text-[var(--description-light)]">
          <div className="flex items-center gap-2 ">
            <span className="text-sm whitespace-nowrap">전체</span>
            <span className="text-xl font-bold">{total}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">완료</span>
            <span className="text-xl font-bold">{complete}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">진행</span>
            <span className="text-xl font-bold">{total - complete}</span>
          </div>
        </div>
      );
    };
    return (
      <div className="flex flex-col gap-4 xl:grid xl:grid-cols-4 xl:gap-6">
        {dailyTaskListByUser.map((v, i) => (
          <Link key={v.userSeq + i} href={`/daily/user/${v.userSeq}`}>
            <CustomCard className="flex px-4 py-2 cursor-pointer hover:bg-blue-50 hover:border-blue-500">
              <div className="flex flex-row items-center">
                <div className="flex-1 flex flex-col gap-6">
                  <span className="text-sm font-medium">{v.userName}</span>
                  {display(v.total, v.complete)}
                </div>

                <DonutChart
                  key={`${v.userSeq}-chart-${Date.now()} `}
                  data={[{ userName: v.userName, value: v.percent }]}
                />
              </div>
            </CustomCard>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <AppTitle title="일일업무" />
        {canWorkerEdit && (
          <div className="flex gap-6">
            <TabButton label="과거이력" href="/daily/history" />
            <TabButton label="업무관리" href="/daily/task" />
          </div>
        )}
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <TaskFilter viewMode={viewMode} />
        </div>

        <ViewModeSwitch mode={viewMode} setMode={(mode) => setViewMode(mode)} />
      </div>

      {viewMode === "TASK" ? getList() : getWorkerList()}
    </>
  );
};

export const TabButton = ({ label, href }: { label: string; href: string }) => {
  return (
    <Link href={href}>
      <div className="flex items-center gap-0.5 cursor-pointer group ">
        <span className="text-sm font-medium text-description group-hover:text-primary group-hover:font-bold duration-150">
          {label}
        </span>
        <ChevronRight
          size={16}
          className="text-description group-hover:text-primary"
        />
      </div>
    </Link>
  );
};

export default Page;

const ViewModeSwitch = ({
  mode,
  setMode,
}: {
  mode: "TASK" | "WORKER";
  setMode: (mode: "TASK" | "WORKER") => void;
}) => {
  return (
    <div className="flex items-start h-fit xl:h-full xl:items-center gap-1 rounded-lg border border-border bg-background p-0.5">
      <button
        type="button"
        onClick={() => setMode("TASK")}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer
          ${
            mode === "TASK"
              ? "bg-surface text-primary shadow-sm border border-border"
              : "text-description hover:text-description-strong"
          }`}
      >
        <LayoutList size={16} />
        업무별
      </button>

      <button
        type="button"
        onClick={() => setMode("WORKER")}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer
          ${
            mode === "WORKER"
              ? "bg-surface text-primary shadow-sm border border-border"
              : "text-description hover:text-description-strong"
          }`}
      >
        <Users size={16} />
        사용자별
      </button>
    </div>
  );
};
