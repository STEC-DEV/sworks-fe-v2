import AppTitle from "@/components/common/label/title";
import DayScheduleAddForm from "@/components/form/normal/schedule/day-add";
import React from "react";

const Page = () => {
  return (
    <div className="flex flex-col gap-6 w-150">
      <AppTitle title="일정 생성" />
      <DayScheduleAddForm isOption />
    </div>
  );
};

export default Page;
