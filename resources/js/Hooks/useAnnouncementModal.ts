
import { Announcement } from '@/types';
import {create} from 'zustand';

type Props = {
    isOpen?:boolean;
    onOpen:(data?:Announcement)=>void;
    onClose:()=>void;
    data?:Announcement;
}

export const useAnnouncementModal = create<Props>((set)=>({
    isOpen:false,
    onOpen:(data)=>set({isOpen:true,data}),
    onClose:()=>set({isOpen:false,data:undefined}),
}));