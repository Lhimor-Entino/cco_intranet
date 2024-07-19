import { Input } from "@/Components/ui/input"
import { Table } from "@tanstack/react-table"
import { DataTableFacetedFilter } from "./Filter"
import { Button } from "@/Components/ui/button"
import { Square, SquareCheckBig, XIcon } from "lucide-react"
import { DataTableViewOptions } from "./TableView"


interface DataTableToolbarProps<TData> {
table: Table<TData>
}

export function DataTableToolbar<TData>({
table,
}: DataTableToolbarProps<TData>) {
const isFiltered = table.getState().columnFilters.length > 0

return (
    <div className="flex items-center justify-between h-auto p-2.5">
        <div className="flex flex-1 items-center space-x-2">
            <Input
                placeholder="Filter Titles..."
                value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn("title")?.setFilterValue(event.target.value)
                }
                className="h-8 w-[150px] lg:w-[250px]"
                />
                {/* {table.getColumn("status_str") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("status_str")}
                        title="Filter Status"
                        options={[
                            { label: "Active", value: "active" },
                            { label: "Inactive", value: "inactive" },
                        ]}
                    />
                )} */}
            {isFiltered && (
            <Button
                variant="ghost"
                onClick={() => table.resetColumnFilters()}
                className="h-8 px-2 lg:px-3"
            >
                Reset
                <XIcon className="ml-2 h-4 w-4" />
            </Button>
            )}
        </div>
        <DataTableViewOptions table={table} />
    </div>
)
}