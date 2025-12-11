import { ColumnDef } from "@tanstack/react-table";
import { UserIcon } from "lucide-react";

export const WorkerColumns: ColumnDef<Worker>[] = [
  {
    accessorKey: "userName",
    header: "이름",
    maxSize: 50,
    enableResizing: false,
    cell: ({ row }) => {
      const name = row.original.userName;
      //   const job = row.original.job;
      return (
        <div className="flex gap-2 w-fit">
          <div className="p-2 border-2xl border border-border bg-background rounded-[4px]">
            <UserIcon className="text-[var(--icon)]" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{name}</span>
            {/* <span className="text-xs text-[var(--description-light)]">
              {job ?? "job"}
            </span> */}
            <span className="text-xs text-[var(--description-light)]">
              {"job"}
            </span>
          </div>
        </div>
      );
    },
  },
  //   {
  //     accessorKey: "role",
  //     header: "권한",
  //     cell: ({ row }) => {
  //       const value = row.original.role;
  //       return <span className="text-xs text-blue-500 font-medium">{value}</span>;
  //     },
  //   },
  {
    accessorKey: "phone",
    header: "전화번호",
    cell: ({ row }) => {
      const value = row.original.phone;
      return <span className="text-xs ">{value ?? "01012345678"}</span>;
    },
  },
  {
    accessorKey: "serviceTypeName",
    header: "유형",
    cell: ({ row }) => {
      const values = row.original.serviceTypeName;
      return (
        <span className="px-4 py-0.5 text-xs font-semibold text-blue-500  bg-blue-50 rounded-[4px] border border-blue-500 ">
          {values}
        </span>
      );
    },
  },
];
