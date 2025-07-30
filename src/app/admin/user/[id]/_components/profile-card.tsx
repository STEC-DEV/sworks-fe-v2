"use client";
import Button from "@/components/common/button";
import CustomCard from "@/components/common/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminDetailStore } from "@/store/admin/admin/admin-detail";
import {
  BriefcaseBusiness,
  Building2,
  LucideIcon,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const ProfileCard = () => {
  const { admin, getAdminDetail } = useAdminDetailStore();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;
    getAdminDetail(parseInt(id));
  }, []);

  return admin ? (
    <div className="flex flex-col gap-6">
      <CustomCard className="w-100 gap-6">
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
          <KeyValue
            icon={User}
            label="직책"
            value={admin.job ?? "직책을 등록해주세요."}
          />
          <KeyValue
            icon={Phone}
            label="전화번호"
            value={admin.phone ?? "전화번호를 등록해주세요."}
          />
          <KeyValue
            icon={Mail}
            label="이메일"
            value={admin.email ?? "이메일을 등록해주세요."}
          />
        </div>
      </CustomCard>
      <div className="flex gap-4">
        <Button size={"sm"} label="정보수정" />
        <Button variant={"prev"} size={"sm"} label="패스워드 변경" />
      </div>
    </div>
  ) : (
    <Skeleton />
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
        <span className="text-sm text-[var(--description-dark)]">{value}</span>
      </div>
    </div>
  );
};

export default ProfileCard;
