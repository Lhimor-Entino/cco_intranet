import Header from '@/Components/Header';
import Hint from '@/Components/Hint';
import Layout from '@/Components/Layout/Layout';
import { Button } from '@/Components/ui/button';
import { Head, Link } from '@inertiajs/inertia-react';
import axios from 'axios';
import { CircleHelpIcon, Loader2, MessageCircleQuestion } from 'lucide-react';
import {FC, useEffect, useState} from 'react';
import { toast } from 'sonner';
import InstructionModal from './LeavePlanner/InstructionModal';

type RequestLogs = {
    total_days:number;
    application_date:string;
    employee_id:string;
    leave_reason:string;
    leave_category:string;
    leave_status:string;
    date_from:string;
    date_to:string;
}

const LeavePlanner:FC = () => {
    const [showInstructionModal,setShowInstructionModal] = useState(false);
    const [fetchingRemainingLeaveCreds,setFetchingRemainingLeaveCreds] = useState(false);
    const [fetchingPendingRequests,setFetchingPendingRequests] = useState(false);
    const [fetchingApprovedRequests,setFetchingApprovedRequests] = useState(false);
    const [leaveCredits,setLeaveCredits] = useState<{employee_id:string;leave_credits:number}>();
    const [pendingRequests,setPendingRequests] = useState<RequestLogs[]>([]);
    const [approvedRequests,setApprovedRequests] = useState<RequestLogs[]>([]);

    
    useEffect(()=>{
        const fetchRemainingLeaveCreds = () => {
            setFetchingRemainingLeaveCreds(true);
            axios
                .get(route('hrms.get_leave_credits'))
                .then(({data})=>setLeaveCredits(data))
                .catch(e=>{
                    console.error(e);
                    toast.error('An error occurred while fetching leave credits. Please refresh the page.')
                })
                .finally(()=>setFetchingRemainingLeaveCreds(false))
        };
    
        const fetchPendingRequests = () => {
            setFetchingPendingRequests(true);
            axios
                .get(route('hrms.get_my_pending_leave_requests'))
                .then(({data})=>setPendingRequests(data))
                .catch(e=>{
                    console.error(e);
                    toast.error('An error occurred while fetching pending requests. Please refresh the page.')
                })
                .finally(()=>setFetchingPendingRequests(false))
        }
    
        const fetchApprovedRequests = () => {
            setFetchingApprovedRequests(true);
            axios
                .get(route('hrms.get_last_5_leave_requests'))
                .then(({data})=>setApprovedRequests(data))
                .catch(e=>{
                    console.error(e);
                    toast.error('An error occurred while fetching approved requests. Please refresh the page.')
                })
                .finally(()=>setFetchingApprovedRequests(false))
        }
    
        fetchRemainingLeaveCreds();
        fetchPendingRequests();
        fetchApprovedRequests();
    },[]);

    return (
        <>
            <Head title="Leave Planner" />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container pb-2.5 overflow-y-auto'>
                    <div className="relative">
                        <Header logo='leave' title='Leave Planner' />
                        <Link href={route('hrms.leave_planner_head')}>
                            <Button size='sm' variant='success' className="absolute top-8 right-3">
                                Go To Manager View
                            </Button>
                        </Link>
                    </div>
                    <div className='flex-1  overflow-y-auto flex flex-col gap-y-12'>
                        <div className='flex items-center justify-between'>
                            <h4 className='text-xl font-bold tracking-wide flex items-center gap-x-2'>
                                <span>Leave Credits:</span>
                                {fetchingRemainingLeaveCreds&&(
                                    <span className='animate-pulse text-muted-foreground flex items-center text-sm gap-x-1'>
                                        <span className='italic'>Loading...</span>
                                        <Loader2 className='h-5 w-5 animate-spin' />
                                    </span>
                                )}
                                {!fetchingRemainingLeaveCreds&&(
                                    <span>
                                        {leaveCredits?leaveCredits.leave_credits:'0.0'}
                                    </span>
                                )}
                            </h4>
                            <div className='flex items-center gap-x-2 '>
                                <p className='hidden md:block'>
                                    Please log-in to TimeSheet System to Apply for a Leave 
                                </p>
                                <Hint label='Click here to view Instructions on how to Apply for Leave'>
                                    <button onClick={()=>setShowInstructionModal(true)} className='rounded-full hover:scale-110 transition-all duration-300 text-info flex flex-col items-center justify-center' >
                                        <CircleHelpIcon />
                                    </button>
                                </Hint>
                            </div>
                        </div>
                        <div className='md:flex-1 flex flex-col md:flex-row md:items-center md:gap-x-3.5 gap-y-2.5 md:gap-y-0 md:overflow-y-auto'>
                            <div className='md:h-full md:w-1/2 w-full flex flex-col gap-y-3.5'>
                                <p className='text-center'>My Pending Leave Requests:</p>
                                {fetchingPendingRequests&& (
                                    <p className='animate-pulse text-muted-foreground flex items-center justify-center gap-x-0.5'>
                                        <span>Loading...</span> 
                                        <Loader2 className='h-5 w-5 animate-spin' />
                                    </p>
                                )}
                                {!fetchingPendingRequests&&pendingRequests.length>0&&(
                                    <div className='flex flex-col gap-y-3.5'>
                                        {pendingRequests.map((request,index)=>(
                                            <div key={index} className='flex flex-col gap-y-1.5'>
                                                <div className='flex items-center gap-x-2'>
                                                    <p className='text-sm font-semibold'>Leave Reason:</p>
                                                    <p>{request.leave_reason}</p>
                                                </div>
                                                <div className='flex items-center gap-x-2'>
                                                    <p className='text-sm font-semibold'>Leave Category:</p>
                                                    <p>{request.leave_category}</p>
                                                </div>
                                                <div className='flex items-center gap-x-2'>
                                                    <p className='text-sm font-semibold'>Date From:</p>
                                                    <p>{request.date_from}</p>
                                                </div>
                                                <div className='flex items-center gap-x-2'>
                                                    <p className='text-sm font-semibold'>Date To:</p>
                                                    <p>{request.date_to}</p>
                                                </div>
                                                <div className='flex items-center gap-x-2'>
                                                    <p className='text-sm font-semibold'>Total Days:</p>
                                                    <p>{request.total_days}</p>
                                                </div>
                                                <div className='flex items-center gap-x-2'>
                                                    <p className='text-sm font-semibold'>Application Date:</p>
                                                    <p>{request.application_date}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {!fetchingPendingRequests&&pendingRequests.length===0&&(
                                    <p className='text-muted-foreground text-center'>
                                        No pending leave requests.
                                    </p>
                                )}
                            </div>
                            <div className='md:overflow-y-auto md:h-full md:w-1/2 w-full flex flex-col gap-y-3.5'>
                                <p className='text-center'>
                                    Last 5 Approved Leave Requests:
                                </p>
                                {fetchingApprovedRequests&& (
                                    <p className='animate-pulse text-muted-foreground flex items-center justify-center gap-x-0.5'>
                                        <span>Loading...</span> 
                                        <Loader2 className='h-5 w-5 animate-spin' />
                                    </p>
                                )}
                                {!fetchingApprovedRequests&&approvedRequests.length>0&&(
                                    <div className='flex flex-col gap-y-3.5'>
                                        {approvedRequests.map((request,index)=>(
                                            <div key={index} className='flex flex-col gap-y-1.5 border rounded-md px-2.5 py-1.5'>
                                                <div className='flex items-center gap-x-2'>
                                                    <p className='text-sm font-semibold'>Leave Reason:</p>
                                                    <p>{request.leave_reason}</p>
                                                </div>
                                                <div className='flex items-center gap-x-2'>
                                                    <p className='text-sm font-semibold'>Leave Category:</p>
                                                    <p>{request.leave_category}</p>
                                                </div>
                                                <div className='flex items-center gap-x-2'>
                                                    <p className='text-sm font-semibold'>Date From:</p>
                                                    <p>{request.date_from}</p>
                                                </div>
                                                <div className='flex items-center gap-x-2'>
                                                    <p className='text-sm font-semibold'>Date To:</p>
                                                    <p>{request.date_to}</p>
                                                </div>
                                                <div className='flex items-center gap-x-2'>
                                                    <p className='text-sm font-semibold'>Total Days:</p>
                                                    <p>{request.total_days}</p>
                                                </div>
                                                <div className='flex items-center gap-x-2'>
                                                    <p className='text-sm font-semibold'>Application Date:</p>
                                                    <p>{request.application_date}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {!fetchingApprovedRequests&&approvedRequests.length===0&&(
                                    <p className='text-muted-foreground text-center'>
                                        No approved leave requests.
                                    </p>                                
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
            <InstructionModal isOpen={showInstructionModal} setOpen={setShowInstructionModal} />
        </>
    );
};

export default LeavePlanner;