"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { units as unitsSchema } from "@/db/schema/units";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Unit = typeof unitsSchema.$inferSelect;

interface UnitsTableProps {
  units: Unit[];
}

const columns: ColumnDef<Unit>[] = [
  {
    accessorKey: "unitNumber",
    header: () => "Unit #",
  },
  {
    accessorKey: "monthlyRent",
    header: () => "Monthly Rent",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return `Ksh ${value.toFixed(2)}`;
    },
  },
  {
    accessorKey: "id",
    header: () => "ID",
  },
];

export function UnitsTable({ units }: UnitsTableProps) {
  const table = useReactTable({
    data: units,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No units found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
