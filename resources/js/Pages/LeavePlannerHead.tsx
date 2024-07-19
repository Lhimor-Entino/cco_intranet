import Header from "@/Components/Header"
import Layout from "@/Components/Layout/Layout"
import { Head, Link } from "@inertiajs/inertia-react"
import CalendarView from "./LeavePlanner/CalendarView"
import { FC, useEffect, useState } from "react"
import { Label } from "@/Components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/Components/ui/select"
import axios from "axios"
import { toast } from "sonner"
import { Loader, Loader2, View } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { cn } from "@/lib/utils"
import SimplifiedView from "./LeavePlanner/SimplifiedView"

export type PendingRequest = {
    first_name :string;
    last_name :string;
    application_date :string;
    employee_id :string;
    leave_reason :string;
    leave_category :string;
    leave_status :string;
    date_from :string;
    date_to :string;
}

export type SimplifiedPendingRequest = {
    total_days:number;
    first_name :string;
    last_name :string;
    application_date :string;
    employee_id :string;
    leave_reason :string;
    leave_category :string;
    leave_status :string;
    date_from :string;
    date_to :string;
}

const LeavePlannerHead = () => {
    const [fetchingPendingRequests, setFetchingPendingRequests] = useState<boolean>(false);
    const [fetchingSimplifiedPendingRequests, setFetchingSimplifiedPendingRequests] = useState<boolean>(false);
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
    const [simplifiedPendingRequests, setSimplifiedPendingRequests] = useState<SimplifiedPendingRequest[]>([]);
    //array of months
    const months = [
        {value: 1, label: 'January'},
        {value: 2, label: 'February'},
        {value: 3, label: 'March'},
        {value: 4, label: 'April'},
        {value: 5, label: 'May'},
        {value: 6, label: 'June'},
        {value: 7, label: 'July'},
        {value: 8, label: 'August'},
        {value: 9, label: 'September'},
        {value: 10, label: 'October'},
        {value: 11, label: 'November'},
        {value: 12, label: 'December'},
    ];
    //array of years from last year to next year
    const years = Array.from({length: 3}, (_, i) => new Date().getFullYear() - 1 + i);

    useEffect(()=>{
        const fetchPendingRequests = () =>{
            setFetchingPendingRequests(true);
            axios.
                get(route('hrms.get_pending_leave_requests'))
                .then(({data})=>setPendingRequests(data))
                .catch(e=>{
                    console.error(e);
                    toast.error('Failed to fetch pending requests. Please refresh the page.');
                })
                .finally(()=>setFetchingPendingRequests(false));
        }
        const fetchSimpifiedPendingRequests = () =>{
            setFetchingSimplifiedPendingRequests(true);
            axios.
                get(route('hrms.get_pending_leave_requests_simplified'))
                .then(({data})=>setSimplifiedPendingRequests(data))
                .catch(e=>{
                    console.error(e);
                    toast.error('Failed to fetch simplified pending requests. Please refresh the page.');
                })
                .finally(()=>setFetchingSimplifiedPendingRequests(false));
        }
        fetchPendingRequests();
        fetchSimpifiedPendingRequests();
    },[]);

    const SimplifiedViewIcon = fetchingSimplifiedPendingRequests?Loader2:View
    return (
        <>
            <Head title="Leave Planner - Head" />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container pb-2.5 overflow-y-auto'>
                    <div className="relative">
                        <Header logo='leave' title='Leave Planner - Head' />
                        <Link href={route('hrms.leave_planner')}>
                            <Button size='sm' variant='success' className="absolute top-8 right-3">
                                Go Back
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center justify-center relative">
                        <SimplifiedView requests={simplifiedPendingRequests}>
                            <Button  size='sm' className="absolute left-0 bottom-0" variant='outline' disabled={fetchingSimplifiedPendingRequests}>
                                <SimplifiedViewIcon className={cn("h-5 w-5",fetchingSimplifiedPendingRequests&&'animate-spin')} />
                                <span className="hidden md:inline md:ml-2">Simplified View</span>
                            </Button>
                        </SimplifiedView>
                        <div className="flex items-center gap-x-2 ">
                            <div className="space-y-1">
                                <Label>Select Month</Label>
                                <Select value={selectedMonth.toString()} onValueChange={e=>setSelectedMonth(parseInt(e))}>
                                    <SelectTrigger disabled={fetchingPendingRequests} className="w-52 h-9">
                                        <SelectValue placeholder="Select a Month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Months</SelectLabel>
                                            {months.map((month) => <SelectItem key={month.value} value={month.value.toString()}>{month.label}</SelectItem>)}                                            
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label>Select Year</Label>
                                <Select value={selectedYear.toString()} onValueChange={e=>setSelectedYear(parseInt(e))}>
                                    <SelectTrigger disabled={fetchingPendingRequests} className="w-52 h-9">
                                        <SelectValue placeholder="Select a Month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Year</SelectLabel>
                                            {years.map((year) => <SelectItem key={year} value={year.toString()}>{year}</SelectItem>)}                                           
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    {!fetchingPendingRequests&&<CalendarView pendingRequests={pendingRequests} m={selectedMonth} y={selectedYear} />}
                    {fetchingPendingRequests&&(
                        <div className="flex flex-col items-center justify-center h-full w-full animate-pulse">
                            <Loader2 className="h-24 w-24 animate-spin" />
                            <p className="tracking-widest text-lg font-semibold">Loading...</p>
                        </div>
                    )}
                </div>
            </Layout>
        </>
    )
}
export default LeavePlannerHead