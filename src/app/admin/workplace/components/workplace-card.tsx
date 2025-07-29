import CustomCard from "@/components/common/card";
import { WorkplaceListItem } from "@/types/admin/workplace/workplace-list";
import Link from "next/link";
import React from "react";

const WorkplaceCard = ({ item }: { item: WorkplaceListItem }) => {
  return (
    // <div className="flex flex-col gap-2 px-4 py-4 border border-[var(--border)] rounded-[4px] hover:cursor-pointer"></div>
    <Link href={`workplace/${item.siteSeq}`}>
      <CustomCard className="hover:bg-blue-50" variant={"list"}>
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
    </Link>
  );
};

export default WorkplaceCard;
