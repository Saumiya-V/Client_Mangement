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
import { useMemo, useState } from 'react';
import { Building, Search } from 'lucide-react';
import { ClientForm } from './ClientForm';
import { useDebounce } from '@/utils/hooks/useDebounce';


const ClientTable = () => {
  const { data, isError, isLoading } = useClientData();
  const [sorting, setSorting] = useState<SortingState>([
  {
    id: 'status',
    desc: true,
  },
]);
const [search, setSearch] = useState("");
const debouncedSearch = useDebounce(search, 300);

const columnHelper = createColumnHelper<Client>();

const columns = useMemo(()=>[
  columnHelper.accessor('name', {
    header: 'Client Name',
    enableSorting: true,
    cell: (info) => (
      <div>
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    enableSorting: true,
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor(row => {
  const now = new Date();
  return new Date(row.startDate) <= now && new Date(row.endDate) >= now
    ? 'Active'
    : 'Inactive';
}, {
  id: 'status',
  header: 'Status',
  enableSorting: true,
  sortingFn: 'alphanumeric', 
  cell: info => {
    const value = info.getValue() as string;
    return (
      <span
        className={`${value === 'Active'
          ? 'text-green-700 bg-green-100'
          : 'text-gray-700 bg-gray-200'
        } px-2 py-1 text-xs rounded-full`}
      >
        {value}
      </span>
    );
  }
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
    cell: (info) => {
      const date = new Date(info.getValue());
      return <div>{date.toLocaleDateString()}</div>;
    },
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
    cell: (info) => {
      const date = new Date(info.getValue());
      return <div>{date.toLocaleDateString()}</div>;
    },
  }),
  columnHelper.accessor('address', {
    header: 'Address',
    enableSorting: true,
    cell: (info) => (
      <div className="text-primary ">
        {info.getValue()}
      </div>
    ),
  }),
],[])

const filteredData = useMemo(() => {
  return ((data ?? []) as Client[]).filter((item) => {
    return Object.entries(item).some(([key, value]) => {
      const searchValue = debouncedSearch.toLowerCase();
      const fieldValue = String(value).toLowerCase();

      if (key === 'status') {
        return fieldValue === searchValue;
      }

      return fieldValue.includes(searchValue);
    });
  });
}, [data, debouncedSearch]);


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
       <div className='p-2'>
        <h3 className='font-bold text-lg'>Clients</h3>
        <p className='text-sm'>Add your client</p>
       </div>
      </div>
      <div className="p-6 bg-white w-[1200px] rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          All Clients – {filteredData?.length ?? 0}
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

      <div className="h-[65vh] rounded overflow-y-auto">
        <table className="min-w-full bg-white ">
          <thead className="bg-gray-100 text-sm ">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                   key={header.id}
                    className="px-4 py-2 text-left border-b cursor-pointer select-none sticky top-0 z-10 bg-gray-100 p-2 text-left"
                    onClick={header.column.getToggleSortingHandler()}>
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
         {
          filteredData.length > 0 ? (
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
          ): <div className="text-center text-gray-500 relative top-30 left-100">No results found</div>
         }
        </table>
      </div>
    </div>
    </div>
    
  );
};

export default ClientTable;
