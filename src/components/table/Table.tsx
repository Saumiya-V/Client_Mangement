import {  useState } from 'react';
import type { TableProps } from './type'
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, type SortingState } from '@tanstack/react-table';

const Table = <T,>({data,columns}:TableProps<T>) => {
   const [sorting, setSorting] = useState<SortingState>([
     {
       id: 'status',
       desc: true,
     },
   ]);

    const table = useReactTable({
        data,
        columns,
           state: {
    sorting,
  },
    onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
      });

  return (
    <div className="h-[65vh] rounded overflow-y-auto border border-gray-200">
  <table className="min-w-full bg-white border-collapse">
    <thead className="bg-gray-100 text-sm">
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className="px-6 py-3 text-left border-b border-gray-200 cursor-pointer select-none sticky top-0 z-10 bg-gray-100 font-medium"
              onClick={header.column.getToggleSortingHandler()}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
              <span className="ml-1 text-xs">
                {{
                  asc: "🔼",
                  desc: "🔽",
                }[header.column.getIsSorted() as string] ?? null}
              </span>
            </th>
          ))}
        </tr>
      ))}
    </thead>

    {data.length > 0 ? (
      <tbody className="text-sm">
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 transition-colors">
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className="px-6 py-4 border-b border-gray-100 whitespace-nowrap"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    ) : (
      <tbody>
        <tr>
          <td
            colSpan={table.getAllColumns().length}
            className="text-center text-gray-500 py-6"
          >
            No results found
          </td>
        </tr>
      </tbody>
    )}
  </table>
</div>

  )
}

export default Table