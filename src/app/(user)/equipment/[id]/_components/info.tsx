"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import CustomCard from "@/components/common/card";
import IconButton from "@/components/common/icon-button";
import { SingleImageBox } from "@/components/common/image-box";
import { useDecodeParam } from "@/hooks/params";
import { usePermission } from "@/hooks/usePermission";
import { useUIStore } from "@/store/common/ui-store";
import { useEquipmentDetailStore } from "@/store/normal/equipment/equip-detail-store";
import { format } from "date-fns";
import {
  CalendarDaysIcon,
  DollarSignIcon,
  FactoryIcon,
  GaugeIcon,
  HashIcon,
  ImageIcon,
  LucideIcon,
  StoreIcon,
  TargetIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import React, { useEffect } from "react";

const EquipmentInfoCard = () => {
  const router = useRouter();
  const {
    equipmentDetail: data,
    getEquipmentDetail,
    loadingKeys,
  } = useEquipmentDetailStore();
  const { isLoading, hasError } = useUIStore();
  const { canWorkerEdit } = usePermission();

  const { rawValue } = useDecodeParam("id");

  useEffect(() => {
    getEquipmentDetail(rawValue);
  }, [rawValue]);

  if (isLoading(loadingKeys.INFO) || !data)
    return (
      <div className="flex gap-6">
        <BaseSkeleton className="w-80 h-59" />
        <div className="flex flex-col gap-6 w-full">
          <BaseSkeleton className="h-15" />
          <BaseSkeleton className="flex-1" />
        </div>
      </div>
    );

  if (hasError(loadingKeys.INFO)) return <div>에러 발생</div>;
  return (
    <CustomCard className="xl:flex-row p-0 gap-0 ">
      {data.images ? (
        <div className="h-40 xl:w-80 xl:h-59 overflow-hidden relative rounded-DEFAULT p-4">
          <SingleImageBox path={data.images} />
        </div>
      ) : (
        <div className="p-4">
          <div className="w-80 bg-background flex items-center justify-center h-full rounded-DEFAULT ">
            <ImageIcon size={24} className="text-icon" />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col px-6 py-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <span className="text-sm text-primary bg-primary-background px-2 py-0.5">
              {data?.serviceTypeName}
            </span>
            <span className="text-sm text-description">{data?.serial}</span>
          </div>
          {canWorkerEdit && (
            <IconButton
              icon="SquarePen"
              bgClassName="!rounded-DEFAULT border border-border-strong"
              onClick={() => router.push(`${rawValue}/edit`)}
            />
          )}
        </div>
        {/* 바디 */}
        <div className="flex flex-col gap-6 ">
          <span className="text-lg text-primary font-medium">{data.name}</span>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <IconKeyValue
              icon={CalendarDaysIcon}
              label="구매일"
              value={format(data.buyDt, "yyyy-MM-dd")}
              bgColor="blue-50"
              mainColor="blue-600"
            />
            <IconKeyValue
              icon={StoreIcon}
              label="구매처"
              value={data.buyer}
              bgColor="orange-50"
              mainColor="orange-600"
            />
            <IconKeyValue
              icon={TargetIcon}
              label="용도"
              value={data.usage}
              bgColor="purple-50"
              mainColor="purple-600"
            />
            <IconKeyValue
              icon={DollarSignIcon}
              label="비용"
              value={data.cost.toString()}
              bgColor="green-50"
              mainColor="green-600"
            />
            <IconKeyValue
              icon={FactoryIcon}
              label="제조사"
              value={data.maker}
              bgColor="indigo-50"
              mainColor="indigo-600"
            />
            <IconKeyValue
              icon={GaugeIcon}
              label="규격용량"
              value={data.capacity}
              bgColor="rose-50"
              mainColor="rose-600"
            />
            <IconKeyValue
              icon={HashIcon}
              label="수량"
              value={data.amount.toString()}
              bgColor="gray-50"
              mainColor="gray-600"
            />
          </div>
        </div>
      </div>
    </CustomCard>
  );
};

const IconKeyValue = ({
  label,
  value,
  icon,
  bgColor,
  mainColor,
}: {
  label: string;
  value: string;
  bgColor: string;
  mainColor: string;
  icon: LucideIcon;
}) => {
  const Icon = icon;
  return (
    <div className="flex items-center gap-4  rounded-DEFAULT ">
      <div
        className={`flex items-center justify-center rounded-[4px] w-10 h-10 bg-${bgColor} border `}
      >
        <Icon size={20} className={`text-${mainColor}`} strokeWidth={1.5} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-description">{label}</span>
        <span className="text-sm text-description-strong font-semibold">
          {value}
        </span>
      </div>
    </div>
  );
};

export default EquipmentInfoCard;
