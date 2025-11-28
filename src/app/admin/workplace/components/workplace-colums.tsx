import { WorkplaceListItem } from "@/types/admin/workplace/workplace-list";
import { ColumnDef } from "@tanstack/react-table";

export const workplaceColumns: ColumnDef<WorkplaceListItem>[] = [
  {
    accessorKey: "siteName",
    header: "사업장",
    cell: ({ row }) => {
      const value = row.original.siteName;
      return <span className="font-semibold text-xs">{value}</span>;
    },
  },
  {
    accessorKey: "siteAddress",
    header: "주소",
    cell: ({ row }) => {
      const value = row.original.siteAddress;
      return (
        <span className="text-xs text-[var(--description-dark)]">{value}</span>
      );
    },
  },
  {
    accessorKey: "siteTel",
    header: "전화번호",
    cell: ({ row }) => {
      const value = row.original.siteTel;
      return <span className="text-xs">{value}</span>;
    },
  },
  {
    accessorKey: "contracts",
    header: "계약유형",
    cell: ({ row }) => {
      const values = row.original.contracts;
      return (
        <div className="flex gap-2">
          {values?.map((v, i) => (
            <span
              key={i}
              className="px-4 py-0.5 text-xs font-semibold text-blue-500  bg-blue-50 rounded-[4px] border border-blue-500 "
            >
              {v.serviceTypeName}
            </span>
          ))}
        </div>
      );
    },
  },
];
