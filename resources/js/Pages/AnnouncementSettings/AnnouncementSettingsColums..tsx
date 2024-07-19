import Editor from "@/Components/Editor"
import { Badge } from "@/Components/ui/badge"
import { Button } from "@/Components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"
import { useAnnouncementModal } from "@/Hooks/useAnnouncementModal"
import { useDeleteAnnouncementModal } from "@/Hooks/useDeleteAnnouncementModal"
import { Announcement } from "@/types"
import { Inertia } from "@inertiajs/inertia"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ChevronsLeftRight, MoreHorizontalIcon, Pencil, Square, SquareCheckBig, Trash2 } from "lucide-react"
import { toast } from "sonner"


/*

id: number;
    user_id: number;
    title:string;
    content:string;
    image?:string;
    status:number;
    user:User;
*/

export const AnnouncementSettingsColums
: ColumnDef<Announcement>[] = [
    {
        accessorKey: "title",
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Title<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=><p className="line-clamp-2 max-w-[7.5rem]">{row.original.title}</p>
    },
    {
        accessorKey: "user.first_name",
        id:'Posted By',
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Posted By<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=>(
            <div className="flex flex-col gap-y-1">
                <p>{`${row.original.user.first_name} ${row.original.user.last_name}`}</p>
                <p>{`${row.original.user.company_id}`}</p>
            </div>
        )
    },
    
    {
        accessorKey: "created_at",
        id:'Date Created',
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Date Created<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=> <p> {format(new Date(row.original.created_at),'PPp')} </p>
    },
    {
        accessorKey: "content",
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Content<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=><div className="max-w-xs"><Editor editable={false} announcement={row.original} onChange={()=>{}} /></div>
    },
    {
        accessorKey: "status_str",
        id:'status_str',
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Status<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=>{
            const {status_str} = row.original;
            return (
                <div className="w-full flex items-center justify-center">
                    <Badge variant={status_str==='active'?'default':'outline'} className="capitalize">{status_str}</Badge>
                </div>
            )
        }

    },
    {
        accessorKey: "image",
        header: ()=><p  className='w-full text-primary text-center px-0' > Image</p>,
        cell: ({row})=> <div className="p-3.5 flex items-center justify-center  min-w-[8.5rem]">{row.original.image?<img className="h-32 w-32 rounded-md object-cover" src={row.original.image} />:<Badge variant='secondary' className="mx-auto">No Image</Badge>}</div>
    },
    {
        header:({column})=><span className="text-primary">Actions</span>,
        id:'Actions',
        cell:({row})=> {
            const {id,status} = row.original;
            const Icon = status===1?SquareCheckBig:Square;
            const {onOpen} = useAnnouncementModal();
            const {onOpen:onDelete} = useDeleteAnnouncementModal();
            const toggleStatus = () =>{
                Inertia.post(route('settings.status',{id}),{},{
                    preserveState:false,
                    onSuccess:()=>toast.success(status===1?'Announcement set as Inactive':'Announcement set as Active'),
                    onError:()=>toast.error('Something went wrong. Please try again')
                });
            }

            return(
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className="h-4 w-8 p-0">
                            <span className="sr-only">Open Menu</span>
                            <MoreHorizontalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">                        
                        <DropdownMenuItem onClick={()=>onOpen(row.original)}>
                            <Pencil className="h-4 w-4 mr-2" />Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={toggleStatus}>
                            <Icon className="h-4 w-4 mr-2" />Set as {status===1?'Inactive':'Active'}
                        </DropdownMenuItem>  
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={()=>onDelete(id)}>
                            <Trash2 className="h-4 w-4 mr-2" />Delete
                        </DropdownMenuItem>                      
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
]
