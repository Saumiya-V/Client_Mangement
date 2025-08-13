import { generateColumnsFromData } from '@/utils/columndef'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Department } from './type'
import Table from '@/components/table/Table'
import { Folder, Search } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import ReusableForm from '@/components/form/Form'
import { getfunctionalAreaConfig } from '@/constants/functionalAreaConfig'
import { useFormContext } from '@/utils/hooks/FormContext'
import { fetchFunctionalAreaData } from '@/utils/fetch'
import type { FormConfig } from '@/components/form/formTypes'
import { useDebounce } from '@/utils/hooks/useDebounce'
import axios from 'axios'


const FunctionalAreaTable = () => {
    const {showForm,setShowForm} = useFormContext()
    const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const queryClient = useQueryClient();

    const {data,isError,isLoading} = useQuery({
        queryKey:["Functional Area"],
        queryFn:fetchFunctionalAreaData
    });

     const filteredData = useMemo(() => {
       return ((data ?? []) as Department[]).filter((item) => {
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

     useEffect(() => {
        getfunctionalAreaConfig().then(setFormConfig);
      }, []);

      const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      axios.delete(`http://localhost:3001/functionalAreas/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["functionalareas"] }),
  });

const handleDelete = useCallback((row: Department) => {
  if (confirm(`Are you sure you want to delete "${row.name}"?`)) {
    deleteMutation.mutate(row.id);
  }
}, [deleteMutation]);

 
const columns = useMemo(
  () => generateColumnsFromData(filteredData, handleDelete),
  [filteredData, handleDelete]
);

    if (!formConfig || isLoading) {
    return <div className="p-4 text-gray-600">Loading Functional Areas...</div>;
  }

  if (isError) {
    return <div className="p-4 text-red-500">Failed to load Functional Area.</div>;
  }

  
  return (
     <div className='flex flex-col gap-10'>
      <div className='bg-white w-[1200px] rounded-md flex p-2 gap-5'>
       <div className='p-4'><Folder/></div>
       <div className='p-2'>
        <h3 className='font-bold text-lg'>Functional Area</h3>
        <p className='text-sm'>Add Functional Area</p>
       </div>
      </div>
     <div className="p-10 bg-white w-[1200px] rounded-md">
       {showForm ? (
          <div className='px-10 '>
            <ReusableForm {...formConfig}/>
          </div>
        ) : (
          <><div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Functional Area – {filteredData?.length ?? 0}
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
                  + Add Functional Area
                </Button>
              </div>
            </div><Table data={filteredData} columns={columns} />
            </>
        )}
    </div>
    </div>
  )
}

export default FunctionalAreaTable