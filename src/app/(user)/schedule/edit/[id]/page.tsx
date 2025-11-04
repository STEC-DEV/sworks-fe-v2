"use client";
import AppTitle from "@/components/common/label/title";
import DayScheduleEditForm from "@/components/form/normal/schedule/day-edit";
import { useDecodeParam } from "@/hooks/params";
import { useScheduleStore } from "@/store/normal/schedule/shcedule-store";
import React, { useEffect } from "react";

const Page = () => {
  const { rawValue } = useDecodeParam("id");
  const { getDayScheduleDetail } = useScheduleStore();

  useEffect(() => {
    if (!rawValue) return;
    getDayScheduleDetail(rawValue);
  }, [rawValue]);

  return (
    <div className="flex flex-col gap-6 w-150">
      <AppTitle title="일정 수정" />
      <DayScheduleEditForm />
    </div>
  );
};

export default Page;
