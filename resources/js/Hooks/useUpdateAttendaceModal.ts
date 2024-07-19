

import { User, UserAttendance } from '@/types';
import { toast } from 'sonner';
import {create} from 'zustand';

type data = {
    user_attendance?:UserAttendance;
    user?:User;
}

type Props = {
    isOpen?:boolean;
    onOpen:(data:data,position:string)=>void;
    onClose:()=>void;
    data?:data;
}

export const useUpdateAttendaceModal = create<Props>((set)=>({
    data:undefined,
    isOpen:false,
    onOpen:(data,position)=>{
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
        if(!allowed.includes(position)) return toast.error('Only RTAs and Supervisors are allowed to update attendance.');
        set({isOpen:true,data})
    },
    onClose:()=>set({isOpen:false,data:undefined}),
}));