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
      return value ? "수기입력" : "모바일";
    },
  },
  {
    accessorKey: "name",
    header: "지점",
    cell: ({ row }) => {
      const value = row.original.name;
      return value;
    },
  },
  {
    accessorKey: "serviceTypeName",
    header: "유형",
    cell: ({ row }) => {
      const value = row.original.serviceTypeName;
      return value;
    },
  },
  {
    accessorKey: "createUser",
    header: "민원인",
    cell: ({ row }) => {
      const value = row.original.createUser;
      return value;
    },
  },
  {
    accessorKey: "phone",
    header: "전화번호",
    cell: ({ row }) => {
      const value = row.original.phone;
      return value;
    },
  },
  {
    accessorKey: "title",
    header: "제목",
    cell: ({ row }) => {
      const value = row.original.title;
      return value;
    },
  },
  {
    accessorKey: "createDt",
    header: "발생일시",
    cell: ({ row }) => {
      const value = row.original.createDt;
      return format(value, "yyyy-MM-dd hh:mm:ss");
    },
  },
  {
    accessorKey: "completeDt",
    header: "처리일시",
    cell: ({ row }) => {
      const value = row.original.completeDt;
      return value ? format(value, "yyyy-MM-dd hh:mm:ss") : null;
    },
  },
  {
    accessorKey: "duration",
    header: "소요시간",
    cell: ({ row }) => {
      const value = row.original.durationDt;
      return value;
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
