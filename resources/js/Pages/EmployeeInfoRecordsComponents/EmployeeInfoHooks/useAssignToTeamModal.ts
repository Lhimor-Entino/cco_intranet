import { User } from '@/types';
import { toast } from 'sonner';
import {create} from 'zustand';

type Props = {
    isOpen?:boolean;
    onOpen:(user:User,position:string)=>void;
    onClose:()=>void;
    user?:User;
}

export const useAssignToTeamModal = create<Props>((set)=>({
    isOpen:false,
    onOpen:(user,position)=>{
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
        if(!allowed.includes(position)) return toast.error('Only RTAs and Supervisors can transfer employees.');
        set({isOpen:true,user})
    },
    onClose:()=>set({isOpen:false,user:undefined}),
}));