
import {create} from 'zustand';

type Props = {
    attendanceDate?:string;
    setAttendanceDate:(date:string)=>void;
}

export const useAttendanceDate = create<Props>((set)=>({
    attendanceDate:undefined,
    setAttendanceDate:(date)=>set({attendanceDate:date}),
}));