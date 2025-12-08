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
import { Building2, Mail, Phone, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { dialogText } from "../../../../../../public/text";
import { useRouter } from "next/navigation";
import UserEditForm from "@/components/form/normal/user/edit";
import { SingleImageBox } from "@/components/common/image-box";

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
    <div className="flex flex-col gap-6">
      <CustomCard className="w-full xl:w-100 gap-6">
        <div className="flex gap-4 items-center px-6">
          <div className="relative flex items-end justify-center w-20 h-20  rounded-[50px] border border-[var(--border)] bg-[var(--background)] overflow-hidden">
            {user.images ? (
              <SingleImageBox path={user.images} />
            ) : (
              <User className="text-[var(--icon)] stroke-[1.25px]" size={56} />
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
  );
};

export default Page;

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
