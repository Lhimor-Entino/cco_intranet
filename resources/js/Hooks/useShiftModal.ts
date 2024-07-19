
import { User } from '@/types';
import {create} from 'zustand';

type Props = {
    isOpen?:boolean;
    onOpen:(data:User,dt:string)=>void;
    onClose:()=>void;
    data?:User;
    dt?:string;
}

export const useShiftModal = create<Props>((set)=>({
    isOpen:false,
    onOpen:(data,dt)=>set({isOpen:true,data,dt}),
    onClose:()=>set({isOpen:false,data:undefined,dt:undefined}),
}));