"use client";

import React, { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";

import {
  flexRender,
  SortingState,
  useReactTable,
  PaginationState,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  ColumnFiltersState,
  getPaginationRowModel,
} from "@tanstack/react-table";

export type User = {
  id: number;
  name: string;
  age: number;
  address : string;
};

interface DynamicTableProps<T extends Record<string, any>> {
  columns: {
    id: keyof T,
    header: React.ReactNode
  }[];
  data: any
  loading: boolean
  columnFilters?: ColumnFiltersState,
  sorting?: SortingState,
  pagination?: PaginationState,
  onPaginationChange?: Dispatch<SetStateAction<PaginationState>>
  setSorting?: Dispatch<SetStateAction<SortingState>>
  setcolumnFilters?: Dispatch<SetStateAction<ColumnFiltersState>>
}

function DynamicTable<T extends Record<string, any>>({
  data,
  columns,
  sorting,
  pagination,
  columnFilters,
  onPaginationChange,
  setSorting,
  setcolumnFilters,
  loading = false
}: DynamicTableProps<T>
): React.ReactElement<DynamicTableProps<T>> {

  const columnHelper = createColumnHelper<T>();

  const out_columns = columns.map(({id, header})=>{
    // @ts-ignore
    return columnHelper.accessor(id, {
      cell: info => info.getValue(),
      header: () => header
    })
  })


  const table = useReactTable({
    data,
    columns: out_columns,
    pageCount: 10,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: onPaginationChange,
    onSortingChange: setSorting,
    onColumnFiltersChange: setcolumnFilters,
    manualPagination: true,
    enableSorting: true,
    state: {
      sorting,
      pagination,
      columnFilters
    }
  });

  return (
    <>
      <div className="grid">
        <table className="border p-2 rounded-md items-center">
          <thead className="bg-green-200 p-2 rounded-md">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="users-table-cell">
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="items-center text-center p-2">
            {loading ? (
              <div>Loading</div>
            ): 
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2 border">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-row items-center justify-center gap-2 w-full h-full p-2">
        <button
          className="border rounded p-1"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          First Page
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          Last Page
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default DynamicTable;
