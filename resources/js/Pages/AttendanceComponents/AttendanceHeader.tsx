import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import { Command, CommandGroup } from "@/Components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { useAttendanceReportModal } from "@/Hooks/useAttendanceReportModal";
import { cn, timeZonesWithOffsets } from "@/lib/utils";
import { PageProps, Shift, User } from "@/types";
import { Inertia, Page } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import { Close } from "@radix-ui/react-dialog";
import { Separator } from "@radix-ui/react-select";
import { addDays, addYears, format } from "date-fns";
import {  CalendarClockIcon, CalendarIcon, Check, CheckCheck, ChevronsUpDownIcon, Clock, FileSpreadsheet, Filter, GanttChart, Globe, LayoutDashboard, RefreshCw, SearchIcon, SlidersHorizontal, SquareArrowRightIcon, UserIcon, X, XIcon } from "lucide-react";
import { ChangeEvent, FC, ReactNode, useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "sonner";

interface Props {    
    shift?:string;
    site?:string;
    onShiftChange:(shift_id:string)=>void;
    onSiteChange:(site:string)=>void;
    onTimezoneChange:(index:number)=>void;
    onInputChange:(e:ChangeEvent<HTMLInputElement>)=>void;
    strFilter:string;
    showDashboard:boolean;
    showDashboardToggle:()=>void;
    onProjectFilter:(project_id:string)=>void;
    projectFilterIds:string[];
    resetProjectFilter:()=>void;
    employees: User[] | undefined;
    setHead: (new_head: number) => void;
    head: number;
    timezone:number;
    date_selected: string;
}

const AttendanceHeader:FC<Props> = ({date_selected,timezone, site,shift,onTimezoneChange,onSiteChange,onShiftChange,onInputChange,strFilter,showDashboard,showDashboardToggle,onProjectFilter,projectFilterIds,resetProjectFilter,employees,setHead,head}) => {
    
    const [showDateModal,setShowDateModal] = useState(false);
    const {user} = usePage<Page<PageProps>>().props.auth;
    const {onOpen} = useAttendanceReportModal();
    const timezones:any = timeZonesWithOffsets();
   
    return (
        <>
            <div className="flex items-center justify-between gap-x-2 h-auto">
                <div className="flex items-center gap-x-2">
                    <FilterModal 
                        showDashboard={showDashboard}
                        showDashboardToggle={showDashboardToggle}
                        date={new Date(date_selected)}
                        search = {strFilter}
                        searchEvent = {onInputChange} 
                        shift ={shift}
                        site={site}
                        shiftEvent = {onShiftChange}
                        employees = {employees}
                        head = {head}
                        setHead = {setHead}
                        onProjectFilter={onProjectFilter}
                        projectFilterIds={projectFilterIds}
                        resetProjectFilter={resetProjectFilter}
                        siteEvent={onSiteChange}
                        />
                    <div className="text-lg font-semibold tracking-wide">
                            CCO Daily Attendance {showDashboard? 'Dashboard' : 'Table'}
                    </div>
                </div>
                
                <Button className=" rounded ml-auto" size='sm' variant="outline" onClick={showDashboardToggle}>
                {showDashboard?<GanttChart className="h-4 w-4 mr-2" />:<LayoutDashboard className="h-4 w-4 mr-2" />} 
                            {showDashboard?'Show Attendance Table':'Show Dashboard'}
                </Button>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size='sm' variant='outline'>
                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                            Show Menu
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="border" align="end">
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>                     
                            <DropdownMenuItem onClick={()=>setShowDateModal(true)}>
                                <UserIcon className="h-4 w-4 mr-2" />Change Date
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={()=>onOpen(user.position)}>
                                <FileSpreadsheet className="h-4 w-4 mr-2" />Generate Report
                            </DropdownMenuItem>
                        </DropdownMenuGroup>   
                    </DropdownMenuContent>
                </DropdownMenu>
                {/* Timezone List */}
                <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size='sm' variant='ghost'>
                                    <Globe className="h-4 w-4 mr-2" />
                                    {timezones[timezone]?.name}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Time Zone</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <div className='max-h-[23rem] overflow-auto'>
                                    {
                                        (timeZonesWithOffsets() || []).map((timezone,index) => {
                                            return  <DropdownMenuGroup key={timezone.name} onClick={() => {onTimezoneChange(index)}}>  
                                                        <DropdownMenuItem key={timezone.name + timezone.offset}>
                                                            <Clock className="h-4 w-4 mr-2" /> {timezone.name}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuGroup>  
                                        })
                                    } 
                                </div>
                               
                            </DropdownMenuContent>
                    </DropdownMenu>
            </div>
            <DateModal isOpen={showDateModal} onClose={()=>setShowDateModal(false)} />
        </>
    )
}

export default AttendanceHeader;

interface DateModalProps{
    isOpen:boolean;
    onClose:()=>void;
}

const DateModal:FC<DateModalProps> = ({isOpen,onClose}) =>{
    const [loading,setLoading] = useState(false);
    const [date,setDate] = useState<Date>();
    //disable future dates
    const disabledDates=[
        {
            from: addDays( new Date(),2),
            to: addYears(new Date(), 1)
        }
    ];

    const onSubmit = () => {
        if(!date) return toast.info('Please select a date');
        Inertia.get(route('attendance.index',{search:format(date,'yyyy-MM-dd')}),{},{
            preserveState:false,
         onSuccess:onClose,
            onError:()=>toast.error('Something went wrong. Please try again'),
            onStart:()=>setLoading(true),
            onFinish:()=>setLoading(false)
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose} modal>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Attendance Date</DialogTitle>
                    <DialogDescription>
                        Choose the date to view the attendance
                    </DialogDescription>
                </DialogHeader>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PP") : <span>Select a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            disabled={disabledDates}
                            
                        />
                    </PopoverContent>
                </Popover>
                <DialogFooter>
                    <Button disabled={loading}>Close</Button>
                    <Button disabled={loading} onClick={onSubmit}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface Filter{
    search: string;
    searchEvent: (e:ChangeEvent<HTMLInputElement>)=>void;
    shift?:string
    site?:string
    shiftEvent: (shift_id:string)=>void;
    siteEvent: (site:string)=>void;
    employees: User[] | undefined;
    head:number;
    setHead: (new_head: number) => void;
    onProjectFilter:(project_id:string)=>void;
    projectFilterIds:string[];
    resetProjectFilter:()=>void;
    date:Date,
    showDashboardToggle:()=>void;
    showDashboard:boolean;
  
}
const FilterModal:FC<Filter>  = ({showDashboard,showDashboardToggle,date:selectedDate,site,siteEvent,resetProjectFilter,projectFilterIds,onProjectFilter,head,setHead,search, searchEvent, shiftEvent, shift,employees}) => {
    const {shifts,projects} = usePage<Page<PageProps>>().props;
    const [open, setOpen] = useState(false)
    const [filter,setFilter] = useState<string>('');
    const filteredEmployees = (employees || []).filter(employee=>{
        if(filter === '') return true;
        return employee.first_name.toLowerCase().includes(filter.toLowerCase()) || employee.last_name.toLowerCase().includes(filter.toLowerCase());
    });
    const btnRef = useRef<HTMLButtonElement>(null);
    
    const onKeyEvent = (e:React.KeyboardEvent<HTMLInputElement>) => {
        
        if(e.key === 'Enter') {
            if(showDashboard) {showDashboardToggle();}
            if(btnRef.current){
                btnRef.current.click();
            }
        }
    }
    const [loading,setLoading] = useState(false);
    const selectedHead = (employees || []).filter(employee => employee.id === head)[0];
    const [date,setDate] = useState<Date>();
    //disable future dates
    const disabledDates=[
        {
            from: addDays( new Date(),2),
            to: addYears(new Date(), 1)
        }
    ];
    const onSubmit = () => {
        if(!date) return toast.info('Please select a date');
        Inertia.get(route('attendance.index',{search:format(date,'yyyy-MM-dd')}),{},{
            preserveState:false,
        //  onSuccess:
        //     onError:()=>toast.error('Something went wrong. Please try again'),
        //     onStart:()=>setLoading(true),
        //     onFinish:()=>setLoading(false)
        });
    }
    
    return (
        <Dialog >
            <DialogTrigger asChild>
                <Button  variant={"outline"} size={"sm"} >
                    <Filter className="h-4 w-4 mr-2"/>
                    Filter
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='flex items-center w-full'>
                        <Filter className="mr-2"/>
                        Filter Options
                    </DialogTitle>
                    <DialogDescription>
                        Use the filters to narrow down the records.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid w-full items-center gap-1.5">
                    <Label>Retrieve Attendance by Date</Label>
                    <div className='flex w-full items-center'>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                size={"sm"}
                                variant={"outline"}
                                className={cn(
                                    "!w-full  justify-start text-left font-normal rounded-r-none",
                                    !date && "text-muted-foreground"
                                    )}
                                // className={cn(
                                //     "w-full justify-start text-left font-normal",
                                //     !date && "text-muted-foreground"
                                // )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PP") : selectedDate ? format(selectedDate,"PP") : 'Select Date'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    disabled={disabledDates}
                                    
                                />
                            </PopoverContent>
                        </Popover>
                        <Button size='sm' disabled={loading} onClick={onSubmit} variant='secondary' className='rounded-l-none'>
                            Go
                            <SquareArrowRightIcon className='h-5 w-5 ml-2' />
                        </Button>
                    </div>
                </div>
                
                <Separator className="border"/>
                <div className="grid w-full items-center gap-1.5">
                    <Label>Project</Label>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size='sm' variant="outline">Filter By Project</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 max-h-[23rem] overflow-auto">
                            <DropdownMenuLabel>Filter By Project</DropdownMenuLabel>
                            {projectFilterIds.length>0&&(<DropdownMenuItem onClick={resetProjectFilter}>
                                <XIcon className="h-4 w-4 mr-2" />
                                Remove Project Filters
                            </DropdownMenuItem>)}
                            <DropdownMenuSeparator />
                            {projects.map(project=>(
                                <DropdownMenuCheckboxItem key={project.id} checked={projectFilterIds.includes(project.id.toString())} onCheckedChange={()=>onProjectFilter(project.id.toString())} >
                                    {project.name}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label>Agent</Label>
                    <div className='flex items-center w-full'>
                        <div className="w-full relative">                              
                            <Input onKeyDown={(e) => onKeyEvent(e)} value={search} onChange={searchEvent} placeholder=" Filter by Company ID/Last Name"  className=" w-full" />
                        </div>
                        <SearchIcon className="absolute right-3 mr-5 " />
                    </div>
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label>Shift</Label>
                    <Select onValueChange={e=>shiftEvent(e)} value={shift}>
                        <SelectTrigger className="w-full">
                            <SelectValue  placeholder="Select a Shift" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[15rem] overflow-auto">
                            <SelectGroup>
                                <SelectLabel >Shift Schedule</SelectLabel>
                                <SelectItem value="0">No Schedule</SelectItem>
                                <SelectItem value={"all"}>All Schedule</SelectItem>
                                {
                                    shifts.map((shift) =><SelectItem key={shift.id} value={shift.id.toString()}>{shift.schedule}</SelectItem>)
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label>Supervisor / Head</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-50 justify-between"
                            disabled={false}
                            >
                            {head
                                ? `${selectedHead.first_name} ${selectedHead.last_name}`
                                : "Filter Supervisor/Head..."}
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent  >
                            <div className="sticky top-0 z-10 w-full">
                                <Input  value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search Supervisor/Head..." />
                            </div>
                            <Separator />
                            <div className="max-h-[15rem] overflow-auto">
                                <Command >
                                    <CommandGroup>
                                        {head > 0 && (<Button 
                                            onClick={() => setHead(0)}
                                            className='w-full fkex items-center justify-start'
                                            variant='ghost'
                                            size='sm'> 
                                            <XIcon className="h-4 w-4 mr-2" />
                                            Clear Filter
                                        </Button>)}

                                        {(filteredEmployees || []).map((employee) => (
                                            <Button
                                                key={employee.id}
                                                onClick={() => {
                                                    setHead(employee.id);
                                                    setOpen(false);
                                                }}
                                                className='w-full fkex items-center justify-start'
                                                variant='ghost'
                                                size='sm'>
                                                <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    (head === employee.id) ? "opacity-100" : "opacity-0"
                                                )}
                                                />
                                                {`${employee.first_name} ${employee.last_name}`}
                                            
                                            </Button>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label>Site</Label>
                    <Select onValueChange={e=>siteEvent(e)} value={site}>
                        <SelectTrigger className="w-full">
                            <SelectValue  placeholder="Select Site" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[15rem] overflow-auto">
                            <SelectGroup>
                                <SelectLabel>
                                    Available Site
                                </SelectLabel>
                                <hr />
                                <SelectItem value="MANILA">Manila</SelectItem>
                                <SelectItem value="LEYTE">Leyte</SelectItem>
                                <SelectItem value={"all"}>All Sites</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Close>
                        <Button ref={btnRef} variant={"default"} size={"sm"} >
                            <Check className="mr-2"/>
                            Done
                        </Button>
                    </Close>
                    <Button variant={"outline"} size={"sm"} 
                    onClick={() => {
                        resetProjectFilter();
                        setHead(0);
                        setFilter('');
                        shiftEvent('all');
                        siteEvent('all');
                        searchEvent({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
                        toast.info('Filter Entries Cleared')
                    }}>
                    <X className="mr-2"/>
                        Clear All Filters
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}