import CustomCard from "@/components/common/card";
import { WorkplaceListItem } from "@/types/admin/workplace/workplace-list";
import Link from "next/link";
import React from "react";

interface WorkplaceCardWrapperProps {
  item: WorkplaceListItem;
  checkOption?: boolean;
  isCheck?: boolean;
  onClick?: (item: WorkplaceListItem) => void;
}

const WorkplaceCardWrapper = ({
  item,
  checkOption = false,
  isCheck = false,
  onClick,
}: WorkplaceCardWrapperProps) => {
  return (
    <>
      {checkOption ? (
        <WorkplaceCard item={item} isCheck={isCheck} onClick={onClick} />
      ) : (
        <Link href={`/admin/workplace/${item.siteSeq}`}>
          <WorkplaceCard item={item} />
        </Link>
      )}
    </>
  );
};

interface WorkplaceCardProps {
  item: WorkplaceListItem;
  isCheck?: boolean;
  onClick?: (item: WorkplaceListItem) => void;
}

const WorkplaceCard = ({
  item,
  isCheck = false,
  onClick,
}: WorkplaceCardProps) => {
  return (
    <CustomCard
      className={`hover:bg-blue-50 hover:border-blue-500 ${
        isCheck ? "bg-blue-50 border-blue-500" : null
      }`}
      variant={"list"}
      onClick={() => onClick?.(item)}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-end">
          <span className="text-sm font-bold">{item.siteName}</span>
          <span className="text-xs">{item.siteAddress}</span>
        </div>
        <span className="text-xs text-[var(--description-light)]">
          {item.siteTel}
        </span>
      </div>
      {/**
       * 업무유형
       */}
      {item.contracts && item.contracts.length > 0 ? (
        <div className="flex gap-2">
          {item.contracts.map((c, i) => {
            return (
              <div key={i} className="rounded-[4px] bg-blue-50 px-4">
                <span className="text-xs text-blue-500">
                  {c.serviceTypeName}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}
    </CustomCard>
  );
};

export default WorkplaceCardWrapper;
