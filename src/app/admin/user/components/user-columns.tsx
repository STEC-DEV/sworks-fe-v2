import { AdminListItem } from "@/types/admin/admin/user-list";
import { ColumnDef } from "@tanstack/react-table";
import { UserIcon } from "lucide-react";
import Image from "next/image";

export const userColumns: ColumnDef<AdminListItem>[] = [
  {
    accessorKey: "userName",
    header: "이름",
    maxSize: 50,
    enableResizing: false,
    cell: ({ row }) => {
      const name = row.original.userName;
      const sabun = row.original.sabun;

      const image = row.original.images;
      return (
        <div className="flex gap-2 w-fit">
          <div className="relative aspect-square w-10 h-10  border-2xl border border-border bg-background rounded-[4px]">
            {image ? (
              <Image
                fill
                src={image}
                alt="img"
                className="object-cover rounded-[4px]"
                loading="lazy"
              />
            ) : (
              <div className=" p-2 w-full h-full flex items-center justify-center">
                <UserIcon
                  className="text-[var(--icon)]"
                  strokeWidth={1.5}
                  size={50}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{name}</span>
            <span className="text-xs text-[var(--description-light)]">
              {sabun}
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
    accessorKey: "deptName",
    header: "부서",
    cell: ({ row }) => {
      const value = row.original.deptName;
      return <span className="text-xs">{value}</span>;
    },
  },
];
