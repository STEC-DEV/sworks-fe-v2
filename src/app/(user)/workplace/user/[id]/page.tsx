"use client";
import { KeyValue } from "@/app/admin/user/[id]/_components/profile/profile-card";
import BaseSkeleton from "@/components/common/base-skeleton";
import Button from "@/components/common/button";
import CustomCard from "@/components/common/card";
import CheckDialog from "@/components/common/check-dialog";
import BaseDialog from "@/components/ui/custom/base-dialog";
import { useDecodeParam } from "@/hooks/params";
import { usePermission } from "@/hooks/usePermission";
import { useAuthStore } from "@/store/auth/auth-store";
import { useUIStore } from "@/store/common/ui-store";
import { useUserDetailStore } from "@/store/normal/user/detail-store";
import {
  Building2,
  ChevronDownIcon,
  CircleCheckBigIcon,
  HourglassIcon,
  ListTodoIcon,
  Mail,
  Phone,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { dialogText } from "../../../../../../public/text";
import { useRouter } from "next/navigation";
import UserEditForm from "@/components/form/normal/user/edit";
import { SingleImageBox } from "@/components/common/image-box";
import Image from "next/image";
import { format } from "date-fns";
import { useUserDailyTaskStore } from "@/store/normal/task/useUserDailyTask";
import CustomAccordion from "@/components/common/accordion/custom-accordion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  UserDailyTaskDetailItem,
  UserDailyTaskDetailItemLog,
} from "@/types/normal/task/user-daily-deatil";

