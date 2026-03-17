import { DynamicDetail } from "@/types/normal/building/building";
import { ColumnDef } from "@tanstack/react-table";

export const pumpColumns: ColumnDef<DynamicDetail>[] = [
  {
    accessorKey: "typeName",
    header: "구분",
    cell: ({ row }) => {
      const value = row.original.typeName;
      return <span className="text-primary text-sm font-bold">{value}</span>;
    },
  },
  {
    accessorKey: "flowRate",
    header: "토출량",
    cell: ({ row }) => {
      const value = row.original.flowRate;
      return <span className="text-sm">{value} m³/hr</span>;
    },
  },
  {
    accessorKey: "totalHead",
    header: "전양정",
    cell: ({ row }) => {
      const value = row.original.totalHead;
      return <span className="text-sm">{value} m</span>;
    },
  },
  {
    accessorKey: "qty",
    header: "수량",
    cell: ({ row }) => {
      const value = row.original.qty;
      return <span className="text-sm">{value} 대</span>;
    },
  },
  {
    accessorKey: "comments",
    header: "비고",
    cell: ({ row }) => {
      const value = row.original.comments;
      return <span>{value}</span>;
    },
  },
];
