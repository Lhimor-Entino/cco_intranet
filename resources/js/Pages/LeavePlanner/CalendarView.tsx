import {FC, useMemo, useState} from 'react';
import { PendingRequest } from '../LeavePlannerHead';
import CalendarViewDateItem from './CalendarViewDateItem';
import LeaveRequestsModal from './LeaveRequestsModal';

interface Props {
    m?: number;
    y?: number;
    pendingRequests:PendingRequest[];
}

export type SelectedRequests = {
    date:Date;
    requests:PendingRequest[];
}

const CalendarView:FC<Props> = ({m,y,pendingRequests}) => {
    const month = m || new Date().getMonth() + 1;
    const year = y || new Date().getFullYear();
    const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) =>  new Date(year, month - 1, 1).getDay();
    const [selectedRequests, setSelectedRequests] = useState<SelectedRequests>();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDay });
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const onClick = (requests:PendingRequest[],date:Date) => setSelectedRequests({date,requests});
    return (
        <>
            <LeaveRequestsModal isOpen={!!selectedRequests} selectedRequests={selectedRequests} onClose={()=>setSelectedRequests(undefined)} />
            <div className="flex flex-col gap-y-2 overflow-y-auto">
                <div className="grid grid-cols-7 gap-2">
                    {dayLabels.map(day => (
                        <div key={day} className="text-center border rounded py-1">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2 overflow-y-auto">
                    {emptyDays.map((_, i) =><div className='rounded border h-20 p-2' key={i}></div>)}
                    {days.map(day => <CalendarViewDateItem onClick={onClick} key={day} month={month} year={year} day={day} pendingRequests={pendingRequests} />)}
                </div>
            </div>
        </>
    );
};

export default CalendarView;