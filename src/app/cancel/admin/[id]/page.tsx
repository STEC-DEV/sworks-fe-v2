"use client";
import {
  InfoSkeleton,
  KeyValue,
} from "@/app/admin/user/[id]/_components/profile/profile-card";
import CustomCard from "@/components/common/card";
import CheckDialog from "@/components/common/check-dialog";
import { SingleImageBox } from "@/components/common/image-box";
import { Building2, Mail, Phone, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { dialogText } from "../../../../../public/text";
import Button from "@/components/common/button";
import { useDecodeParam } from "@/hooks/params";
import { Response } from "@/types/common/response";
import { useRouter } from "next/navigation";
import BaseSkeleton from "@/components/common/base-skeleton";

const Page = () => {
  const { rawValue: id } = useDecodeParam("id");
  const [admin, setAdmin] = useState<AdminDetail | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDetail = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/adminuser/w/getadmindetailsample?userSeq=${id}`,
        {
          method: "GET",
        }
      );
      const data: Response<AdminDetail> = await res.json();

      setAdmin(data.data);
    };
    fetchDetail();
  }, [id]);
  const handleDelete = () => {
    router.push("/cancel");
  };

  if (admin === null)
    return (
      <div className="flex justify-center w-full h-full ">
        <div className="flex flex-col gap-6 w-full px-6 xl:w-[60vw] xl:px-0 py-6 ">
          {" "}
          <BaseSkeleton className="h-105" />
        </div>
      </div>
    );

  return (
    <div className="flex justify-center w-full h-full ">
      <div className="flex flex-col gap-6 w-full px-6 xl:w-[60vw] xl:px-0 py-6 ">
        <div className="flex flex-col gap-6">
          <CustomCard className="w-full  gap-6">
            <div className="flex gap-4 items-center px-6">
              <div className="relative flex items-end justify-center w-20 h-20  rounded-[50px] border border-[var(--border)] bg-[var(--background)] overflow-hidden">
                {admin.images ? (
                  <SingleImageBox path={admin.images} />
                ) : (
                  <User
                    className="text-[var(--icon)] stroke-[1.25px]"
                    size={56}
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-end gap-2">
                  <span className="text-xl font-semibold">
                    {admin.userName}
                  </span>
                  <span className="text-sm text-blue-500">{admin.role}</span>
                </div>
                <span className="text-sm text-[var(--description-light)]">
                  {admin.loginId}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <KeyValue icon={Building2} label="부서" value={admin.deptName} />
              <KeyValue
                icon={User}
                label="직책"
                value={admin.job ?? "내용없음"}
              />
              <KeyValue
                icon={Phone}
                label="전화번호"
                value={admin.phone ?? "내용없음"}
              />
              <KeyValue
                icon={Mail}
                label="이메일"
                value={admin.email ?? "내용없음"}
              />
            </div>
          </CustomCard>
          {admin.role !== "시스템관리자" && (
            <CheckDialog
              title={"회원탈퇴"}
              description={
                "회원탈퇴 시 계정은 즉시 비활성화되며, 탈퇴일 기준 30일 이내에 복구할 수 있습니다."
              }
              actionLabel={"회원탈퇴"}
              onClick={handleDelete}
            >
              <Button
                className="hover:text-red-500 hover:border-red-500 hover:bg-red-50"
                label="회원탈퇴요청"
                variant={"prev"}
                size={"sm"}
              />
            </CheckDialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
