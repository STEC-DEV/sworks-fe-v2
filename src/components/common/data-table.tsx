"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { PackageOpenIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyMessage?: string;
  baseUrl?: string;
  idName: string;
  //   onClick?: (data: TData) => void;
}

const DataTable = <TData, TValue>({
  columns,
  data,
  emptyMessage,
  baseUrl,
  idName,
}: //   onClick,
DataTableProps<TData, TValue>) => {
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const router = useRouter();

  return (
    // overflow-hidden
    <div className="rounded-[4px]  bg-white ">
      <Table className="border">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    className="text-xs bg-[var(--background)]"
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="hover:cursor-pointer hover:bg-blue-50   hover:z-51 "
                onClick={() => {
                  router.push(`${baseUrl}/${(row.original as any)[idName]}`);
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    className="text-xs"
                    key={cell.id}
                    // onClick={onClick ? () => onClick(row.original) : undefined}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className=" h-100 text-center text-[var(--description-light)]"
              >
                <div className="flex flex-col items-center gap-6">
                  <PackageOpenIcon
                    className="text-[var(--icon)]"
                    strokeWidth={1}
                    size={54}
                  />
                  {emptyMessage ?? "내용 없음"}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
