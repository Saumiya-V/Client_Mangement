import { Button } from "@/components/ui/button";
import type { Permission } from "./type";
import Table from "@/components/table/Table";
import ReusableForm from "@/components/form/Form";
import { Search, ShieldCheckIcon } from "lucide-react";
import { generateColumnsFromData } from "@/utils/columndef";
import { getPermissionFormConfig } from "@/constants/permissonConfig";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormContext } from "@/utils/hooks/FormContext";
import type { FormConfig } from "@/components/form/formTypes";
import { fetchPermissionData } from "@/utils/fetch";
import { useDebounce } from "@/utils/hooks/useDebounce";
import axios from "axios";

const PermissionTable = () => {
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const { showForm, setShowForm } = useFormContext();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const queryClient = useQueryClient();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["Permission"],
    queryFn: fetchPermissionData,
  });

  const filteredData = useMemo(() => {
    return ((data ?? []) as Permission[]).filter((item) => {
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
    getPermissionFormConfig().then(setFormConfig);
  }, []);


  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      axios.delete(`http://localhost:3001/permissions/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["permission"] }),
  });

const handleDelete = useCallback((row: Permission) => {
  if (confirm(`Are you sure you want to delete "${row.name}"?`)) {
    deleteMutation.mutate(row.id);
  }
}, [deleteMutation]);

 
const columns = useMemo(
  () => generateColumnsFromData(filteredData, handleDelete),
  [filteredData, handleDelete]
);


  if (!formConfig || isLoading) {
    return <div className="p-4 text-gray-600">Loading Permissions...</div>;
  }

  if (isError) {
    return <div className="p-4 text-red-500">Failed to load Permissions.</div>;
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="bg-white w-[1200px] rounded-md flex p-2 gap-5">
        <div className="p-4">
          <ShieldCheckIcon/>
        </div>
        <div className="p-2">
          <h3 className="font-bold text-lg">Permissions </h3>
          <p className="text-sm">Create permission for individuals</p>
        </div>
      </div>

      <div className="p-6 bg-white w-[1200px] rounded-md">
        {showForm ? (
          <div className="px-10">
            <ReusableForm {...formConfig} />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Permissions – {filteredData?.length ?? 0}</h2>

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
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-sm text-sm"
                >
                  + Add Permission
                </Button>
              </div>
            </div>

            <Table data={filteredData} columns={columns} />
          </>
        )}
      </div>
    </div>
  );
};


export default PermissionTable