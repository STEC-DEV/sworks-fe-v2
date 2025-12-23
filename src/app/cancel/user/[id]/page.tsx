"use client";
import Button from "@/components/common/button";
import CheckDialog from "@/components/common/check-dialog";
import React, { useEffect, useState } from "react";
import { dialogText } from "../../../../../public/text";
import CustomCard from "@/components/common/card";
import { KeyValue } from "@/app/admin/user/[id]/_components/profile/profile-card";
import { Mail, Phone, UserIcon } from "lucide-react";
import { SingleImageBox } from "@/components/common/image-box";
import { useDecodeParam } from "@/hooks/params";
import { useRouter } from "next/navigation";
import { Response } from "@/types/common/response";
import { User } from "@/types/normal/user/list";
import BaseSkeleton from "@/components/common/base-skeleton";

const Page = () => {
  const { rawValue: id } = useDecodeParam("id");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDetail = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/w/getuserprofilesample?userSeq=${id}`,
        {
          method: "GET",
        }
      );
      const data: Response<User> = await res.json();

      setUser(data.data);
    };
    fetchDetail();
  }, [id]);
  const handleDelete = () => {
    router.push("/cancel");
  };

  if (user === null)
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
      <div className="flex flex-col gap-6w-full px-6 xl:w-[60vw] xl:px-0 py-6 ">
        <div className="flex flex-col gap-6">
          <CustomCard className="w-full  gap-6">
            <div className="flex gap-4 items-center px-6">
              <div className="relative flex items-end justify-center w-20 h-20  rounded-[50px] border border-[var(--border)] bg-[var(--background)] overflow-hidden">
                {user.images ? (
                  <SingleImageBox path={user.images} />
                ) : (
                  <UserIcon
                    className="text-[var(--icon)] stroke-[1.25px]"
                    size={56}
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-end gap-2">
                  <span className="text-xl font-semibold">{user.userName}</span>
                  <span className="text-sm text-blue-500">{user.role}</span>
                </div>
                <span className="text-sm text-[var(--description-light)]">
                  {user.sabun}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <KeyValue
                icon={UserIcon}
                label="직책"
                value={user.job ?? "내용없음"}
              />
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
        </div>
      </div>
    </div>
  );
};

export default Page;
