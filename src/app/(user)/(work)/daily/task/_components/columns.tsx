"use client";
import CustomCard from "@/components/common/card";
import { useHoverTooltip } from "@/hooks/useHoverToolTip";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const taskCol: ColumnDef<Task>[] = [
  {
    accessorKey: "termType",
    header: "구분",
    cell: ({ row }) => {
      const startDt = row.original.startDt;
      const endDt = row.original.endDt;
      let value = "";
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

      return <span className="text-xs font-medium ">{value}</span>;
    },
  },
  {
    accessorKey: "serviceTypeName",
    header: "유형",
    cell: ({ row }) => {
      const value = row.original.serviceTypeName;
      return <span className="text-xs text-blue-500 font-medium">{value}</span>;
    },
  },
  {
    accessorKey: "title",
    header: "제목",
    cell: ({ row }) => {
      const value = row.original.title;
      return <span className="text-xs">{value}</span>;
    },
  },
  {
    accessorKey: "repeat",
    header: "반복횟수",
    cell: ({ row }) => {
      const value = row.original.repeat;
      return <span className="text-xs">{`${value.toString()}회`}</span>;
    },
  },
  {
    accessorKey: "users",
    header: "근무자",
    cell: ({ row }) => {
      //추후 처리
      const users = row.original.users;
      const value = users.map((user) => user.userName);

      return (
        <div className="relative overflow-visible">
          <UserList data={value} />
        </div>
      );
    },
  },
];

const UserList = ({ data }: { data: string[] }) => {
  const value = () => {
    if (data.length < 3) return data.join(", ");
    return `${data.slice(0, 2).join(", ")} ${
      data.length - 2 !== 0 && `... 외 ${data.length - 2}명`
    } `;
  };
  return (
    <div>
      <span className="text-xs text-[var(--description-dark)]">{value()}</span>
    </div>
  );
};
