import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns/format";

export const mroColumns: ColumnDef<FacilityListItem>[] = [
  {
    accessorKey: "facilityCodeName",
    header: "유형",
    cell: ({ row }) => {
      const value = row.original.facilityCodeName;
      return value;
    },
  },
  {
    accessorKey: "fromDt",
    header: "반입",
    cell: ({ row }) => {
      const value = format(row.original.fromDt, "yyyy-MM-dd");
      return value;
    },
  },
  {
    accessorKey: "description",
    header: "내용",
  },
  {
    accessorKey: "tel",
    header: "연락처",
  },
  {
    accessorKey: "cost",
    header: "금액",
  },
];
