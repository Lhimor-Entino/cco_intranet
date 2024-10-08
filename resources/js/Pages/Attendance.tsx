import Header from '@/Components/Header';
import Layout from '@/Components/Layout/Layout';
import { User } from '@/types';
import { Head } from '@inertiajs/inertia-react';
import axios from 'axios';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import {ChangeEvent, FC, useEffect, useMemo, useState} from 'react';
import { useQuery, useQueryClient } from 'react-query';
import AttendanceHeader from './AttendanceComponents/AttendanceHeader';
import { Skeleton } from '@/Components/ui/skeleton';
import { AttendanceDataTable } from './AttendanceComponents/AttendanceDataTable';
import { AttendanceColumns } from './AttendanceComponents/AttendanceColumns';
import UpdateAttendanceModal from './AttendanceComponents/UpdateAttendanceModal';
import AttendanceDashboard from './AttendanceComponents/AttendanceDashboard';
import { useLocalStorage } from 'usehooks-ts';
import { useAttendanceDate } from './AttendanceComponents/AttendanceHooks.ts/useAttendanceDate';
import { truncateByDomain } from 'recharts/types/util/ChartUtils';
import { Separator } from '@/Components/ui/separator';
import { StringLiteralType } from 'typescript';
import { createBlockSpecFromStronglyTypedTiptapNode } from '@blocknote/core';
import { timeZonesWithOffsets } from '@/lib/utils';
import { toast } from 'sonner';



const getAttendances = async (search:string) => axios.post(route('api.attendances'),{search}).then((res:{data:User[]}) => res.data);

interface Props {
    dt: string;
}

