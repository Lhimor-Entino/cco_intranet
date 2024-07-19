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

const getAttendances = async (search:string) => axios.post(route('api.attendances'),{search}).then((res:{data:User[]}) => res.data);

interface Props {
    dt: string;
}

const Attendance:FC<Props> = ({dt}) => {
    const { isLoading, isError, data, error } =useQuery(['attendances',dt], ()=>getAttendances(dt),{refetchInterval: 120000});
    const [strFilter, setStrFilter] = useState<string>('');
    const [shiftFilter, setShiftFilter] = useState<string|undefined>();
    const [showDashboard,setShowDashboard] = useLocalStorage('showDashboard',true);
    const onInputChange = (e:ChangeEvent<HTMLInputElement>) => setStrFilter(e.target.value);
    const [projectFilterIds,setProjectFilterIds] = useState<string[]>([]);
    const {setAttendanceDate} = useAttendanceDate();
    const filteredEmployees = useMemo(()=>data?.filter((employee) => {
        if(strFilter === '') return true;
        return employee.company_id.toLowerCase().includes(strFilter.toLocaleLowerCase()) || employee.last_name.toLowerCase().includes(strFilter.toLowerCase());        
    }).filter(employee=>{
        if(shiftFilter === 'all') return true;
        if((shiftFilter && employee.shift_id) && employee.shift_id.toString() === shiftFilter) return true;
        if(shiftFilter === '0') return !employee.shift_id;
        if(!shiftFilter) return true;
    }).filter(({project_id})=>{
        if(projectFilterIds.length === 0 ) return true;
        if(projectFilterIds.length>0){
            if(!project_id) return false;
            return projectFilterIds.includes(project_id.toString());
        }
    }),[data,strFilter,shiftFilter,projectFilterIds]);

    const onProjectFilter = (project_id:string) => {
        if(projectFilterIds.includes(project_id)) return setProjectFilterIds(val=>val.filter(id=>id!==project_id));
        setProjectFilterIds(val=>([...val,project_id]))
    };

    const timeZone = 'Asia/Manila';
    const zonedDate = formatInTimeZone(new Date(dt), timeZone, 'PP')
    useEffect(() => setShowDashboard(true),[]);
    useEffect(()=>setAttendanceDate(dt),[dt]);

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
                                    <Skeleton className='h-9 rounded-lg w-32 ml-auto' />
                                </div>
                                <div className='flex-1 py-3.5'>
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
                    {!isLoading&&<AttendanceHeader resetProjectFilter={()=>setProjectFilterIds([])} onProjectFilter={onProjectFilter} projectFilterIds={projectFilterIds} showDashboard={showDashboard} showDashboardToggle={()=>setShowDashboard(val=>!val)} onInputChange={onInputChange} onShiftChange={e=>setShiftFilter(e)} strFilter={strFilter} shift={shiftFilter} />}
                    {
                        !isLoading  && filteredEmployees && !showDashboard && (
                            <div className='flex-1 overflow-y-hidden'>
                                <AttendanceDataTable columns={AttendanceColumns} data={filteredEmployees} />
                            </div>
                        )
                    }
                    {!isLoading  && data && showDashboard &&(
                        <div className='flex-1 overflow-y-hidden'>
                            <AttendanceDashboard loading={isLoading} dt={dt} users={filteredEmployees||[]} />
                        </div>                    
                    )}
                </div>
            </Layout>
            <UpdateAttendanceModal />
        </>
    );
};

export default Attendance;

