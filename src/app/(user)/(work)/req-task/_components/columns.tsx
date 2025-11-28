import { ProcessBadge } from "@/app/(user)/(voc)/voc/_components/item";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { AlarmClockIcon, CheckCircleIcon, RotateCwIcon } from "lucide-react";

export const reqCol: ColumnDef<RequestListItem>[] = [
  {
    accessorKey: "serviceTypeName",
    header: "유형",
    cell: ({ row }) => {
      const value = row.original.serviceTypeName;
      return (
        <span className="text-xs text-[var(--description-dark)] font-medium">
          {value}
        </span>
      );
    },
  },
  {
    accessorKey: "title",
    header: "제목",
    cell: ({ row }) => {
      const value = row.original.title;
      return <span className="text-xs font-medium">{value}</span>;
    },
  },
  {
    accessorKey: "userName",
    header: "요청자",
    cell: ({ row }) => {
      const value = row.original.userName;
      return <span className="text-xs">{value}</span>;
    },
  },
  {
    accessorKey: "createDt",
    header: "요청일시",
    cell: ({ row }) => {
      const value = format(row.original.createDt, "yyyy-MM-dd");
      return <span className="text-xs">{value}</span>;
    },
  },

  {
    accessorKey: "completeDt",
    header: "처리일시",
    cell: ({ row }) => {
      const value = row.original.completeDt
        ? format(row.original.completeDt, "yyyy-MM-dd")
        : null;
      return <span className="text-xs">{value}</span>;
    },
  },
  {
    accessorKey: "durationTime",
    header: "소요시간",
    cell: ({ row }) => {
      const value = row.original.durationTime;
      return <span className="text-xs">{value}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "상태",
    size: 50,
    enableResizing: false,
    cell: ({ row }) => {
      switch (row.original.status) {
        case 0:
          return (
            <ProcessBadge
              label="미처리"
              icon={AlarmClockIcon}
              style="bg-gray-400"
            />
          );
        case 1:
          return (
            <ProcessBadge
              label="처리중"
              icon={RotateCwIcon}
              style="bg-green-500"
            />
          );
        case 2:
          return (
            <ProcessBadge
              label="처리완료"
              icon={CheckCircleIcon}
              style="bg-blue-500"
            />
          );
      }
    },
  },
];