const Attendance:FC<Props> = ({dt}) => {

    const { isLoading, isError, data, error } = useQuery(['attendances',dt], ()=>getAttendances(dt),{refetchInterval: 120000});
    const [strFilter, setStrFilter] = useState<string>('');
    const [shiftFilter, setShiftFilter] = useState<string|undefined>();
    const [siteFilter, setSiteFilter] = useState<string|undefined>();
    const [attendanceStatus, setAttendanceStatus] = useState<string|undefined|null>();
    const [showDashboard,setShowDashboard] = useLocalStorage('showDashboard',true);
    const onInputChange = (e:ChangeEvent<HTMLInputElement>) => setStrFilter(e.target.value);
    const [projectFilterIds,setProjectFilterIds] = useState<string[]>([]);
    const {setAttendanceDate} = useAttendanceDate();
    const [head,setHead] = useState(0);
    const [isRedirected, setRedirected] = useState(false);
    const timezones:any = timeZonesWithOffsets();
    const [timezoneVal, setTimezone] = useState<number>(() => {
        const storedTimezone = localStorage.getItem('myTimezone');
        return storedTimezone ? parseInt(storedTimezone, 10) : 1;
    });
    const updateParentHead = (head:number) => setHead(head);
    const RedirectShift = (id:string, status?:string|null|undefined) => {
        if(isRedirected){
            setShiftFilter('all');
        }
        setAttendanceStatus(status);
        setShiftFilter(id);
        setShowDashboard(val => !val);
        setRedirected(val => !val);
    }
    
    const ToggleDashboard = () => {
        /*
        Purpose to retained filter if not redirected
         - created isRedirected boolean state as identifier.
         - modified toggle dashboard function for UX design.
         Commented By: JOSH
        */
        if(isRedirected){
            setShiftFilter('all');
        }
        setShowDashboard(val => !val);
        setRedirected(false);
    }
    const assignTimezone = (index:number) => {
        setTimezone(index);
        localStorage.setItem('myTimezone', timezoneVal.toString());
        toast.success('Timezone was change to ' + timezones[index].name);
    }
    // Changing Timezone
    
    /** OLD FILTER Commented By: JOSH**/
    const filteredEmployees = useMemo(() => {
        if (!data) return [];
        
        // Filter by head first if applicable
        let result = head > 0 
            ? data.filter(employee => employee.user_id === head)
            : data;
    
        // Apply other filters if head filter isn't limiting
        if (strFilter !== '') {
            const lowerStrFilter = strFilter.toLowerCase();
            result = result.filter(employee =>
                employee.company_id.toLowerCase().includes(lowerStrFilter) ||
                (employee.first_name + ' ' + employee.last_name).toLowerCase().includes(lowerStrFilter)
            );
        }
    
        if (shiftFilter !== 'all') {
            result = result.filter(employee => {
                if (shiftFilter === '0') return !employee.shift_id;
                if (!shiftFilter) return true;
                return employee.shift_id && employee.shift_id.toString() === shiftFilter;
            });
        }
    
        if (projectFilterIds.length > 0) {
            result = result.filter(({ project_id }) => {
                if (!project_id) return false;
                return projectFilterIds.includes(project_id.toString());
            });
        }
        if(siteFilter !== 'all'){
            result = result.filter(employee => {
                if (!siteFilter) return true;
                return employee.site && employee.site.toUpperCase() === siteFilter;
            });
        }
        if(attendanceStatus !== null && attendanceStatus !== undefined){
           if(attendanceStatus === 'present'){
                result = result.filter(employee => {
                    return employee.attendances[0].time_in !== null
                })
           }
           if(attendanceStatus === 'absent'){
            result = result.filter(employee => {
                return employee.attendances[0].time_in === null
            })
       }
        }
    
        return result;
    }, [data, head, strFilter, shiftFilter, projectFilterIds, siteFilter]);
    /** OLD FILTER**/
    // const filteredEmployees = useMemo(()=>data?.filter((employee) => {
    //     if(head > 0) return employee.user_id === head;
    //     if(strFilter === '') return true;
    //     return employee.company_id.toLowerCase().includes(strFilter.toLocaleLowerCase()) || employee.last_name.toLowerCase().includes(strFilter.toLowerCase());        
    // }).filter(employee=>{
    //     if(shiftFilter === 'all') return true;
    //     if((shiftFilter && employee.shift_id) && employee.shift_id.toString() === shiftFilter) return true;
    //     if(shiftFilter === '0') return !employee.shift_id;
    //     if(!shiftFilter) return true;
    // }).filter(({project_id})=>{
    //     if(projectFilterIds.length === 0 ) return true;
    //     if(projectFilterIds.length>0){
    //         if(!project_id) return false;
    //         return projectFilterIds.includes(project_id.toString());
    //     }
    // }),[data,strFilter,shiftFilter,projectFilterIds]);

    const onProjectFilter = (project_id:string) => {
        if(projectFilterIds.includes(project_id)) return setProjectFilterIds(val=>val.filter(id=>id!==project_id));
        setProjectFilterIds(val=>([...val,project_id]))
    };

    const index = parseInt(localStorage.getItem('myTimezone')?? "1",10);
    const timeZone = 'Asia/Manila'; // timeZonesWithOffsets()[index].name;
    const zonedDate = formatInTimeZone(new Date(dt), timeZone, 'PP')
    useEffect(() => setShowDashboard(true),[]);
    useEffect(()=>setAttendanceDate(dt),[dt]);
    useEffect(() => {
        localStorage.setItem('myTimezone', timezoneVal.toString());
    },[timezoneVal]);
    // const date = new Date();
    // const options = { timeZone: "Asia/Manila", hour12: false };
    // const dateInManilaStr = date.toLocaleString("en-US", options);
    // const dateInManila = new Date(dateInManilaStr);

    // console.log(`Date in Manila: ${format(dateInManila,'PP')}, Date on your PC: ${format(date,'PP')}, Selected Date: ${zonedDate}`);
    // console.log(`Today is selected date:${format(dateInManila,'PP')===zonedDate?'Yes':'No'}` );
    return (
        <>
            <Head title="Attendance" />
            <Layout title={`Daily Attendance - ${zonedDate}`}>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container py-2.5'>
                    
                    {
                        (isLoading || !data) && (
                            <div className='flex-1 flex flex-col gap-y-3.5'>
                                <div className='flex items-center gap-x-2'>
                                    <Skeleton className='h-9 rounded-lg w-96' />
                                    <Skeleton className='h-9 rounded-lg w-64 ml-auto' />
                                </div>
                                <div className='flex-1 py-3.5'>
                                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <Skeleton className='h-12 w-64 rounded-lg ' />
                                        <Skeleton className='h-12 w-64 rounded-lg  ' />
                                        <Skeleton className='h-12 w-64 rounded-lg ' />
                                        <Skeleton className='h-12 w-64 rounded-lg  ' />
                                    </div>
                                    <br /><br />
                                    <Skeleton className='h-12 rounded-lg w-full mb-3.5' />
                                    <Skeleton className='h-12 rounded-lg w-full mb-1' />
                                    <Skeleton className='h-12 rounded-lg w-full mb-1' />
                                    <Skeleton className='h-12 rounded-lg w-full mb-1' />
                                    <Skeleton className='h-12 rounded-lg w-full mb-1' />
                                </div>
                                <Skeleton className='h-9 rounded-lg w-96' />
                            </div>
                        )
                    }
                    {!isLoading&&<AttendanceHeader 
                    date_selected={dt}
                    resetProjectFilter={()=>setProjectFilterIds([])} 
                    onProjectFilter={onProjectFilter} 
                    projectFilterIds={projectFilterIds} 
                    showDashboard={showDashboard} 
                    showDashboardToggle={ToggleDashboard} 
                    onInputChange={onInputChange} 
                    onShiftChange={e=>setShiftFilter(e)} 
                    onSiteChange={e=>setSiteFilter(e)} 
                    onTimezoneChange={(index:number) => assignTimezone(index)}
                    strFilter={strFilter} 
                    shift={shiftFilter} 
                    site={siteFilter} 
                    employees={data} 
                    setHead={updateParentHead} 
                    head={head} 
                    timezone={timezoneVal}/>}
                    {
                        !isLoading  && filteredEmployees && !showDashboard && (
                            <div className='flex-1 overflow-y-hidden'>
                                <AttendanceDataTable timezone={timezoneVal}  columns={AttendanceColumns({timeZone: timezoneVal})} data={filteredEmployees} />
                            </div>
                        )
                    }
                    {!isLoading  && data && showDashboard &&(
                        <div className='flex-1 overflow-y-hidden'>
                            <AttendanceDashboard timezone={timezoneVal}loading={isLoading} dt={dt} users={filteredEmployees||[]} redirectShift={(id:string, status:string|null|undefined) => {RedirectShift(id,status)}} />
                        </div>                    
                    )}
                </div>
            </Layout>
            <UpdateAttendanceModal />
        </>
    );
};

export default Attendance;

