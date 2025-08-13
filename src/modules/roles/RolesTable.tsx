import { generateColumnsFromData } from '@/utils/columndef'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Table from '@/components/table/Table'
import { Search, User } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import ReusableForm from '@/components/form/Form'
import { roleFormConfig } from '@/constants/roleformConfig'
import { useFormContext } from '@/utils/hooks/FormContext'
import { useDebounce } from '@/utils/hooks/useDebounce'
import type { RoleData } from './type'
import { fetchRoleData } from '@/utils/fetch'
import axios from 'axios'

const RoleTable = () => {
    const {showForm,setShowForm} = useFormContext()
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const queryClient = useQueryClient();

    const {data,isError,isLoading} = useQuery({
        queryKey:["Permission"],
        queryFn:fetchRoleData
    });

    const filteredData = useMemo(() => {
      return ((data ?? []) as RoleData[]).filter((item) => {
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

    const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      axios.delete(`http://localhost:3001/roles/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["Roles"] }),
  });

const handleDelete = useCallback((row: RoleData) => {
  if (confirm(`Are you sure you want to delete "${row.name}"?`)) {
    deleteMutation.mutate(row.id);
  }
}, [deleteMutation]);

 
const columns = useMemo(
  () => generateColumnsFromData(filteredData, handleDelete),
  [filteredData, handleDelete]
);


     if (isLoading) {
    return <div className="p-4 text-gray-600">Loading Functional Areas...</div>;
  }

  if (isError) {
    return <div className="p-4 text-red-500">Failed to load Functional Area.</div>;
  }



  return (
     <div className='flex flex-col gap-10'>
      <div className='bg-white w-[1200px] rounded-md flex p-2 gap-5'>
       <div className='p-4'><User/></div>
       <div className='p-2'>
        <h3 className='font-bold text-lg'>Roles</h3>
        <p className='text-sm'>Add Roles</p>
       </div>
      </div>
      <div className="p-10 bg-white w-[1200px] rounded-md">
       {showForm ? (
          <div className='px-10 '>
            <ReusableForm {...roleFormConfig} />
          </div>
        ) : (
          <><div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Roles – {filteredData?.length ?? 0}
              </h2>

              <div className="flex gap-2 items-center">
                <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5 w-60 bg-white">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 outline-none text-sm placeholder-gray-400" />
                </div>
                <Button onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-sm text-sm">
                  + Add Role
                </Button>
              </div>
            </div><Table data={filteredData} columns={columns} /></>
        )}
    </div>
    </div>
  )
}

export default RoleTable