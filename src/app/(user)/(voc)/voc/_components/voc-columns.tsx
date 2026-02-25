"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ProcessBadge } from "./item";
import { format } from "date-fns";
import { AlarmClockIcon, CheckCircleIcon, RotateCwIcon } from "lucide-react";

export const vocListCol: ColumnDef<VocListItem>[] = [
  {
    accessorKey: "division",
    header: "구분",
    cell: ({ row }) => {
      const value = row.original.division;
      return (
        <span className="text-[var(--description-dark)]">
          {value ? "수기입력" : "모바일"}
        </span>
      );
    },
  },
  {
    accessorKey: "name",
    header: "지점",
    cell: ({ row }) => {
      const value = row.original.name;
      return <span className=" ">{value}</span>;
    },
  },
  {
    accessorKey: "serviceTypeName",
    header: "유형",
    cell: ({ row }) => {
      const value = row.original.serviceTypeName;
      return <span className=" text-blue-500 font-semibold">{value}</span>;
    },
  },
  {
    accessorKey: "createUser",
    header: "민원인",
    cell: ({ row }) => {
      const value = row.original.createUser;
      return <span className=" ">{value}</span>;
    },
  },
  {
    accessorKey: "phone",
    header: "전화번호",
    cell: ({ row }) => {
      const value = row.original.phone;
      return <span className="">{value}</span>;
    },
  },
  {
    accessorKey: "title",
    header: "제목",
    cell: ({ row }) => {
      const value = row.original.title;
      return <span className="">{value}</span>;
    },
  },
  {
    accessorKey: "createDt",
    header: "발생일시",
    cell: ({ row }) => {
      const value = row.original.createDt;
      return (
        <span className="">
          {value && format(value, "yyyy-MM-dd HH:mm:ss")}
        </span>
      );
    },
  },
  {
    accessorKey: "completeDt",
    header: "처리일시",
    cell: ({ row }) => {
      const value = row.original.completeDt;
      return (
        <span className="">
          {value && format(value, "yyyy-MM-dd HH:mm:ss")}
        </span>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "소요시간",
    cell: ({ row }) => {
      const value = row.original.durationDt;
      return <span className="">{value}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "처리상태",
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
