"use client";

import BaseSkeleton from "@/components/common/base-skeleton";
import IconButton from "@/components/common/icon-button";
import AppTitle from "@/components/common/label/title";
import Tab from "@/components/common/tab";
import { KeyValueItem } from "@/components/ui/custom/key-value";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { usePermission } from "@/hooks/usePermission";
import { useUIStore } from "@/store/common/ui-store";
import { useBuildingStore } from "@/store/normal/building/building";
import { BuildingInfo, Construction } from "@/types/normal/building/building";
import { format } from "date-fns";
import { Building2, Plus, SquarePen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Building = () => {
  const router = useRouter();
  const { canWorkerEdit } = usePermission();
  const { construction, getConstruction, loadingKeys } = useBuildingStore();
  const { isLoading, hasError } = useUIStore();

  useEffect(() => {
    getConstruction();
  }, []);

  const getTab = () => {
    if (isLoading(loadingKeys.INFO)) return <BuildingSkeleton />;
    if (hasError(loadingKeys.INFO)) {
      return (
        <div className="flex items-center justify-center py-16 text-sm text-description">
          데이터를 불러오는 중 오류가 발생했어요.
        </div>
      );
    }

    return (
      <Tab
        configs={[
          {
            tabTitle: "건물",
            render: (
              <ScrollArea className="w-full whitespace-nowrap">
                {!construction ? (
                  <InfoEmptyState
                    onAdd={() => router.push("/workplace/construction/add")}
                  />
                ) : (
                  <div className="flex gap-5 w-max pb-2">
                    {construction.dongs?.map((b, i) => (
                      <BuildingBox key={i} data={b} />
                    ))}
                    {/* + 카드는 항상 마지막에 */}
                    {canWorkerEdit && (
                      <AddBuildingBox
                        onClick={() => router.push("/workplace/building/add")}
                      />
                    )}
                  </div>
                )}
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ),
          },
          {
            tabTitle: "정보",
            render: construction ? (
              <ConstructionBox
                data={construction}
                onEdit={
                  canWorkerEdit
                    ? () => router.push("/workplace/construction/edit")
                    : undefined
                }
              />
            ) : (
              <InfoEmptyState
                onAdd={() => router.push("/workplace/construction/add")}
              />
            ),
          },
        ]}
      />
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <AppTitle title="건물" />
      {getTab()}
    </div>
  );
};

const ConstructionBox = ({
  data,
  onEdit,
}: {
  data: Construction;
  onEdit?: () => void;
}) => {
  const infoItems = [
    { label: "명칭", value: data.buildingName },
    { label: "준공일", value: format(data.completeDt, "yyyy-MM-dd") },
    { label: "주소", value: data.address },
    { label: "연면적", value: data.totalArea },
    { label: "건물용도", value: data.usage, isBadge: true },
    { label: "자주식 주차장", value: `${data.selfParkingSpaces}대` },
    { label: "기계식 주차장", value: `${data.autoParkingSpaces}대` },
    { label: "장애인 주차장", value: `${data.handicapParkingSpaces}대` },
  ];

  return (
    <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
      {/* 카드 헤더 — 수정 버튼 */}
      {onEdit && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-background">
          <span className="text-xs font-semibold text-description">
            건축물 정보
          </span>
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-medium text-description-strong hover:border-border-strong hover:text-primary transition-all duration-150 cursor-pointer"
          >
            <SquarePen size={16} strokeWidth={1.5} />
            수정
          </button>
        </div>
      )}

      {/* 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {infoItems.map((item, i) => (
          <div
            key={i}
            className={`flex items-center justify-between px-4 py-3 border-b border-border
              ${i % 2 === 0 ? "sm:border-r" : ""}
              ${i >= infoItems.length - 2 ? "border-b-0" : ""}
            `}
          >
            <span className="text-xs text-description min-w-[90px]">
              {item.label}
            </span>
            {item.isBadge ? (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-primary-background text-primary border border-border-strong">
                {item.value}
              </span>
            ) : (
              <span className="text-sm font-medium text-foreground text-right">
                {item.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const BuildingBox = ({ data }: { data: BuildingInfo }) => {
  return (
    <Link href={`/workplace/building/${data.dongSeq}`}>
      <div className="flex flex-col gap-2 cursor-pointer group">
        <div className="relative w-60 h-40 rounded-xl overflow-hidden border border-border bg-[#e2e8f0] shadow-sm">
          {data.images ? (
            <Image
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              fill
              src={data.images}
              alt="건물 이미지"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <Building2
                size={32}
                className="text-primary opacity-40"
                strokeWidth={1.5}
              />
              <span className="text-xs text-description">{data.dongName}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
            <span className="text-xs text-white truncate">{data.address}</span>
          </div>
        </div>
        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-150">
          {data.dongName}
        </span>
      </div>
    </Link>
  );
};

// ── 건물 추가 카드 (+) ────────────────────────────────────
const AddBuildingBox = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col gap-2 cursor-pointer group"
    >
      <div className="relative w-60 h-40 rounded-xl border border-dashed border-[#cbd5e1] bg-[#f1f5f9] shadow-sm flex flex-col items-center justify-center gap-2 group-hover:bg-[#e2e8f0] group-hover:border-[#94a3b8] transition-all duration-200">
        <div className="w-9 h-9 rounded-full bg-white/70 flex items-center justify-center group-hover:bg-white transition-colors duration-200">
          <Plus
            size={16}
            className="text-[#94a3b8] group-hover:text-[#223377] transition-colors duration-200"
            strokeWidth={2}
          />
        </div>
        <span className="text-sm font-medium text-description group-hover:text-primary transition-colors duration-150">
          건물 추가
        </span>
      </div>
    </button>
  );
};

export default Building;

// ── 빈 상태 ────────────────────────────────────────────────
const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
    <div className="w-12 h-12 rounded-xl bg-primary-background flex items-center justify-center">
      <Building2 size={22} className="text-primary" strokeWidth={1.5} />
    </div>
    <p className="text-sm text-description">{message}</p>
  </div>
);

// ── 빈 상태 (정보 탭 전용) ────────────────────────────────
const InfoEmptyState = ({ onAdd }: { onAdd: () => void }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
    <div className="w-12 h-12 rounded-xl bg-primary-background flex items-center justify-center">
      <Building2 size={22} className="text-primary" strokeWidth={1.5} />
    </div>
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium text-description-strong">
        건축물 정보가 없어요
      </p>
      <p className="text-xs text-description">
        건축물 정보를 추가하고 관리해보세요
      </p>
    </div>
    <button
      onClick={onAdd}
      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors duration-150"
    >
      <Plus size={13} />
      건축물 정보 추가
    </button>
  </div>
);

// ── 스켈레톤 ───────────────────────────────────────────────
const BuildingSkeleton = () => (
  <div className="flex flex-col gap-4">
    <BaseSkeleton className="h-9 w-48" />
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="grid grid-cols-2">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-4 py-3 border-b border-border"
          >
            <BaseSkeleton className="h-4 w-20" />
            <BaseSkeleton className="h-4 w-28" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
