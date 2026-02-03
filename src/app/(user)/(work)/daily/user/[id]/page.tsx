"use client";
import CustomCard from "@/components/common/card";
import IconButton from "@/components/common/icon-button";
import AppTitle from "@/components/common/label/title";
import BaseDialog from "@/components/ui/custom/base-dialog";
import { useDecodeParam } from "@/hooks/params";
import { useAuthStore } from "@/store/auth/auth-store";
import { useUserDailyTaskStore } from "@/store/normal/task/useUserDailyTask";
import { UserDailyTaskDetailItem } from "@/types/normal/task/user-daily-deatil";
import { format } from "date-fns/format";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { rawValue } = useDecodeParam("id");
  const [item, setItem] = useState<UserDailyTaskDetailItem | null>(null);
  const { data, getData, isLoading } = useUserDailyTaskStore();

  const { loginProfile } = useAuthStore();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    getData(rawValue);
  }, [rawValue]);

  const handleItem = (item: UserDailyTaskDetailItem) => {
    setItem(item);
  };

  return (
    <div className="flex gap-12">
      <div className="flex-1 flex flex-col gap-6">
        <AppTitle title={data?.userName ?? ""} isBorder />
        <div className="flex flex-col gap-4">
          {data?.tasks.map((v, i) => (
            <CustomCard
              key={v.taskSeq}
              variant={"list"}
              onClick={() => handleItem(v)}
              className={`flex-row items-center justify-between ${item === v ? "bg-blue-50 border-blue-500" : null}`}
            >
              <span className="text-sm">{v.taskName}</span>
              <span className="text-blue-500 text-sm">{`${
                v.logDetails.length
              }/${v.repeat}`}</span>
            </CustomCard>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-6">
        <AppTitle title={"업무내용"} isBorder />

        <div className="flex flex-col gap-4">
          {item !== null && item.logDetails.length > 0 ? (
            item.logDetails.map((v, i) => (
              <CustomCard key={v.logSeq} variant={"list"}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--description-light)]">
                    {format(v.workDt, "yyyy-MM-dd HH:mm:ss")}
                  </span>
                  {(rawValue === loginProfile?.userSeq.toString() ||
                    loginProfile?.role === "현장 관리자") && (
                    <BaseDialog
                      title="업무이력 수정"
                      triggerChildren={<IconButton icon="SquarePen" />}
                      open={open}
                      setOpen={setOpen}
                    >
                      <div></div>
                    </BaseDialog>
                  )}
                </div>

                <span className="text-sm">
                  {v.issue ?? "업무를 수행하였습니다."}
                </span>
                {/* {data.attach.length > 0 && (
                  <DialogCarousel
                    pathList={data.attach
                      .map((a) => a.images)
                      .filter((image): image is string => image !== undefined)}
                  />
                )} */}
              </CustomCard>
            ))
          ) : (
            <span>업무이력이 없습니다.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
