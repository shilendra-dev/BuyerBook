"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/organisms/table";
import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
} from "@tanstack/react-table";
import { columns } from "./Columns";
import { Buyer } from "@/types";
import { useEffect, useState } from "react";
import { useBuyerStore } from "@/lib/store/buyerStore";


export const DataTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  
  const { 
    buyers, 
    page, 
    pageSize, 
    totalItems, 
    totalPages,
    setPage,
    setPageSize: setStorePageSize,
  } = useBuyerStore();

  const table = useReactTable({
    data: buyers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: totalPages,
    manualPagination: true,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' 
        ? updater({ pageIndex: page - 1, pageSize })
        : updater;
      
      if (newPagination.pageSize !== pageSize) {
        setStorePageSize(newPagination.pageSize);
      }
      if (newPagination.pageIndex + 1 !== page) {
        setPage(newPagination.pageIndex + 1);
      }
    },
    state: { 
      sorting,
      pagination: {
        pageIndex: page - 1, // Convert to 0-based index
        pageSize,
      },
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()} // ← enables sorting toggle
                  className="px-4 py-2 text-left text-sm font-semibold text-muted-foreground select-none cursor-pointer"
                >
                  <div className="flex items-center gap-1">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}

                    {/* Sorting icon */}
                    {header.column.getCanSort() && (
                      <>
                        {header.column.getIsSorted() === "asc" && (
                          <ArrowUp className="h-3.5 w-3.5" />
                        )}
                        {header.column.getIsSorted() === "desc" && (
                          <ArrowDown className="h-3.5 w-3.5" />
                        )}
                        {!header.column.getIsSorted() && (
                          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
                        )}
                      </>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="hover:bg-muted/30 transition-all cursor-pointer hover:scale-101 ease-in-out"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="px-4 py-2 text-sm text-foreground/80"
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
                className="py-6 text-center text-sm text-muted-foreground"
              >
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Pagination controls */}
      <div className="flex items-center justify-between border-t px-4 py-2 text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span>
            Page {page} of {totalPages}
          </span>
          <select
            value={pageSize}
            onChange={(e) => {
              const newSize = Number(e.target.value);
              setStorePageSize(newSize);
            }}
            className="border rounded px-1 py-0.5"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
