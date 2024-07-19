
import { User } from '@/types';
import { toast } from 'sonner';
import {create} from 'zustand';

type Props = {
    isOpen?:boolean;
    onOpen:(position:string)=>void;
    onClose:()=>void;
}

export const useShiftSettingsModal = create<Props>((set)=>({
    isOpen:false,
    onOpen:(position:string)=>{
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
        if(!allowed.includes(position)) return toast.error('Only RTAs and Supervisors can archive employees.');
        set({isOpen:true});
    },
    onClose:()=>set({isOpen:false}),
}));