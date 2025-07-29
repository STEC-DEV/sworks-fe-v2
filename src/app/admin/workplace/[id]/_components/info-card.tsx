"use client";
import CustomCard from "@/components/common/card";
import IconButton from "@/components/common/icon-button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkplaceDetailStore } from "@/store/admin/workplace/workplace-detail-store";
import { WorkplaceDetail } from "@/types/admin/workplace/workplace-detail";
import { Building2, ImageIcon, LucideIcon, MapPin, Phone } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const InfoCard = ({ data }: { data: WorkplaceDetail }) => {
  const { id } = useParams<{ id: string }>();
  const { workplace, getWorkplaceDetail } = useWorkplaceDetailStore();

  useEffect(() => {
    if (!id) return;
    getWorkplaceDetail(parseInt(id));

    return () => {};
  }, []);

  return (
    <>
      {workplace ? (
        <CustomCard className="border flex-row p-0 gap-0 overflow-hidden">
          <div className="flex items-center justify-center w-100  bg-[var(--background)]">
            <ImageIcon className="text-[var(--icon)]" />
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex justify-between items-center w-full px-6 py-4 border-b border-[var(--border)]">
              <span className="font-bold">{workplace.siteName}</span>
              <IconButton icon="SquarePen" />
            </div>
            <div className="grid grid-cols-2 gap-y-6 px-6 py-4">
              <IconLabel
                icon={MapPin}
                label="주소"
                value={workplace.siteAddress}
                type={1}
              />
              <IconLabel
                icon={Phone}
                label="전화번호"
                value={workplace.siteTel}
                type={2}
              />
              <IconLabel
                icon={Building2}
                label="유형"
                value={workplace.serviceTypeName}
                type={3}
              />
            </div>
          </div>
        </CustomCard>
      ) : (
        <div className="w-full flex gap-6">
          <Skeleton className="h-50 w-100 rounded-[4px] bg-[var(--background)]" />
          <div className="flex-1 flex flex-col justify-center gap-6">
            <Skeleton className="h-20 w-full rounded-[4px] bg-[var(--background)]" />
            <Skeleton className="h-full w-full rounded-[4px] bg-[var(--background)]" />
          </div>
        </div>
      )}
    </>
  );
};

interface IconLabelProps {
  icon: LucideIcon;
  label: string;
  value: string;
  type: number;
}

const IconLabel = ({ icon, label, value, type }: IconLabelProps) => {
  const Icon = icon;
  const getBgColorByType = () => {
    const colorMap: Record<number, string> = {
      1: "bg-[#F3F9FF]",
      2: "bg-[#F3FFF5]",
      3: "bg-[#FFF8E0]",
    };
    return colorMap[type];
  };
  const bgColor = getBgColorByType();

  const getIconColorByType = () => {
    const colorMap: Record<number, string> = {
      1: "text-[#2372DA]",
      2: "text-[#23DA60]",
      3: "text-[#DA9A23]",
    };
    return colorMap[type];
  };

  const iconColor = getIconColorByType();

  return (
    <div className="flex gap-4">
      <div
        className={`flex justify-center items-center ${bgColor} w-10 h-10 rounded-[4px] `}
      >
        <Icon className={`${iconColor}`} />
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-[var(--description-light)]">{label}</span>
        <span className="text-sm text-[var(--description-dark)]">{value}</span>
      </div>
    </div>
  );
};

export default InfoCard;