const Page = () => {
  const router = useRouter();
  const { user, loadingKeys, getUserDetail, deleteUser } = useUserDetailStore();
  const { resetPassword, loginProfile } = useAuthStore();
  const { isLoading, hasError } = useUIStore();
  const { rawValue: id } = useDecodeParam("id");
  const { canWorkerEdit } = usePermission();
  const [editInfoOpen, setEditInfoOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    getUserDetail(id);
  }, [id]);

  const handleDelete = async () => {
    const res = await deleteUser(id);
    if (res) {
      return router.replace("/workplace");
    }
  };

  const handleReset = async () => {
    if (!id) return;
    await resetPassword(id);
  };

  if (isLoading(loadingKeys.DETAIL) || !user) return <ProfileSkeleton />;
  if (hasError(loadingKeys.DETAIL)) return <div>에러 발생</div>;

  return (
    <div className="flex flex-col gap-12  xl:flex-row">
      <div className="flex flex-col gap-6">
        <CustomCard className="w-full xl:w-100 gap-6">
          <div className="flex gap-4 items-center px-6">
            <div className="relative shrink-0 flex items-end justify-center w-20 h-20   rounded-[50px] border border-[var(--border)] bg-[var(--background)] overflow-hidden">
              {user.images ? (
                <SingleImageBox path={user.images} />
              ) : (
                <User
                  className="text-[var(--icon)] stroke-[1.25px]"
                  size={56}
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-end gap-2">
                <span className="text-xl font-semibold">{user.userName}</span>
                <span className="text-sm text-blue-500 whitespace-nowrap">
                  {user.role}
                </span>
              </div>
              <span className="text-sm text-[var(--description-light)]">
                {user.sabun}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <KeyValue icon={User} label="직책" value={user.job ?? "내용없음"} />
            <KeyValue
              icon={Phone}
              label="전화번호"
              value={user.phone ?? "내용없음"}
            />
            <KeyValue
              icon={Mail}
              label="이메일"
              value={user.email ?? "내용없음"}
            />
          </div>
        </CustomCard>
        {(canWorkerEdit || loginProfile?.userSeq === user.userSeq) && (
          <div className="flex gap-4">
            <BaseDialog
              title="정보수정"
              triggerChildren={<Button size={"sm"} label="정보수정" />}
              open={editInfoOpen}
              setOpen={setEditInfoOpen}
            >
              <UserEditForm onClose={() => setEditInfoOpen(false)} />
            </BaseDialog>

            <CheckDialog
              title={dialogText.passwordReset.title}
              description={dialogText.passwordReset.description}
              actionLabel={dialogText.passwordReset.actionLabel}
              buttonColor="bg-blue-500 hover:bg-blue-600"
              onClick={handleReset}
            >
              <Button label="비밀번호 초기화" variant={"prev"} size={"sm"} />
            </CheckDialog>
            <CheckDialog
              title={dialogText.defaultDelete.title}
              description={dialogText.defaultDelete.description}
              actionLabel={dialogText.defaultDelete.actionLabel}
              onClick={handleDelete}
            >
              <Button
                className="hover:text-red-500 hover:border-red-500 hover:bg-red-50"
                label="삭제"
                variant={"prev"}
                size={"sm"}
              />
            </CheckDialog>
          </div>
        )}
      </div>
      {user.role === "근무자" && (
        <div className="h-full w-full relative rounded-[4px] ">
          <WorkerDashboard />
        </div>
      )}
    </div>
  );
};

export default Page;

const WorkerDashboard = () => {
  const { rawValue } = useDecodeParam("id");
  const { data, getData, isLoading } = useUserDailyTaskStore();
  const { user } = useUserDetailStore();

  useEffect(() => {
    getData(rawValue);
  }, []);
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col space-y-2">
          <span className="text-xl text-[var(--description-dark)] font-bold">
            {format(Date.now(), "yyyy")}년 {format(Date.now(), "MM")}월{" "}
            {format(Date.now(), "dd")}일 업무현황
          </span>
          <span className="text-[var(--description-light)]">
            {user?.userName}님의 업무 내용을 한눈에 볼 수 있어요
          </span>
        </div>

        <div className="flex gap-12 justify-between">
          <WorkItem
            value={data?.totalTaskCount.toString() ?? "Unknown"}
            label="전체 업무"
            icon={
              // <div className="p-2.5 bg-[#d3d3d3]/30 rounded-full ">
              //   <ListTodoIcon
              //     size={28}
              //     className="text-[var(--description-light)]"
              //     strokeWidth={1.5}
              //   />
              // </div>
              <div className="p-2.5 bg-blue-100 rounded-full ">
                <ListTodoIcon
                  size={28}
                  className="text-blue-500"
                  strokeWidth={1.5}
                />
              </div>
            }
          />
          <WorkItem
            value={data?.totalCompleteCount.toString() ?? "Unknown"}
            label="완료 업무"
            icon={
              // <div className="p-2.5 bg-[#d3d3d3]/30 rounded-full ">
              //   <CircleCheckBigIcon
              //     size={28}
              //     className="text-[var(--description-light)]"
              //     strokeWidth={1.5}
              //   />
              // </div>
              <div className="p-2.5 bg-green-100 rounded-full ">
                <CircleCheckBigIcon
                  size={28}
                  className="text-green-700"
                  strokeWidth={1.5}
                />
              </div>
            }
          />
          <WorkItem
            value={
              (
                (data?.totalTaskCount ?? 0) - (data?.totalCompleteCount ?? 0)
              ).toString() ?? "Unknown"
            }
            label="미완료 업무"
            icon={
              // <div className="p-2.5 bg-[#d3d3d3]/30 rounded-full ">
              //   <HourglassIcon
              //     size={28}
              //     className="text-[var(--description-light)]"
              //     strokeWidth={1.5}
              //   />
              // </div>
              <div className="p-2.5 bg-orange-100 rounded-full ">
                <HourglassIcon
                  size={28}
                  className="text-orange-700"
                  strokeWidth={1.5}
                />
              </div>
            }
          />
        </div>
      </div>
      {/* 업무 목록 */}
      <div className="flex flex-col gap-6">
        {data?.tasks.map((v, i) => (
          <WorkAccordion key={v.taskSeq} data={v} />
        ))}
      </div>
    </div>
  );
};

