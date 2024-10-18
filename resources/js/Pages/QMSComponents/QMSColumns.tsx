import { Button } from "@/Components/ui/button";
import { QMS } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronsLeftRight } from "lucide-react";


export const QMSColumns:ColumnDef<QMS>[] = [
    {
        accessorKey: "user.company_id",
        header: ({column}) =>  <Button className="flex justify-start w-full text-primary px-0" variant={'ghost'} onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>ID <ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90"/></Button>,
        cell: ({row}) => <p className="font-semibold tracking-wide">{row.original.user.company_id}</p>
    },
    {
        accessorKey: "user",
        id:'Name',
        header: ({column})=><Button  className='flex justify-start  w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Name<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=><p>{`${row.original.user.first_name} ${row.original.user.last_name}`}</p>
    },
    {
        accessorKey: "tl_user",
        id:'Team Leader',
        header: ({column})=><Button  className='flex justify-start w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Team Leader<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=><p>{`${row.original.team_leader.first_name} ${row.original.team_leader.last_name}`}</p>
    },
    {
        accessorKey: "score",
        id:'Score',
        header: ({column})=><Button  className='flex justify-end w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Score<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=><p className="text-right" >{`${row.original.score}`}</p>
    },
]