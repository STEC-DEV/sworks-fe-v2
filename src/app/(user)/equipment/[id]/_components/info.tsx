"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import CustomCard from "@/components/common/card";
import IconButton from "@/components/common/icon-button";
import { useDecodeParam } from "@/hooks/params";
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
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

import React, { useEffect } from "react";

const EquipmentInfoCard = () => {
  const router = useRouter();
  const { equipmentDetail: data, getEquipmentDetail } =
    useEquipmentDetailStore();

  const { rawValue } = useDecodeParam("id");

  useEffect(() => {
    getEquipmentDetail(rawValue);
  }, [rawValue]);
  return (
    <>
      {data ? (
        <CustomCard className="xl:flex-row p-0 gap-0 ">
          {data.images ? (
            <div className="h-40 xl:w-80 xl:h-59 overflow-hidden">
              <img src={data.images} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-80 bg-[var(--background)] flex items-center justify-center">
              <ImageIcon size={24} className="text-[var(--icon)]" />
            </div>
          )}

          <div className="flex-1 flex flex-col px-6 py-6">
            {/* 헤더 */}
            <div className="flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <span className="text-sm text-[var(--description-light)]">
                  {data?.serial}
                </span>
                <span className="text-sm text-blue-500">
                  {data?.serviceTypeName}
                </span>
              </div>

              <IconButton
                icon="SquarePen"
                onClick={() => router.push(`${rawValue}/edit`)}
              />
            </div>
            {/* 바디 */}
            <div className="flex flex-col gap-6 ">
              <span className="text-lg">{data.name}</span>
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <IconKeyValue
                  icon={CalendarDaysIcon}
                  label="구매일"
                  value={format(data.buyDt, "yyyy-MM-dd")}
                  bgColor="bg-blue-50"
                  mainColor="text-blue-600"
                />
                <IconKeyValue
                  icon={StoreIcon}
                  label="구매처"
                  value={data.buyer}
                  bgColor="bg-orange-50"
                  mainColor="text-orange-600"
                />
                <IconKeyValue
                  icon={TargetIcon}
                  label="용도"
                  value={data.usage}
                  bgColor="bg-purple-50"
                  mainColor="text-purple-600"
                />
                <IconKeyValue
                  icon={DollarSignIcon}
                  label="비용"
                  value={data.cost.toString()}
                  bgColor="bg-green-50"
                  mainColor="text-green-600"
                />
                <IconKeyValue
                  icon={FactoryIcon}
                  label="제조사"
                  value={data.maker}
                  bgColor="bg-indigo-50"
                  mainColor="text-indigo-600"
                />
                <IconKeyValue
                  icon={GaugeIcon}
                  label="규격용량"
                  value={data.capacity}
                  bgColor="bg-rose-50"
                  mainColor="text-rose-600"
                />
                <IconKeyValue
                  icon={HashIcon}
                  label="수량"
                  value={data.amount.toString()}
                  bgColor="bg-gray-50"
                  mainColor="text-gray-600"
                />
              </div>
            </div>
          </div>
        </CustomCard>
      ) : (
        <BaseSkeleton />
      )}
    </>
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
    <div className="flex items-center gap-4 ">
      <div
        className={`flex items-center justify-center rounded-[4px] w-10 h-10 ${bgColor}`}
      >
        <Icon size={20} className={`${mainColor}`} strokeWidth={1.5} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm text-[var(--description-light)]">{label}</span>
        <span className="text-sm text-[var(--description-dark)]">{value}</span>
      </div>
    </div>
  );
};

export default EquipmentInfoCard;
