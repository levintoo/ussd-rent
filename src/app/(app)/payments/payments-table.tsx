"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type PaymentRow = {
  id: string;
  tenantName: string | null;
  amount: number;
  note?: string | null;
  createdAt: string;
};

interface PaymentsTableProps {
  payments: PaymentRow[];
}

const columns: ColumnDef<PaymentRow>[] = [
  { accessorKey: "tenantName", header: () => "Tenant" },
  {
    accessorKey: "amount",
    header: () => "Amount",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      const isBill = value < 0;
      return (
        <span className={isBill ? "text-destructive" : "text-emerald-600"}>
          {isBill ? "-" : "+"}${Math.abs(value).toFixed(2)}
        </span>
      );
    },
  },
  { accessorKey: "note", header: () => "Note" },
  {
    accessorKey: "createdAt",
    header: () => "Date",
    cell: ({ getValue }) => {
      const iso = getValue<string>();
      const d = new Date(iso);
      return d.toLocaleString();
    },
  },
];

export function PaymentsTable({ payments }: PaymentsTableProps) {
  const table = useReactTable({
    data: payments,
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
                No transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
