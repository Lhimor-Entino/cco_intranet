

import { toast } from 'sonner';
import {create} from 'zustand';


type Props = {
    isOpen?:boolean;
    onOpen:(position:string)=>void;
    onClose:()=>void;
}

export const useAttendanceReportModal = create<Props>((set)=>({
    dateRange:undefined,
    isOpen:false,
    onOpen:(position)=>{
        const allowed = [
            'PROGRAMMER',
            'REPORTS ANALYST',
            'QUALITY ANALYST 5',
            'REAL TIME ANALYST',
            'GENERAL MANAGER',
            'OPERATIONS SUPERVISOR',
            'QUALITY ANALYST 1',
            'OPERATIONS SUPERVISOR 2',
            'QUALITY ANALYST 6',
            'QUALITY ANALYST 2',
            'QUALITY ANALYST 4',
            'QUALITY ASSURANCE AND TRAINING SUPERVISOR',
            'QUALITY ANALYST',
            'OPERATIONS MANAGER',
        ];
        if(!allowed.includes(position)) return toast.error('Only RTAs and Supervisors are allowed to download reports.');
        set({isOpen:true})
    },
    onClose:()=>set({isOpen:false}),
}));