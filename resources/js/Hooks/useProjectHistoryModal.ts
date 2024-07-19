import { User } from '@/types';
import {create} from 'zustand';

type Props = {
    isOpen?:boolean;
    onOpen:(user:User)=>void;
    onClose:()=>void;
    user?:User;
}

export const useProjectHistoryModal = create<Props>((set)=>({
    isOpen:false,
    onOpen:(user)=>set({isOpen:true,user}),
    onClose:()=>set({isOpen:false,user:undefined}),
}));