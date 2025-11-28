"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import CustomCard from "@/components/common/card";
import IconButton from "@/components/common/icon-button";
import WorkplaceInfoEditForm from "@/components/form/admin/workplace/workplace-edit";
import BaseDialog from "@/components/ui/custom/base-dialog";
import { usePermission } from "@/hooks/usePermission";
import { useWorkplaceDetailStore } from "@/store/admin/workplace/workplace-detail-store";
import { useUIStore } from "@/store/common/ui-store";
import { Building2, ImageIcon, LucideIcon, MapPin, Phone } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const InfoCard = () => {
  const { canEdit } = usePermission();
  const { id } = useParams<{ id: string }>();
  const { workplace, getWorkplaceDetail, loadingKeys } =
    useWorkplaceDetailStore();
  const { isLoading, hasError } = useUIStore();
  const [editInfoOpen, setEditInfoOpen] = useState<boolean>(false);
  useEffect(() => {
    if (!id) return;
    getWorkplaceDetail(parseInt(id));
    return () => {};
  }, []);

  if (isLoading(loadingKeys.INFO) || !workplace) return <InfoCardSkeleton />;
  if (hasError(loadingKeys.INFO)) return <div>에러 발생</div>;

  return (
    <CustomCard className="flex-col xl:flex-row p-0 gap-0 ">
      <div className="flex items-center justify-center w-full h-50 xl:h-auto xl:w-100  bg-[var(--background)] rounded-[4px]">
        <ImageIcon className="text-[var(--icon)]" />
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center w-full px-6 py-4 border-b border-[var(--border)]">
          <span className="font-bold">{workplace.siteName}</span>
          {canEdit && (
            <BaseDialog
              title="사업장 정보수정"
              triggerChildren={<IconButton icon="SquarePen" size={16} />}
              open={editInfoOpen}
              setOpen={setEditInfoOpen}
            >
              <WorkplaceInfoEditForm
                data={workplace}
                setOpen={setEditInfoOpen}
              />
            </BaseDialog>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 px-6 py-4">
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
  );
};

interface IconLabelProps {
  icon: LucideIcon;
  label: string;
  value: string | null;
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
        <span className="text-sm text-[var(--description-dark)]">
          {value || "내용 없음"}
        </span>
      </div>
    </div>
  );
};

export default InfoCard;

const InfoCardSkeleton = () => {
  return (
    <div className=" flex flex-col gap-4 xl:flex-row xl:gap-6 w-full xl:h-50 shrink-0">
      <BaseSkeleton className=" h-50 xl:w-100 xl:h-full" />
      <div className="flex flex-col gap-4 w-full xl:h-full">
        <BaseSkeleton className="h-10" />
        <BaseSkeleton className="h-15 xl:flex-1" />
      </div>
    </div>
  );
};
