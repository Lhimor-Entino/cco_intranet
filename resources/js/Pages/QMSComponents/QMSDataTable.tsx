import { DataTablePagination } from "@/Components/DataTablePagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { useState } from "react";

interface DataTableProps<TData, TValue>{
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}
export function QMSDataTable<TData,TValue>({columns,data}:
    DataTableProps<TData, TValue>){
    const [sorting,setSorting] = useState<SortingState>([]);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange:setSorting,
        state:{
            sorting,
        }
    });
    return (
        <div className="rounded-md border  h-full flex flex-col gap-y-2.5 pb-2.5">
            <div className="flex-1 overflow-y-auto flex">
                <Table className="h-auto">
                    <TableHeader className="sticky top-0 bg-background z-50">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        { header.isPlaceholder? null : 
                                            flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )
                                        }
                                    </TableHead>
                                )})
                            }
                        </TableRow>
                    ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    >
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
                                        No results.
                                    </TableCell>
                                </TableRow>
                                )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    )
}