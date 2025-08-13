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
    
          <div className="h-[65vh] rounded overflow-y-auto">
            <table className="min-w-full bg-white ">
              <thead className="bg-gray-100 text-sm">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                     key={header.id}
                     className="px-4 py-2 text-left border-b cursor-pointer select-none sticky top-0 z-10 bg-gray-100 p-2 text-left"
                     onClick={header.column.getToggleSortingHandler()}
          >
      {flexRender(header.column.columnDef.header, header.getContext())}
      <span className="ml-1 text-xs">
      {{
        asc: '🔼',
        desc: '🔽',
      }[header.column.getIsSorted() as string] ?? null}
    </span>
    </th>
                    ))}
                  </tr>
                ))}
              </thead>
              {data.length > 0 ? (<tbody className="text-sm">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 border-b">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>):(<div className="text-center text-gray-500 relative top-30 ">No results found</div>)
             }         
            </table>
          </div>
  )
}

export default Table