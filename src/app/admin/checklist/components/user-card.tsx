import CustomCard from "@/components/common/card";
import { AdminListItem } from "@/types/admin/user/user-list";
import React from "react";

const UserCard = ({ item }: { item: AdminListItem }) => {
  return (
    <CustomCard
      className="flex-row items-center justify-between hover:bg-blue-50 py-2"
      variant={"list"}
    >
      <div className="flex gap-4 items-center">
        <div className="flex flex-col gap-1 min-w-20">
          <span className="text-sm">{item.name}</span>
          <span className="text-xs text-[var(--description-light)]">
            {item.permission}
          </span>
        </div>
        <div className="min-w-20">
          <span className="text-sm text-[var(--description-light)]">
            {item.job}
          </span>
        </div>
        <div className="min-w-20">
          <span className="text-xs text-[var(--description-light)]">
            {item.phone}
          </span>
        </div>
      </div>
      <span className="text-sm text-[var(--description-dark)]">
        {item.department.name}
      </span>
    </CustomCard>
  );
};

export default UserCard;
