"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import EmptyBox from "../ui/custom/empty";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
  padding?: string;
  // 선택 기능 관련 - 옵셔널
  enableRowSelection?: boolean;
  onSelectionChange?: (selectedRows: TData[]) => void;
  getRowId?: (row: TData) => string;
}

const BaseTable = <TData, TValue>({
  columns,
  data,
  padding,
  onRowClick,
  enableRowSelection = false,
  onSelectionChange,
  getRowId,
}: DataTableProps<TData, TValue>) => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // enableRowSelection이 true일 때만 선택 기능 추가
    ...(enableRowSelection && {
      state: {
        rowSelection,
      },
      enableRowSelection: true,
      onRowSelectionChange: setRowSelection,
      getRowId: getRowId,
    }),
  });

  // const table = useReactTable({
  //   data,
  //   columns,

  //   getCoreRowModel: getCoreRowModel(),
  // });

  // 선택된 rows 변경 시 콜백 호출
  useEffect(() => {
    if (enableRowSelection && onSelectionChange) {
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, enableRowSelection, onSelectionChange, table]);

  return (
    <div className=" rounded-md ">
      <Table>
        <TableHeader className="bg-background ">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "font-medium text-[var(--description-dark)] text-xs  py-3",
                      padding,
                    )}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const firstCell = row.getVisibleCells()[0];
              const meta = firstCell?.column.columnDef.meta as any;
              const rowStyle = meta?.getRowStyle?.(row.original);

              // backgroundColor 값이 실제로 있는지 체크
              const hasCustomBg =
                rowStyle?.backgroundColor && rowStyle.backgroundColor !== null;

              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "cursor-pointer",
                    !hasCustomBg && "hover:bg-blue-50", // backgroundColor가 없을 때만 hover
                  )}
                  style={hasCustomBg ? rowStyle : undefined}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={cn("py-3", padding)}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                <EmptyBox />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BaseTable;
{
  /* <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={"hover:bg-blue-50 cursor-pointer"}
                onClick={() => onRowClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={cn(" py-3", padding)}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                <EmptyBox />
              </TableCell>
            </TableRow>
          )}
        </TableBody> */
}
