"use client";
import CustomCard from "@/components/common/card";
import { AdminListItem } from "@/types/admin/admin/user-list";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React from "react";

interface AdminCardWrapperProps {
  item: AdminListItem;
  link?: boolean;
  checkOption?: boolean;
  isCheck?: boolean;
  onClick?: (item: AdminListItem) => void;
}

const AdminCardWrapper = ({
  item,
  link,
  checkOption,
  isCheck,
  onClick,
}: AdminCardWrapperProps) => {
  return (
    <>
      {checkOption ? (
        <AdminCard item={item} isCheck={isCheck} onClick={onClick} />
      ) : (
        <>
          {link === true ? (
            <Link href={`/admin/user/${item.userSeq}`}>
              <AdminCard item={item} />
            </Link>
          ) : (
            <AdminCard item={item} />
          )}
        </>
      )}
    </>
  );
};

interface AdminCardProps {
  item: AdminListItem;
  isCheck?: boolean;
  onClick?: (item: AdminListItem) => void;
}

const AdminCard = ({ item, isCheck, onClick }: AdminCardProps) => {
  return (
    <CustomCard
      className={`flex-row items-center justify-between hover:bg-blue-50 py-2 ${
        isCheck ? "bg-blue-50 border-blue-500" : null
      }`}
      variant={"list"}
      onClick={() => onClick?.(item)}
    >
      <div className="flex gap-4 items-center">
        <div className="flex flex-col gap-1 min-w-20">
          <span className="text-sm">{item.userName}</span>
          <span className="text-xs text-[var(--description-light)]">
            {item.sabun}
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

export default AdminCardWrapper;
