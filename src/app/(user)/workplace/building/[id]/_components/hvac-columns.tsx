import { DynamicDetail } from "@/types/normal/building/building";
import { ColumnDef } from "@tanstack/react-table";

export const hvacColumns: ColumnDef<DynamicDetail>[] = [
  {
    accessorKey: "typeName",
    header: "구분",
    cell: ({ row }) => {
      const value = row.original.typeName;
      return <span className="text-primary text-sm font-bold">{value}</span>;
    },
  },
  {
    accessorKey: "capacity",
    header: "용량",
    cell: ({ row }) => {
      const value = row.original.capacity;
      return <span className="text-sm">{value} RT</span>;
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
