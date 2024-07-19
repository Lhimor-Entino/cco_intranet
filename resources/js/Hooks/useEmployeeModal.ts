
import { User } from '@/types';
import {create} from 'zustand';

type Props = {
    isOpen?:boolean;
    onOpen:(data:User)=>void;
    onClose:()=>void;
    data?:User;
}

export const useEmployeeModal = create<Props>((set)=>({
    isOpen:false,
    onOpen:(data)=>set({isOpen:true,data}),
    onClose:()=>set({isOpen:false,data:undefined}),
}));