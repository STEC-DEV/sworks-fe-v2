import { ColumnDef } from "@tanstack/react-table";
import { UserIcon } from "lucide-react";

export const userColumns: ColumnDef<UserListItem>[] = [
  {
    accessorKey: "userName",
    header: "이름",
    maxSize: 50,
    enableResizing: false,
    cell: ({ row }) => {
      const name = row.original.userName;
      const job = row.original.job;
      return (
        <div className="flex gap-2 w-fit">
          <div className="p-2 border-2xl border border-border bg-background rounded-[4px]">
            <UserIcon className="text-[var(--icon)]" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{name}</span>
            <span className="text-xs text-[var(--description-light)]">
              {job ?? "job"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "권한",
    cell: ({ row }) => {
      const value = row.original.role;
      return <span className="text-xs text-blue-500 font-medium">{value}</span>;
    },
  },
  {
    accessorKey: "phone",
    header: "전화번호",
    cell: ({ row }) => {
      const value = row.original.phone;
      return <span className="text-xs ">{value}</span>;
    },
  },
  {
    accessorKey: "serviceTypes",
    header: "유형",
    cell: ({ row }) => {
      const values = row.original.serviceTypes;
      return (
        <div className="flex gap-2">
          {values.map((v, i) => (
            <span
              key={i}
              className="px-4 py-0.5 text-xs font-semibold text-blue-500  bg-blue-50 rounded-[4px] border border-blue-500 "
            >
              {v.userServiceTypeName}
            </span>
          ))}
        </div>
      );
    },
  },
];
