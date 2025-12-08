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
        <span className="text-sm">{item.name}</span>
        <div className="flex flex-col gap-1">
          {/* <KeyValue
            label="용도"
            value={item.usage}
            valueSize="text-xs font-semibold"
          /> */}
          <KeyValue
            label="제조사"
            value={item.maker}
            valueSize="text-xs font-semibold"
          />
          {/* <KeyValue
            label="규격용량"
            value={item.capacity}
            valueSize="text-xs font-semibold"
          /> */}
          {/* <KeyValue
            label="구매자"
            value={item.buyer}
            valueSize="text-xs font-semibold"
          /> */}
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

export const mockEquipmentList: EquipmentListItem[] = [
  {
    equipSeq: 1001,
    serviceTypeSeq: 30,
    serviceTypeName: "미화",
    serial: "EQP-30-0001",
    name: "산업용 진공청소기",
    usage: "바닥청소",
    maker: "LG",
    capacity: "1600W",
    buyer: "관리부",
    buyDt: new Date("2024-01-12"),
    cost: 220000,
    amount: 3,
  },
  {
    equipSeq: 1002,
    serviceTypeSeq: 31,
    serviceTypeName: "보안",
    serial: "EQP-31-0001",
    name: "CCTV 카메라",
    usage: "영상감시",
    maker: "Hikvision",
    capacity: "4MP",
    buyer: "보안팀",
    buyDt: new Date("2023-11-03"),
    cost: 150000,
    amount: 12,
  },
  {
    equipSeq: 1003,
    serviceTypeSeq: 32,
    serviceTypeName: "시설",
    serial: "EQP-32-0001",
    name: "공조기 컨트롤러",
    usage: "HVAC 제어",
    maker: "Siemens",
    capacity: "2000 CMH",
    buyer: "시설팀",
    buyDt: new Date("2024-04-18"),
    cost: 850000,
    amount: 2,
  },
  {
    equipSeq: 1004,
    serviceTypeSeq: 33,
    serviceTypeName: "공통",
    serial: "EQP-33-0001",
    name: "레이블 프린터",
    usage: "자산 라벨링",
    maker: "Brother",
    capacity: "DK-22205 호환",
    buyer: "총무팀",
    buyDt: new Date("2024-02-20"),
    cost: 180000,
    amount: 4,
  },
  {
    equipSeq: 1005,
    serviceTypeSeq: 30,
    serviceTypeName: "미화",
    serial: "EQP-30-0002",
    name: "지면세척 스크러버",
    usage: "대면적 바닥세척",
    maker: "Kärcher",
    capacity: "20L 탱크",
    buyer: "관리부",
    buyDt: new Date("2023-12-10"),
    cost: 2900000,
    amount: 1,
  },
  {
    equipSeq: 1006,
    serviceTypeSeq: 31,
    serviceTypeName: "보안",
    serial: "EQP-31-0002",
    name: "출입통제 리더기",
    usage: "문 출입제어",
    maker: "HID",
    capacity: "RFID 13.56MHz",
    buyer: "보안팀",
    buyDt: new Date("2024-05-07"),
    cost: 320000,
    amount: 8,
  },
  {
    equipSeq: 1007,
    serviceTypeSeq: 32,
    serviceTypeName: "시설",
    serial: "EQP-32-0002",
    name: "승강기 비상통화장치",
    usage: "비상연락",
    maker: "Hyundai",
    capacity: "VoIP 지원",
    buyer: "시설팀",
    buyDt: new Date("2024-03-01"),
    cost: 450000,
    amount: 5,
  },
  {
    equipSeq: 1008,
    serviceTypeSeq: 33,
    serviceTypeName: "공통",
    serial: "EQP-33-0002",
    name: "공용 태블릿",
    usage: "점검 체크리스트",
    maker: "Samsung",
    capacity: '10.5" 64GB',
    buyer: "총무팀",
    buyDt: new Date("2024-06-15"),
    cost: 380000,
    amount: 6,
  },
  {
    equipSeq: 1009,
    serviceTypeSeq: 30,
    serviceTypeName: "미화",
    serial: "EQP-30-0003",
    name: "쓰레기 압축기",
    usage: "폐기물 압축",
    maker: "Komar",
    capacity: "5톤",
    buyer: "관리부",
    buyDt: new Date("2023-09-22"),
    cost: 5200000,
    amount: 1,
  },
  {
    equipSeq: 1010,
    serviceTypeSeq: 31,
    serviceTypeName: "보안",
    serial: "EQP-31-0003",
    name: "금속탐지기 게이트",
    usage: "출입 보안검색",
    maker: "Garrett",
    capacity: "다중존",
    buyer: "보안팀",
    buyDt: new Date("2024-07-02"),
    cost: 4200000,
    amount: 1,
  },
];
