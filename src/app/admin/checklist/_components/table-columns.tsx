import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const checklistCol: ColumnDef<ChecklistTableItem>[] = [
  {
    accessorKey: "serviceTypeName",
    header: "업무 유형",
    cell: ({ row }) => {
      const value = row.original.serviceTypeName;
      return (
        <span className="text-xs text-[var(--description-light)] font-medium">
          {value}
        </span>
      );
    },
  },
  {
    accessorKey: "divCodeName",
    header: "관리 부문",
    cell: ({ row }) => {
      const value = row.original.divCodeName;
      return <span className="text-xs">{value}</span>;
    },
  },
  {
    accessorKey: "typeCodeName",
    header: "관리 유형",
    cell: ({ row }) => {
      const value = row.original.typeCodeName;
      return <span className="text-xs">{value}</span>;
    },
  },
  {
    accessorKey: "createDt",
    header: "업무 유형",
    cell: ({ row }) => {
      const value = row.original.createDt;
      return (
        <span className="text-xs font-medium">
          {format(value, "yyyy-MM-dd")}
        </span>
      );
    },
  },
  {
    accessorKey: "createUser",
    header: "작성자",
    cell: ({ row }) => {
      const value = row.original.createUser;
      return <span className="text-xs">{value}</span>;
    },
  },
];
