import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import type { Engagement } from "./type";
import { fetchEngagements } from "@/utils/fetch";
import Table from "@/components/table/Table";


const columnHelper = createColumnHelper<Engagement>();

export const columns = [
  columnHelper.accessor("engagementId", {
    header: "Engagement ID",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("engagementOwner", {
    header: "Owner",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("speaker", {
    header: "Speaker",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("caterer", {
    header: "Caterer",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("cohost", {
    header: "Cohost",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("primaryDateTime", {
    header: "Primary Date & Time",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("secondaryDateTime", {
    header: "Secondary Date & Time",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("tertiaryDateTime", {
    header: "Tertiary Date & Time",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("createdDateTime", {
    header: "Created Date & Time",
    cell: info => info.getValue(),
  }),
];

 const EngagementTable = () =>{

    const {data,isError,isLoading} = useQuery({
        queryKey:["Engagements"],
        queryFn:fetchEngagements
    })

    if(isLoading) return <p>Loading Engagements...</p>

    if(isError) return <p>Error in fetching data</p>
    
    return(
        <div>
            <Table data={data} columns={columns}/>
        </div>
    )
}

export default EngagementTable