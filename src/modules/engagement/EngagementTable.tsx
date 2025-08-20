import { useQuery } from "@tanstack/react-query";
import { fetchEngagements } from "@/utils/fetch";
import Table from "@/components/table/Table";
import { columns } from "./columnDef";
import { AlertCircleIcon, CalendarCheck, Search } from "lucide-react";
import EngagementForm from "./EngagementForm";
import { useEffect, useMemo, useState } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useError } from "@/utils/hooks/ErrorContext";


 const EngagementTable = () =>{

    const {data,isError,isLoading} = useQuery({
        queryKey:["Engagements"],
        queryFn:fetchEngagements
    })

    const [searchTerm,setSearchTerm] = useState("");
    const [debouncedSearch,setdebouncedSearch] = useState("")


    useEffect(()=>{
      const handler = setTimeout(()=>{
        setdebouncedSearch(searchTerm.trim().toLowerCase());
      },300);
      
      return ()=>clearTimeout(handler)
    },[searchTerm]);

    const filteredData = useMemo(()=>{
      if(!data) return []

      if(!debouncedSearch) return data;
      return data.filter((item:any)=>
      Object.values(item).join("").toLowerCase().includes(debouncedSearch))
    },[data,debouncedSearch])

    if(isLoading) return <p>Loading Engagements...</p>

    if(isError) return <p>Error in fetching data</p>
    
    return(
       <div className="flex flex-col gap-10">
      <div className="bg-white w-[1200px] rounded-md flex p-2 gap-5">
        <div className="p-4">
         <CalendarCheck/>
        </div>
        <div className="p-2">
          <h3 className="font-bold text-lg">Engagements</h3>
          <p className="text-sm">Initiate a new engagement</p>
        </div>
      </div>

      <div className="p-6 bg-white w-[1200px] rounded-md">
        { 
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">All Engagements – {filteredData?.length ?? 0}</h2>

              <div className="flex gap-2 items-center">
                <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5 w-60 bg-white">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 outline-none text-sm placeholder-gray-400"
                  />
                </div>
                <EngagementForm/>
              </div>
            </div>

            <Table data={filteredData} columns={columns} />
          </>
 }
      </div>
    </div>
    )
}

export default EngagementTable