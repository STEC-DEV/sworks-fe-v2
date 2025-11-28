import { NoticeListItem } from "@/types/normal/notice/notice";
import { ColumnDef } from "@tanstack/react-table";
import { PinIcon } from "lucide-react";

export const noticeCol: ColumnDef<NoticeListItem>[] = [
  {
    accessorKey: "serviceTypes",
    header: "유형",
    size: 60,
    cell: ({ row }) => {
      const value = row.original.serviceTypes.map(
        (item) => item.serviceTypeName
      );

      return (
        <span className="text-xs text-blue-500 font-medium">
          {value.join(", ")}
        </span>
      );
    },
  },
  {
    accessorKey: "title",
    header: "제목",
    cell: ({ row }) => {
      const value = row.original.title;
      return (
        <span className="text-xs text-[var(--description-dark)] font-medium">
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
      return (
        <span className="text-xs text-[var(--description-dark)] font-medium">
          {value}
        </span>
      );
    },
  },
  {
    accessorKey: "isPin",
    header: "고정",
    size: 30,
    cell: ({ row }) => {
      const value = row.original.isPin;
      return (
        value && (
          <PinIcon className="text-primary" size={16} strokeWidth={1.5} />
        )
      );
    },
  },
];
