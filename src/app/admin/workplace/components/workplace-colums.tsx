import { WorkplaceListItem } from "@/types/admin/workplace/workplace-list";
import { ColumnDef } from "@tanstack/react-table";

export const workplaceColumns: ColumnDef<WorkplaceListItem>[] = [
  {
    accessorKey: "siteName",
    header: "사업장",
    cell: ({ row }) => {
      const value = row.original.siteName;
      return <span className="font-semibold ">{value}</span>;
    },
  },
  {
    accessorKey: "siteAddress",
    header: "주소",
    cell: ({ row }) => {
      const value = row.original.siteAddress;
      return <span className=" ">{value}</span>;
    },
  },
  {
    accessorKey: "siteTel",
    header: "전화번호",
    cell: ({ row }) => {
      const value = row.original.siteTel;
      return <span className="">{value}</span>;
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
              className="px-4 py-0.5  font-semibold text-primary  bg-primary-background rounded-DEFAULT border border-primary "
            >
              {v.serviceTypeName}
            </span>
          ))}
        </div>
      );
    },
  },
];
