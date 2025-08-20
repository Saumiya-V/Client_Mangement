import { createColumnHelper } from "@tanstack/react-table";
import type { Engagement } from "./type";
import { Link } from "@tanstack/react-router";

const columnHelper = createColumnHelper<Engagement>();

export const columns = [
 columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => {
       const id = info.row.original.id; 
      return (
        <Link
          to="/engagements/$id"
          params={{id}}
          className="text-blue-600 hover:underline"
        >
          {id}
        </Link>
      );
    },
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
  cell: (info) => {
  const slot = info.getValue(); 
    

    return (
      <div className="flex gap-1">
        <p>{slot.date} {slot.time}</p>
        <span className="text-sm text-gray-500">{slot.timezone}</span>
      </div>
    );
  },
}),

columnHelper.accessor("secondaryDateTime", {
  header: "Secondary Date & Time",
  cell: (info) => {
    const slot = info.getValue();
    if (!slot || slot === "-") return "-";

    return (
      <div className="flex gap-1">
        <p>{slot.date} {slot.time}</p>
        <span className="text-sm text-gray-500">{slot.timezone}</span>
      </div>
    );
  },
}),

columnHelper.accessor("tertiaryDateTime", {
  header: "Tertiary Date & Time",
  cell: (info) => {
    const slot = info.getValue();
    if (!slot || slot === "-") return "-";

    return (
      <div className="flex gap-1">
        <p>{slot.date} {slot.time}</p>
        <span className="text-sm text-gray-500">{slot.timezone}</span>
      </div>
    );
  },
}),

  columnHelper.accessor("createdDateTime", {
    header: "Created Date & Time",
    cell: info =>{
      const date = info.getValue();
     return  <p className="truncate">{date}</p>
    },
  }),
];
