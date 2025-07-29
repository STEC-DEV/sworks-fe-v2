import CustomCard from "@/components/common/card";
import { AdminList, AdminListItem } from "@/types/admin/user/user-list";
import React from "react";

const UserCard = ({ item }: { item: AdminList }) => {
  return (
    <CustomCard
      className="flex-row items-center justify-between hover:bg-blue-50 py-2"
      variant={"list"}
    >
      <div className="flex gap-4 items-center">
        <div className="flex flex-col gap-1 min-w-20">
          <span className="text-sm">{item.userName}</span>
          <span className="text-xs text-[var(--description-light)]">
            {item.userTypeName}
          </span>
        </div>
        <div className="min-w-20">
          <span className="text-sm text-[var(--description-light)]">직급</span>
        </div>
        <div className="min-w-20">
          <span className="text-xs text-[var(--description-light)]">
            {item.phone}
          </span>
        </div>
      </div>
      <span className="text-sm text-[var(--description-dark)]">
        {item.deptName}
      </span>
    </CustomCard>
  );
};

export default UserCard;
