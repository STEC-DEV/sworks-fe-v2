import { QeListItem } from "@/types/normal/qe/qe";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const qeCol: ColumnDef<QeListItem>[] = [
  {
    accessorKey: "serviceTypeName",
    header: "업무유형",
    cell: ({ row }) => {
      const value = row.original.serviceTypeName;
      return <span className="  ">{value}</span>;
    },
  },
  {
    accessorKey: "divCodeName",
    header: "관리부문",
    cell: ({ row }) => {
      const value = row.original.divCodeName;
      return <span className="  ">{value}</span>;
    },
  },
  {
    accessorKey: "typeCodeName",
    header: "관리유형",
    cell: ({ row }) => {
      const value = row.original.typeCodeName;
      return <span className="  ">{value}</span>;
    },
  },
  {
    accessorKey: "createDt",
    header: "평가일자",
    cell: ({ row }) => {
      const value = format(row.original.createDt, "yyyy-MM-dd");
      return <span className="">{value}</span>;
    },
  },
  {
    accessorKey: "createUser",
    header: "평가자",
    cell: ({ row }) => {
      const value = row.original.createUser;
      return <span className="">{value}</span>;
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
          <span className="text-base  text-primary font-bold">{value} </span>
          <span className="text-base  text-description-light font-bold">
            / {point}
          </span>
        </div>
      );
    },
  },
];
