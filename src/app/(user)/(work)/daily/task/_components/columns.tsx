"use client";
import CustomCard from "@/components/common/card";
import { useHoverTooltip } from "@/hooks/useHoverToolTip";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useState } from "react";

export const taskCol: ColumnDef<Task>[] = [
  {
    accessorKey: "termType",
    header: "구분",
    cell: ({ row }) => {
      const startDt = row.original.startDt;
      const endDt = row.original.endDt;
      var value = "";
      //추후 처리
      if (row.original.termType === 0) {
        value = "매일";
      } else if (row.original.termType === 1) {
        value = format(startDt, "yyyy/MM/dd");
      } else if (row.original.termType === 2 && endDt)
        value = `${format(startDt, "yyyy/MM/dd")} ~ ${format(
          endDt,
          "yyyy/MM/dd"
        )}`;

      return value;
    },
  },
  {
    accessorKey: "serviceTypeName",
    header: "유형",
    cell: ({ row }) => {
      const value = row.original.serviceTypeName;
      return value;
    },
  },
  {
    accessorKey: "title",
    header: "제목",
    cell: ({ row }) => {
      const value = row.original.title;
      return value;
    },
  },
  {
    accessorKey: "repeat",
    header: "반복횟수",
    cell: ({ row }) => {
      const value = row.original.repeat;
      return `${value.toString()}회`;
    },
  },
  {
    accessorKey: "users",
    header: "근무자",
    cell: ({ row }) => {
      //추후 처리
      const users = row.original.users;
      const value = users.map((user) => user.userName);

      return <UserList data={value} />;
    },
  },
];

const UserList = ({ data }: { data: string[] }) => {
  const { isHover, showLeft, ref, handleMouseEnter, handleMouseLeave } =
    useHoverTooltip();
  const value = () => {
    if (data.length < 3) return data.join(", ");
    return `${data.slice(0, 2).join(", ")} ...`;
  };
  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="text-[var(--description-light)]">{value()}</span>
      <CustomCard
        className={`xl:w-50 flex-col gap-2 absolute top-0  shadow-lg z-10 ${
          isHover ? "flex" : "hidden"
        } ${showLeft ? "right-full mr-2" : "left-full ml-2"}`}
        variant={"list"}
      >
        <span className="text-lg font-semibold">근무자</span>
        {data.map((v, i) => (
          <span key={i}>{v}</span>
        ))}
      </CustomCard>
    </div>
  );
};
