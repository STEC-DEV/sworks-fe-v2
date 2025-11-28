import { QeListItem } from "@/types/normal/qe/qe";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const qeCol: ColumnDef<QeListItem>[] = [
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
    accessorKey: "divCodeName",
    header: "관리부문",
    cell: ({ row }) => {
      const value = row.original.divCodeName;
      return (
        <span className="text-xs text-[var(--description-dark)] font-medium">
          {value}
        </span>
      );
    },
  },
  {
    accessorKey: "typeCodeName",
    header: "관리유형",
    cell: ({ row }) => {
      const value = row.original.typeCodeName;
      return (
        <span className="text-xs text-[var(--description-dark)] font-medium">
          {value}
        </span>
      );
    },
  },
  {
    accessorKey: "createDt",
    header: "평가일자",
    cell: ({ row }) => {
      const value = format(row.original.createDt, "yyyy-MM-dd");
      return <span className="text-xs">{value}</span>;
    },
  },
  {
    accessorKey: "createUser",
    header: "평가자",
    cell: ({ row }) => {
      const value = row.original.createUser;
      return <span className="text-xs">{value}</span>;
    },
  },
  {
    accessorKey: "score",
    header: "점수",
    cell: ({ row }) => {
      const value = row.original.score;
      return <span className="text-md font-medium text-blue-500">{value}</span>;
    },
  },
];
