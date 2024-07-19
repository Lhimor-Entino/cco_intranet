import {FC, ReactNode} from 'react';
import { SimplifiedPendingRequest } from '../LeavePlannerHead';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/Components/ui/sheet';

interface Props {
    requests:SimplifiedPendingRequest[];
    children:ReactNode;
}

const SimplifiedView:FC<Props> = ({children,requests}) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side='left' className='h-full max-h-screen flex flex-col md:min-w-[600px]'>
                <SheetHeader>
                    <SheetTitle>Pending Requests - Simplified View</SheetTitle>
                    <SheetDescription>
                        Make changes to your profile here. Click save when you're done.
                    </SheetDescription>
                </SheetHeader>
                <div className='flex flex-col gap-y-3 overflow-y-auto'>
                    {requests.map(req=>(
                        <div key={req.employee_id} className='flex flex-col gap-y-1.5 p-2 border rounded text-sm'>
                            
                            <div className='flex justify-between items-center'>
                                <p className='text-muted-foreground'>Total Days:</p>
                                <p>{req.total_days}</p>
                            </div>  
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
                                <p className='text-muted-foreground'>From:</p>
                                <p>{req.date_from}</p>
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
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default SimplifiedView;