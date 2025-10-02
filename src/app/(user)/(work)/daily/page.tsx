"use client";
import AppTitle from "@/components/common/label/title";
import React, { useEffect } from "react";
import TaskFilter from "./_components/filter";
import { useDailyTaskStore } from "@/store/normal/task/dailyTask";
import { useSearchParams } from "next/navigation";
import { TaskBox } from "./_components/item";
import BaseSkeleton from "@/components/common/base-skeleton";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const Page = () => {
  const { dailyTaskList, getDailyTaskList } = useDailyTaskStore();
  const searchParams = useSearchParams();
  useEffect(() => {
    if (!searchParams) return;
    getDailyTaskList(new URLSearchParams(searchParams));
  }, [searchParams]);

  return (
    <>
      <div className="flex justify-between items-center">
        <AppTitle title="일일 업무" />
        <div className="flex gap-6">
          <TabButton label="과거이력" href="/daily/history" />
          <TabButton label="업무관리" href="/daily/task" />
        </div>
      </div>

      <TaskFilter />

      {dailyTaskList ? (
        <div className="flex flex-col gap-4 xl:grid xl:grid-cols-4 xl:gap-6">
          {dailyTaskList.map((d, i) => (
            <TaskBox key={i} data={d} />
          ))}
        </div>
      ) : (
        <BaseSkeleton />
      )}
    </>
  );
};

const TabButton = ({ label, href }: { label: string; href: string }) => {
  return (
    <Link href={href}>
      <div className="flex items-center gap-0.5 cursor-pointer">
        <span className="text-sm text-[var(--description-light)]">{label}</span>
        <ChevronRight size={16} className="text-[var(--icon)]" />
      </div>
    </Link>
  );
};

export default Page;
