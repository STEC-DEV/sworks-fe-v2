"use client";
import { KeyValue } from "@/app/admin/checklist/[id]/_components/checklist-info";
import BaseSkeleton from "@/components/common/base-skeleton";
import EmptyBox from "@/components/ui/custom/empty";
import { useUIStore } from "@/store/common/ui-store";
import { useEquipmentMainStore } from "@/store/normal/equipment/equip-main-store";
import { format } from "date-fns";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";

const EquipmentList = () => {
  const { equipmentList, getEquipmentList, loadingKeys } =
    useEquipmentMainStore();
  const { isLoading, hasError } = useUIStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    getEquipmentList(new URLSearchParams(searchParams));
  }, [getEquipmentList]);
  useEffect(() => {
    getEquipmentList(new URLSearchParams(searchParams));
  }, [searchParams, getEquipmentList]);

  //데이터 에러, 로딩인경우
  if (isLoading(loadingKeys.LIST) || !equipmentList) {
    return <BaseSkeleton className="flex-1" />;
  }
  if (hasError(loadingKeys.LIST)) {
    return <div>에러 발생</div>;
  }

  return (
    <>
      {equipmentList.data.length > 0 ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6">
          {equipmentList.data.map((e, i) => (
            <EquipmentBox key={i} item={e} />
          ))}
        </div>
      ) : (
        <EmptyBox />
      )}
    </>
  );
};

const EquipmentBox = ({ item }: { item: EquipmentListItem }) => {
  const router = useRouter();
  const handleOnClick = () => {
    router.push(`equipment/${item.equipSeq}`);
  };
  return (
    <div
      className="flex flex-col border border-[var(--border)] rounded-[4px] hover:cursor-pointer hover:border-blue-500 overflow-hidden"
      onClick={handleOnClick}
    >
      {item.images ? (
        <div className="w-full h-30 overflow-hidden relative">
          <Image
            fill
            src={item.images}
            className="w-full h-full object-cover"
            alt="이미지"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-25 bg-[var(--background)]">
          <ImageIcon className="text-[var(--icon)]" size={24} />
        </div>
      )}

      <div className="flex flex-col gap-2 px-4 py-2">
        <div className="flex justify-between">
          <span className="text-xs text-[var(--description-light)] ">
            {item.serial}
          </span>
          <span className=" text-sm text-blue-500">{item.serviceTypeName}</span>
        </div>
        <span className="text-sm font-medium">{item.name}</span>
        <div className="flex flex-col gap-1">
          <KeyValue
            label="제조사"
            value={item.maker}
            valueSize="text-xs font-semibold"
          />

          <KeyValue
            label="구매일"
            value={format(item.buyDt, "yyyy-MM-dd")}
            valueSize="text-xs font-semibold"
          />
          <KeyValue
            label="수량"
            value={item.amount.toString()}
            valueSize="text-xs font-semibold"
          />
          <KeyValue
            label="가격"
            value={`${item.cost?.toString() ?? "0"}원`}
            valueSize="text-xs font-semibold"
          />
        </div>
      </div>
    </div>
  );
};

export default EquipmentList;
