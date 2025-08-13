import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { AlignClientsCell } from "./AlignClientsCell";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export function generateColumnsFromData<T extends object>(data: T[],handleDelete: (row: T) => void
): ColumnDef<T, any>[] {
  const columnHelper = createColumnHelper<T>();

  const keys = data.length ? (Object.keys(data[0]).slice(1) as (keyof T)[]) : [];

  const dynamicCols: ColumnDef<T, any>[] = keys.map((key) => {
    if (String(key) === "alignClients") {
      return columnHelper.accessor(key as any, {
        header: "Align Clients",
        enableSorting: false,
        cell: ({ getValue }) => (
          <AlignClientsCell clients={getValue() as string[]} />
        ),
      });
    }

   if (String(key) === "roles") {
  return columnHelper.accessor(key as any, {
    header: "Roles",
    enableSorting: false,
    cell: ({ getValue }) => {
      const roles = getValue() as string[];
      if (!roles?.length) return null;

      const firstRole = roles[0];
      const extraCount = roles.length - 1;

      return (
        <div
          className="max-w-[200px] truncate"
          title={roles.join(", ")}
        >                       
          {firstRole}
          {extraCount > 0 && (
          <span className="ml-1 px-2 py-0.25 text-xs font-medium text-white bg-blue-700 rounded-full">
             +{extraCount}
          </span>
          )}
        </div>
      );
    },
  });
}


    if (String(key) === "startDate" || String(key) === "endDate") {
      return columnHelper.accessor(key as any, {
        header: String(key)
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
        enableSorting: true,
        cell: (info) => {
          const dateValue = info.getValue();
          if (!dateValue) return null;

          
          const date = new Date(dateValue);
          const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(
            date.getMonth() + 1
          ).padStart(2, "0")}/${date.getFullYear()}`;
          return formattedDate;
        },
      });
    }


    return columnHelper.accessor(key as any, {
      header: String(key)
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase()),
      enableSorting: true,
      cell: (info) => String(info.getValue()),
    });
  });

  const statusCol: ColumnDef<T, any> = columnHelper.accessor((row) => {
    const now = new Date();
    return new Date((row as any).startDate) <=now &&
      new Date((row as any).endDate) >= now
      ? "Active"
      : "Inactive";
  }, {
    id: "status",
    header: "Status",
    enableSorting: true,
    sortingFn: "alphanumeric",
    cell: (info) => {
      const value = info.getValue() as string;
      return (
        <span
          className={`${value === "Active"
            ? "text-green-700 bg-green-100"
            : "text-gray-700 bg-gray-200"
            } px-2 py-1 text-xs rounded-full`}
        >
          {value}
        </span>
      );
    },
  });

const actionsCol: ColumnDef<T, any> = columnHelper.display({
  id: "actions",
  header: "",
  cell: ({ row }) => {
    const rowData: T = row.original;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="px-2 text-gray-600 hover:text-gray-700">
            ⋮
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-25">
          <DropdownMenuItem
            onClick={() => handleDelete(rowData)}
            className="text-gray-500 cursor-pointer text-xs text-center"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
});

dynamicCols.push(actionsCol);

  const startDateIndex = dynamicCols.findIndex(col => col.id === "startDate" || (col as any).accessorKey === "startDate");
  if (startDateIndex !== -1) {
    dynamicCols.splice(startDateIndex, 0, statusCol);
  } else {
    dynamicCols.push(statusCol); 
  }

  return dynamicCols;

}

