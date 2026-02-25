import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns/format";

export const mroColumns: ColumnDef<FacilityListItem>[] = [
  {
    accessorKey: "facilityCodeName",
    header: "유형",
    cell: ({ row }) => {
      const value = row.original.facilityCodeName;
      return <span className="font-semibold text-blue-500 ">{value}</span>;
    },
  },
  {
    accessorKey: "fromDt",
    header: "반입",
    cell: ({ row }) => {
      const value = format(row.original.fromDt, "yyyy-MM-dd");
      return <span className=" ">{value}</span>;
    },
  },
  {
    accessorKey: "description",
    header: "내용",
    cell: ({ row }) => {
      const value = row.original.description;
      return <span className="">{value}</span>;
    },
  },
  {
    accessorKey: "tel",
    header: "연락처",
    cell: ({ row }) => {
      const value = row.original.tel;
      return <span className="">{value}</span>;
    },
  },
  {
    accessorKey: "cost",
    header: "금액",
    cell: ({ row }) => {
      const value = row.original.cost;
      return <span className="">{value}</span>;
    },
  },
];