//헤더 현황판
const WorkItem = ({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
}) => {
  return (
    <CustomCard className="flex-row items-center w-full  px-4 py-4 min-w-60">
      {icon}
      <div className="flex flex-col gap-1">
        <span className="text-[var(--description-light)]">{label}</span>
        <span className="text-2xl font-semibold text-[var(--description-light)]">
          {value}
        </span>
      </div>
    </CustomCard>
  );
};

//아코디언
const WorkAccordion = ({ data }: { data: UserDailyTaskDetailItem }) => {
  const [open, setOpen] = useState<boolean>(false);

  const status = () => {
    return data.isComplete ? (
      <div className="bg-green-100 text-green-700 px-3 text-sm py-1 rounded-4xl">
        완료
      </div>
    ) : (
      <div className="bg-orange-100 text-orange-700 px-3 text-sm py-1 rounded-4xl">
        미완료
      </div>
    );
  };
  return (
    <CustomCard
      className="flex py-0 px-0 cursor-default gap-0"
      variant={"list"}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between gap-4 px-4 py-4 cursor-pointer"
      >
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex justify-between">
            <span>{data.taskName}</span>
            {status()}
          </div>

          <div className="flex gap-2 text-sm text-start text-[var(--description-light)]">
            <CircleCheckBigIcon
              className={`${data.isComplete ? "text-green-600" : ""}`}
              size={20}
              strokeWidth={1.5}
            />
            업무횟수 {data.logDetails.length} / {data.repeat}
          </div>
        </div>
        <div>
          <ChevronDownIcon
            className={`text-[var(--icon)] ${open ? "rotate-180 " : ""} duration-150`}
          />
        </div>
      </button>
      <div
        className={`
          px-4 pb-4
      grid transition-all duration-300 ease-in-out
      ${open ? "grid-rows-[1fr] pt-4" : "grid-rows-[0fr]"}
    `}
      >
        <div className="overflow-hidden">
          <div className="border-t pt-4 space-y-4">
            {data.logDetails.length > 0 ? (
              data.logDetails.map((l, i) => (
                <LogItem key={i + "log" + l.logSeq} data={l} />
              ))
            ) : (
              <div className="text-sm text-[var(--description-light)]">
                아직 업무를 수행하지 않았습니다
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomCard>
  );
};

const LogItem = ({ data }: { data: UserDailyTaskDetailItemLog }) => {
  return (
    <div>
      <div className="text-sm bg-[#f5f5f5] px-4 py-2 space-x-6">
        <span className="text-blue-600">{format(data.workDt, "HH:mm")}</span>
        <span className="text-[var(--description-light)]">
          {data.issue || "업무 완료!"}
        </span>
      </div>
      {/* 일단 api에 파일은 없음 */}
    </div>
  );
};

//프로필 스켈레톤
const ProfileSkeleton = () => {
  return (
    <CustomCard className="w-full xl:w-100 gap-6 shrink-0 h-fit">
      <div className="flex gap-4 items-center px-6 ">
        <div className="flex items-end justify-center w-20 h-20  rounded-[50px] border border-[var(--border)] bg-[var(--background)]">
          <User className="text-[var(--icon)] stroke-[1.25px]" size={56} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-end gap-2">
            <BaseSkeleton className="w-13 h-7" />
            <BaseSkeleton className="w-9 h-5" />
          </div>
          <BaseSkeleton className="w-9 h-5" />
        </div>
      </div>
      <div className="flex flex-col gap-4 ">
        {Array.from({ length: 3 }, (_, i) => (
          <div className="flex gap-4 items-center px-6" key={i}>
            <Building2 className="text-[var(--icon)]" size={20} />
            <div className="flex flex-col gap-1 w-full">
              <BaseSkeleton className="w-full h-4" />
              <BaseSkeleton className="w-full h-5" />
            </div>
          </div>
        ))}
      </div>
    </CustomCard>
  );
};
