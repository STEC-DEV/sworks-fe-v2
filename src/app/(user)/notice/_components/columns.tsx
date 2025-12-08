import { NoticeListItem } from "@/types/normal/notice/notice";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { PinIcon } from "lucide-react";

export const noticeCol: ColumnDef<NoticeListItem>[] = [
  {
    accessorKey: "serviceTypes",
    header: "유형",
    size: 60,
    meta: {
      getRowStyle: (row: NoticeListItem) =>
        row.isPin ? { backgroundColor: "#fef2f2" } : undefined,
    },
    cell: ({ row }) => {
      const value = row.original.serviceTypes.map(
        (item) => item.serviceTypeName
      );
      const isPin = row.original.isPin;
      return (
        <span
          className={`text-xs text-blue-500 ${
            isPin ? "font-bold" : " font-medium "
          }`}
        >
          {value.join(", ")}
        </span>
      );
    },
  },
  {
    accessorKey: "title",
    header: "제목",
    // meta 제거 (첫 번째 컬럼에서 읽어옴)
    cell: ({ row }) => {
      const value = row.original.title;
      const isPin = row.original.isPin;
      return (
        <span
          className={`text-xs text-[var(--description-dark)] ${
            isPin ? "font-bold" : " font-medium "
          }`}
        >
          {value}
        </span>
      );
    },
  },
  {
    accessorKey: "creator",
    header: "작성자",
    size: 30,
    cell: ({ row }) => {
      const value = row.original.creator;
      const isPin = row.original.isPin;
      return (
        <span
          className={`text-xs text-[var(--description-dark)]  ${
            isPin ? "font-bold" : " font-medium "
          }`}
        >
          {value}
        </span>
      );
    },
  },
  {
    accessorKey: "createDt",
    header: "작성일",
    size: 30,
    cell: ({ row }) => {
      const date = row.original.createDt ?? new Date();
      const value = format(date, "yyyy-MM-dd");
      const isPin = row.original.isPin;
      return (
        <span className={`text-xs ${isPin ? "font-bold" : " font-medium "}`}>
          {value}
        </span>
      );
    },
  },
];
