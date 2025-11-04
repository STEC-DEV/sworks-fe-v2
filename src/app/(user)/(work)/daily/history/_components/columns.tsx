import { TaskHistory } from "@/types/normal/task/task-history";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const taskHistoryCol: ColumnDef<TaskHistory>[] = [
  {
    accessorKey: "targetDt",
    header: "날짜",
    cell: ({ row }) => {
      const value = row.original.targetDt;
      return format(value, "yyyy-MM-dd");
    },
  },
  {
    accessorKey: "serviceTypeName",
    header: "업무유형",
    cell: ({ row }) => {
      const value = row.original.serviceTypeName;
      return value;
    },
  },
  {
    accessorKey: "title",
    header: "업무명",
    cell: ({ row }) => {
      const value = row.original.title;
      return value;
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

      return `${progress}%`;
    },
  },
];
