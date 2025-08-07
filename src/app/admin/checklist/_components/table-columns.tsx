import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const checklistCol: ColumnDef<ChecklistItem>[] = [
  {
    accessorKey: "serviceTypeName",
    header: "업무 유형",
    cell: ({ row }) => {
      const value = row.original.serviceTypeName;
      return value;
    },
  },
  {
    accessorKey: "divCodeName",
    header: "관리 부문",
    cell: ({ row }) => {
      const value = row.original.divCodeName;
      return value;
    },
  },
  {
    accessorKey: "typeCodeName",
    header: "관리 유형",
    cell: ({ row }) => {
      const value = row.original.typeCodeName;
      return value;
    },
  },
  {
    accessorKey: "createDt",
    header: "업무 유형",
    cell: ({ row }) => {
      const value = row.original.createDt;
      return format(value, "yyyy-MM-dd");
    },
  },
  {
    accessorKey: "createUser",
    header: "작성자",
    cell: ({ row }) => {
      const value = row.original.createUser;
      return value;
    },
  },
];
