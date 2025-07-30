"use client";
import CustomCard from "@/components/common/card";
import { AdminListItem } from "@/types/admin/admin/user-list";
import { useRouter } from "next/navigation";

import React from "react";

const AdminCard = ({
  item,
  link = false,
}: {
  item: AdminListItem;
  link?: boolean;
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`user/${item.userSeq}`);
  };

  return (
    <CustomCard
      className="flex-row items-center justify-between hover:bg-blue-50 py-2"
      variant={"list"}
      onClick={link ? () => handleClick() : undefined}
    >
      <div className="flex gap-4 items-center">
        <div className="flex flex-col gap-1 min-w-20">
          <span className="text-sm">{item.userName}</span>
          <span className="text-xs text-[var(--description-light)]">
            {item.role}
          </span>
        </div>
        <div className="min-w-20">
          <span className="text-sm text-[var(--description-light)]">
            {item.role}
          </span>
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

export default AdminCard;
