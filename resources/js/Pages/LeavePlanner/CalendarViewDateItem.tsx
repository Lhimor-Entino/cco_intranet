import {FC} from 'react';
import { PendingRequest } from '../LeavePlannerHead';
import { cn } from '@/lib/utils';

interface Props {
    month: number;
    year: number;
    day: number;
    pendingRequests:PendingRequest[];
    onClick:(requests:PendingRequest[],date:Date)=>void;
}

const CalendarViewDateItem:FC<Props> = ({day,month,year,pendingRequests,onClick}) => {
    const date = new Date(`${year}-${month.toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`);
    const requests = pendingRequests.filter(r=>new Date(r.date_from).getTime() === date.getTime());
    const handleClick = () => onClick(requests,date);
    return (
        <div onClick={handleClick} role='button' key={day} className={cn("hover:scale-105  transition-all duration-300 rounded border h-20 p-2 flex flex-col justify-between border-l-4 ",requests.length===0?'border-l-info':'border-l-success')}>
            <p>{day}</p>
            <p className='text-xs text-muted-foreground'>
                {requests.length} {requests.length === 1 ? 'Request' : 'Requests'}
            </p>
        </div>
    );
};

export default CalendarViewDateItem;