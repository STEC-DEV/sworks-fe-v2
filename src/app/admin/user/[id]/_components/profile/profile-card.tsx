"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import Button from "@/components/common/button";
import CustomCard from "@/components/common/card";
import CheckDialog from "@/components/common/check-dialog";
import InfoEditForm from "@/components/form/admin/user/info-edit";
import BaseDialog from "@/components/ui/custom/base-dialog";

import { useDecodeParam } from "@/hooks/params";
import { useAdminDetailStore } from "@/store/admin/admin/admin-detail";
import { Building2, LucideIcon, Mail, Phone, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { dialogText } from "../../../../../../../public/text";
import { useAuthStore } from "@/store/auth/auth-store";
import { usePermission } from "@/hooks/usePermission";
import { useUIStore } from "@/store/common/ui-store";

const ProfileCard = () => {
  const { canEdit } = usePermission();
  const router = useRouter();
  const { admin, getAdminDetail, resetAdmin, deleteAdmin, loadingKeys } =
    useAdminDetailStore();
  const { isLoading, hasError } = useUIStore();
  const { resetPassword, loginProfile } = useAuthStore();
  const { rawValue: id } = useDecodeParam("id");

  const [editInfoOpen, setEditInfoOpen] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      resetAdmin();
    };
  }, []);

  useEffect(() => {
    if (!id) return;
    getAdminDetail(id);
  }, [id]);

  const handleDelete = async () => {
    const res = await deleteAdmin(id);
    if (res) {
      return router.replace("/admin/user");
    }
  };

  const handleReset = async () => {
    if (!id) return;
    await resetPassword(id);
  };

  if (isLoading(loadingKeys.INFO) || !admin) return <InfoSkeleton />;
  if (hasError(loadingKeys.INFO)) return <div>에러 발생</div>;

  return (
    <div className="flex flex-col gap-6">
      <CustomCard className="w-full xl:w-100 gap-6">
        <div className="flex gap-4 items-center px-6">
          <div className="flex items-end justify-center w-20 h-20  rounded-[50px] border border-[var(--border)] bg-[var(--background)]">
            <User className="text-[var(--icon)] stroke-[1.25px]" size={56} />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-end gap-2">
              <span className="text-xl font-semibold">{admin.userName}</span>
              <span className="text-sm text-blue-500">{admin.role}</span>
            </div>
            <span className="text-sm text-[var(--description-light)]">
              {admin.loginId}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <KeyValue icon={Building2} label="부서" value={admin.deptName} />
          <KeyValue icon={User} label="직책" value={admin.job ?? "내용없음"} />
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
      {canEdit && (
        <div className="flex gap-4">
          {/* 정보수정: canEdit AND 본인 계정 둘 다 필요 */}
          {admin.userSeq === loginProfile?.userSeq && (
            <BaseDialog
              title="정보수정"
              triggerChildren={<Button size={"sm"} label="정보수정" />}
              open={editInfoOpen}
              setOpen={setEditInfoOpen}
            >
              <InfoEditForm setOpen={setEditInfoOpen} />
            </BaseDialog>
          )}

          {/* 비밀번호 초기화: canEdit만 있으면 OK */}
          <CheckDialog
            title={dialogText.passwordReset.title}
            description={dialogText.passwordReset.description}
            actionLabel={dialogText.passwordReset.actionLabel}
            buttonColor="bg-blue-500 hover:bg-blue-600"
            onClick={handleReset}
          >
            <Button label="비밀번호 초기화" variant={"prev"} size={"sm"} />
          </CheckDialog>

          {/* 삭제: canEdit만 있으면 OK */}
          {admin.role !== "시스템관리자" && (
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
          )}
        </div>
      )}
    </div>
  );
};

interface KeyValueProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

const KeyValue = ({ icon, label, value }: KeyValueProps) => {
  const LucideIcon = icon;
  return (
    <div className="flex gap-4 items-center px-6">
      <LucideIcon className="text-[var(--icon)]" size={20} />
      <div className="flex flex-col gap-1">
        <span className="text-xs text-[var(--description-light)]">{label}</span>
        <span className="text-sm text-[var(--description-dark)]">
          {value || "내용없음"}
        </span>
      </div>
    </div>
  );
};

const InfoSkeleton = () => {
  return (
    <CustomCard className="w-100 gap-6 shrink-0 h-fit">
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
        {Array.from({ length: 4 }, (_, i) => (
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

export default ProfileCard;
