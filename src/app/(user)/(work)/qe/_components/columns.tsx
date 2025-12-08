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
    header: () => <div className="text-right">점수</div>,
    size: 20,
    cell: ({ row }) => {
      const value = row.original.score;
      const point = row.original.total;
      return (
        <div className="text-right">
          <span className="text-md font-medium text-blue-500">{value} </span>
          <span className="text-md font-medium text-[var(--description-light)]">
            / {point}
          </span>
        </div>
      );
    },
  },
];
