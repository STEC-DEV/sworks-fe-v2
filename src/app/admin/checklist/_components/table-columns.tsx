import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const checklistCol: ColumnDef<ChecklistTableItem>[] = [
  {
    accessorKey: "serviceTypeName",
    header: "업무 유형",
    cell: ({ row }) => {
      const value = row.original.serviceTypeName;
      return <span className=" text-primary font-bold">{value}</span>;
    },
  },
  {
    accessorKey: "divCodeName",
    header: "관리 부문",
    cell: ({ row }) => {
      const value = row.original.divCodeName;
      return <span className="">{value}</span>;
    },
  },
  {
    accessorKey: "typeCodeName",
    header: "관리 유형",
    cell: ({ row }) => {
      const value = row.original.typeCodeName;
      return <span className="">{value}</span>;
    },
  },
  {
    accessorKey: "createDt",
    header: "생성 일자",
    cell: ({ row }) => {
      const value = row.original.createDt;
      return (
        <span className=" font-medium">{format(value, "yyyy-MM-dd")}</span>
      );
    },
  },
  {
    accessorKey: "createUser",
    header: "작성자",
    cell: ({ row }) => {
      const value = row.original.createUser;
      return <span className="">{value}</span>;
    },
  },
];
