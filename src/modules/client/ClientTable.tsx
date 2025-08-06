import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState
} from '@tanstack/react-table';
import useClientData from '@/utils/hooks/useClientData';
import type { Client } from './clientType';
import { useState } from 'react';
import { Building, Search } from 'lucide-react';
import { ClientForm } from './ClientForm';


const columnHelper = createColumnHelper<Client>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Client Name',
    enableSorting: true,
    cell: (info) => (
      <div className="text-primary font-medium cursor-pointer underline">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    enableSorting: true,
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    enableSorting: true,
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) === 'Active' ? 1 : 0;
      const b = rowB.getValue(columnId) === 'Active' ? 1 : 0;
      return a - b;
    },
    cell: (info) => {
      const status = info.getValue();
      const isActive = status === 'Active';
      return (
        <span
          className={`${
            isActive
              ? 'text-green-700 bg-green-100'
              : 'text-gray-700 bg-gray-200'
          } px-2 py-1 text-xs rounded-full`}
        >
          {status}
        </span>
      );
    },
  }),
  columnHelper.accessor('startDate', {
    header: 'Start Date',
    enableSorting: true,
    sortingFn: (rowA, rowB, columnId) => {
      return (
        new Date(rowA.getValue(columnId)).getTime() -
        new Date(rowB.getValue(columnId)).getTime()
      );
    },
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('endDate', {
    header: 'End Date',
    enableSorting: true,
    sortingFn: (rowA, rowB, columnId) => {
      return (
        new Date(rowA.getValue(columnId)).getTime() -
        new Date(rowB.getValue(columnId)).getTime()
      );
    },
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('address', {
    header: 'Address',
    enableSorting: true,
    cell: (info) => (
      <div className="text-primary font-medium cursor-pointer underline">
        {info.getValue()}
      </div>
    ),
  }),
];

const ClientTable = () => {
  const { data, isError, isLoading } = useClientData();
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState<SortingState>([
  {
    id: 'status',
    desc: true,
  },
]);

  const filteredData = ((data ?? []) as Client[]).filter(client =>
  client.name?.toLowerCase().includes(search.toLowerCase())
);

  const table = useReactTable({
    data: filteredData as Client[],
    columns,
      state: {
    sorting,
  },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return <div className="p-4 text-gray-600">Loading clients...</div>;
  }

  if (isError) {
    return <div className="p-4 text-red-500">Failed to load clients.</div>;
  }

  return (
    <div className='flex flex-col gap-10'>
      <div className='bg-white w-[1200px] rounded-md flex p-2 gap-5'>
       <div className='p-4'><Building/></div>
       <div>
        <h3 className='font-bold text-lg'>Clients</h3>
        <p>Add your client</p>
       </div>
      </div>
      <div className="p-6 bg-white w-[1200px] rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          All Clients – {data?.length ?? 0}
        </h2>

        <div className="flex gap-2 items-center">
         <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5 w-60 bg-white">
  <Search className="w-4 h-4 text-gray-500" />
  <input
    type="text"
    placeholder="Search"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="flex-1 outline-none text-sm placeholder-gray-400"
  />
</div>
         <ClientForm/>
        </div>
      </div>

      <div className="overflow-x-auto rounded overflow-y-auto">
        <table className="min-w-full bg-white ">
          <thead className="bg-gray-100 text-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
  key={header.id}
  className="px-4 py-2 text-left border-b cursor-pointer select-none"
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
          <tbody className="text-sm">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 border-b">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    
  );
};

export default ClientTable;
