import CustomCard from "@/components/common/card";
import { WorkplaceListItem } from "@/types/admin/workplace/workplace-list";
import React from "react";

const WorkplaceCard = ({ item }: { item: WorkplaceListItem }) => {
  return (
    // <div className="flex flex-col gap-2 px-4 py-4 border border-[var(--border)] rounded-[4px] hover:cursor-pointer"></div>
    <CustomCard className="hover:bg-blue-50" variant={"list"}>
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-end">
          <span className="text-sm font-bold">{item.name}</span>
          <span className="text-xs">{item.address}</span>
        </div>
        <span className="text-xs text-[var(--description-light)]">
          {item.tel}
        </span>
      </div>
      {/**
       * 업무유형
       */}
      {item.contractInfo && item.contractInfo.length > 0 ? (
        <div className="flex gap-2">
          {item.contractInfo.map((c, i) => {
            return (
              <div key={i} className="rounded-[4px] bg-blue-50 px-4">
                <span className="text-xs text-blue-500">{c.jobName}</span>
              </div>
            );
          })}
        </div>
      ) : null}
    </CustomCard>
  );
};

export default WorkplaceCard;
