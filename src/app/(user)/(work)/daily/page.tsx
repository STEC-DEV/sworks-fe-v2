"use client";
import AppTitle from "@/components/common/label/title";
import React, { useEffect } from "react";
import TaskFilter from "./_components/filter";
import { useDailyTaskStore } from "@/store/normal/task/dailyTask";
import { useSearchParams } from "next/navigation";
import { TaskBox } from "./_components/item";
import BaseSkeleton from "@/components/common/base-skeleton";
import { BriefcaseBusiness, ChevronRight } from "lucide-react";
import Link from "next/link";
import EmptyBox from "@/components/ui/custom/empty";
import { usePermission } from "@/hooks/usePermission";
import { useUIStore } from "@/store/common/ui-store";

const Page = () => {
  const { dailyTaskList, getDailyTaskList, loadingKeys } = useDailyTaskStore();
  const { isLoading, hasError } = useUIStore();
  const { canWorkerEdit } = usePermission();
  const searchParams = useSearchParams();
  useEffect(() => {
    getDailyTaskList(new URLSearchParams(searchParams));
  }, [searchParams, getDailyTaskList]);

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

  return (
    <>
      <div className="flex justify-between items-center">
        <AppTitle title="일일 업무" icon={BriefcaseBusiness} />
        {canWorkerEdit && (
          <div className="flex gap-6">
            <TabButton label="과거이력" href="/daily/history" />
            <TabButton label="업무관리" href="/daily/task" />
          </div>
        )}
      </div>

      <TaskFilter />

      {getList()}
    </>
  );
};

const TabButton = ({ label, href }: { label: string; href: string }) => {
  return (
    <Link href={href}>
      <div className="flex items-center gap-0.5 cursor-pointer group">
        <span className="text-sm text-[var(--description-light)] group-hover:text-blue-500">
          {label}
        </span>
        <ChevronRight
          size={16}
          className="text-[var(--icon)] group-hover:text-blue-500"
        />
      </div>
    </Link>
  );
};

export default Page;
