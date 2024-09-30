import Editor from "@/Components/Editor"
import { Badge } from "@/Components/ui/badge"
import { Button } from "@/Components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"
import { useAnnouncementModal } from "@/Hooks/useAnnouncementModal"
import { useDeleteAnnouncementModal } from "@/Hooks/useDeleteAnnouncementModal"
import { useEmployeeModal } from "@/Hooks/useEmployeeModal"
import { useShiftModal } from "@/Hooks/useShiftModal"
import { useUpdateAttendaceModal } from "@/Hooks/useUpdateAttendaceModal"
import { AttendanceStatus, cn } from "@/lib/utils"
import { Announcement, PageProps, User } from "@/types"
import { Inertia, Page } from "@inertiajs/inertia"
import { usePage } from "@inertiajs/inertia-react"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { CalendarClockIcon, ChevronsLeftRight, FolderOpen, MailWarning, MoreHorizontalIcon, Pencil, Square, SquareCheckBig, StarsIcon, TimerReset, Trash2,  TriangleAlert,  UserIcon } from "lucide-react"
import { toast } from "sonner"
import { useAttendanceDate } from "./AttendanceHooks.ts/useAttendanceDate"


export const AttendanceColumns

: ColumnDef<User>[] = [
    {
        accessorKey: "company_id",
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>ID<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=><p className="font-semibold tracking-wide">{row.original.company_id}</p>
    },
    {
        accessorFn: (row)=>row.attendances[0]?.shift_id||"",
        id:'Schedule',
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Schedule<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=>(
            <div className={cn(!row.original?.attendances[0]?.shift_id&&'text-muted-foreground')}>
                {!row.original.attendances[0]?.shift?.schedule?(
                    <div className="flex items-center gap-x-2">
                        <TriangleAlert className="h-4 w-4" />
                        <span>Shift Not Set!</span>
                    </div>
                ):row.original.attendances[0].shift.schedule}
            </div>
        )
    },
    {
        accessorKey: "last_name",
        id:'Employee Name',
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Employee Name<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=><p>{`${row.original.first_name} ${row.original.last_name}`}</p>
    },
    
    {
        accessorFn: (row)=>row.attendances[0]?.time_in||"",
        id:'Time-in',
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Time In<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=>{
            const absent_condition = !row.original.attendances[0].time_in && !row.original.attendances[0].time_out && (row.original.attendances[0]?.status_code == 0);
            if(!row.original.attendances[0]) return <p>No Time-in Record</p>
            if(absent_condition) return <p>No Time-in Record</p>
            if(!row.original.attendances[0].time_in && !row.original.attendances[0].time_out) return <p>{AttendanceStatus(row.original.attendances[0]?.status_code ?? -1)}</p>
            const editedByMsg = `Edited By: ${row.original.attendances[0].edited_time_in_by?.first_name} ${row.original.attendances[0].edited_time_in_by?.last_name}`;
            const editedByDt = (!!row.original.attendances[0].edited_time_in_date)? ` on ${format(new Date(row.original.attendances[0].edited_time_in_date),'Pp')}`:null;
            return (
            <div className="flex flex-col gap-y-0.5">
                <p>{`${row.original?.attendances[0]?.time_in||'No Time-in Record'}`}</p>
                {row.original.attendances[0]?.edited_time_in===1 && (
                    <>
                        <p className="text-xs italic text-muted-foreground">{editedByMsg}</p>
                        {editedByDt && <p className="text-xs italic text-muted-foreground">{editedByDt}</p>}
                    </>
                )}
            </div>
        )}
    },    
    {
        accessorFn: (row)=>row.attendances[0]?.time_out||"",
        id:'Time-Out',
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Time Out<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=>{
            const absent_condition = !row.original.attendances[0].time_in && !row.original.attendances[0].time_out && (row.original.attendances[0]?.status_code == 0);
            if(!row.original.attendances[0]) return <p>No Time-out Record</p>
            if(absent_condition) return <p>No Time-out Record</p>
            if(!row.original.attendances[0].time_in && !row.original.attendances[0].time_out) return <p>{AttendanceStatus(row.original.attendances[0]?.status_code ?? -2)}</p>
            const editedByMsg = `Edited By: ${row.original.attendances[0].edited_time_out_by?.first_name} ${row.original.attendances[0].edited_time_out_by?.last_name}`;
            const editedByDt = (!!row.original.attendances[0].edited_time_out_date)? ` on ${format(new Date(row.original.attendances[0].edited_time_out_date),'Pp')}`:null;
            return (
            <div className="flex flex-col gap-y-0.5">
                <p>{`${row.original?.attendances[0]?.time_out||'No Time-out Record'}`}</p>
                {row.original.attendances[0]?.edited_time_out===1 && (
                    <>
                        <p className="text-xs italic text-muted-foreground">{editedByMsg}</p>
                        {editedByDt && <p className="text-xs italic text-muted-foreground">{editedByDt}</p>}
                    </>
                )}
            </div>
        )
        }
    },    
    {       
        accessorFn: (row)=>row.attendances[0]?.is_tardy||"",
        id:'Tardy',
        header: ({column})=><Button  className='w-full text-primary px-0'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Tardy<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell: ({row})=>{
            const absent_condition = !row.original.attendances[0].time_in && !row.original.attendances[0].time_out && (row.original.attendances[0]?.status_code == 0);
            const tardy_val = row.original?.attendances[0]?.is_tardy;
            if(absent_condition) return <p>No Time/Absent</p>
            if(row.original?.attendances[0]?.is_tardy && tardy_val !== 'No Time In/Absent')
            {
                return  <p>{row.original?.attendances[0]?.is_tardy}</p>
            } else {
                return <p>{AttendanceStatus(row.original.attendances[0]?.status_code ?? -3)}</p>
            }
           
        }
    },
    {
        header:({column})=><div className="text-primary w-full text-center">Actions</div>,
        id:'Actions',
        cell:({row})=> {
            const {user} = usePage<Page<PageProps>>().props.auth;
            const {onOpen} = useEmployeeModal();
            const {onOpen:openShift} = useShiftModal();
            const {onOpen:openUpdateModal} =useUpdateAttendaceModal();
            const handleUpdateModalOpen = () =>openUpdateModal({user_attendance:row.original.attendances[0],user:row.original},user.position);
            
            const {attendanceDate} = useAttendanceDate();
            return(
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                            <span className="sr-only">Open Menu</span>
                            <MoreHorizontalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">    
                        <DropdownMenuLabel>{`${row.original.first_name} ${row.original.last_name}, ${row.original.company_id}`}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={()=>onOpen(row.original)}>
                            <UserIcon className="h-4 w-4 mr-2" />Employee Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={()=>openShift(row.original,attendanceDate||"")}>
                            <CalendarClockIcon className="h-4 w-4 mr-2" />Change Shift
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleUpdateModalOpen}>
                            <TimerReset className="h-4 w-4 mr-2" />Update Time-in/Time-out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }


]
