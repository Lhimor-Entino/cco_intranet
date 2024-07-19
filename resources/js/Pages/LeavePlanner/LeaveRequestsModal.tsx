import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import {FC} from 'react';
import { format } from 'date-fns';
import { SelectedRequests } from './CalendarView';

interface Props {
    isOpen:boolean;
    selectedRequests?:SelectedRequests;
    onClose:()=>void;
}

const LeaveRequestsModal:FC<Props> = ({isOpen,selectedRequests,onClose}) => {
    const dateLabel = !!selectedRequests?format(selectedRequests.date,'PP'):'';
    const count = selectedRequests?.requests.length||0;
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>            
            <DialogContent className='flex flex-col max-h-[98.5vh]'>
                <DialogHeader>
                    <DialogTitle>{dateLabel}</DialogTitle>
                    <DialogDescription>
                        A list of pending leave requests for {dateLabel}
                    </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-y-3.5 overflow-y-auto'>
                    {count>0&&(selectedRequests?.requests||[]).map(req=>(
                        <div key={req.employee_id} className='flex flex-col gap-y-1.5 p-2 border rounded text-sm'>
                            <div className='flex justify-between items-center'>
                                <p className='text-muted-foreground'>Agent:</p>
                                <p>
                                    {`${req.first_name} ${req.last_name}`}
                                    <span className='font-bold tracking-wide'>
                                        {` (${req.employee_id})`}
                                    </span>
                                </p>
                            </div>
                            <div className='flex justify-between items-center'>
                                <p className='text-muted-foreground'>Application Date:</p>
                                <p>{req.application_date}</p>
                            </div> 
                            <div className='flex justify-between items-center'>
                                <p className='text-muted-foreground'>Type:</p>
                                <p>{req.leave_category}</p>
                            </div>                            
                            <div className='flex justify-between items-center'>
                                <p className='text-muted-foreground'>Reason:</p>
                                <p>{req.leave_reason}</p>
                            </div>
                            <div className='flex justify-between items-center'>
                                <p className='text-muted-foreground'>Until:</p>
                                <p>{req.date_to}</p>
                            </div>
                            <div className='flex justify-between items-center'>
                                <p className='text-muted-foreground'>Status:</p>
                                <p>{req.leave_status}</p>
                            </div>
                        </div>
                    ))}
                    {count===0&&<p className='text-center text-muted-foreground'>No pending leave requests for this date.</p>}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LeaveRequestsModal;