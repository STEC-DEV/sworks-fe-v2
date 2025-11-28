import { TaskHistoryListItem } from "@/types/normal/task/task-history";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const taskHistoryCol: ColumnDef<TaskHistoryListItem>[] = [
  {
    accessorKey: "targetDt",
    header: "날짜",
    cell: ({ row }) => {
      const value = row.original.targetDt;
      return (
        <span className="text-xs font-medium">
          {format(value, "yyyy-MM-dd")}
        </span>
      );
    },
  },
  {
    accessorKey: "serviceTypeName",
    header: "업무유형",
    cell: ({ row }) => {
      const value = row.original.serviceTypeName;
      return (
        <span className="text-xs text-[var(--description-dark)] font-medium">
          {value}
        </span>
      );
    },
  },
  {
    accessorKey: "title",
    header: "업무명",
    cell: ({ row }) => {
      const value = row.original.title;
      return <span className="text-xs font-medium">{value}</span>;
    },
  },
  {
    accessorKey: "users",
    header: "진행률",
    cell: ({ row }) => {
      const totalCount = row.original.repeat * row.original.users.length;
      const totalUserCount = row.original.users
        .map((user) => user.count)
        .reduce((acc, curValue) => acc + curValue, 0);
      const progress = (totalUserCount / totalCount) * 100;

      return (
        <span className="text-[var(--description-dark)]">{`${progress.toFixed(
          0
        )}%`}</span>
      );
    },
  },
];
