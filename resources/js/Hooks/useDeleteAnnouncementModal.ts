
import {create} from 'zustand';

type Props = {
    isOpen?:boolean;
    onOpen:(id:number)=>void;
    onClose:()=>void;
    id:number;
}

export const useDeleteAnnouncementModal = create<Props>((set)=>({
    id:0,
    isOpen:false,
    onOpen:(id)=>set({isOpen:true,id}),
    onClose:()=>set({isOpen:false,id:0}),
}));