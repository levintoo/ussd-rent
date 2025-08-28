"use client";

import * as React from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type TenantRow = {
	id: string;
	name: string;
	phone: string;
	unitNumber?: string | null;
};

interface TenantsTableProps {
	tenants: TenantRow[];
}

const columns: ColumnDef<TenantRow>[] = [
	{ accessorKey: "name", header: () => "Name" },
	{ accessorKey: "phone", header: () => "Phone" },
	{ accessorKey: "unitNumber", header: () => "Unit" },
];

export function TenantsTable({ tenants }: TenantsTableProps) {
	const table = useReactTable({ data: tenants, columns, getCoreRowModel: getCoreRowModel() });

	return (
		<div className="w-full overflow-x-auto">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead key={header.id}>
									{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
							<TableCell colSpan={columns.length} className="h-24 text-center">No tenants found</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
} 