import { useAttendanceReportModal } from "@/Hooks/useAttendanceReportModal";
import { FC, useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { AttendanceStatus, cn, convertTimeByOffset, convertToTimezone, ExportToExcel, InOutByOffset, parseDateRange, timeZonesWithOffsets } from "@/lib/utils";
import { CalendarIcon, Loader2, ShieldAlertIcon } from "lucide-react";
import { format, set, addDays } from 'date-fns';
import { Calendar } from "../ui/calendar";
import axios from "axios";
import { toast } from "sonner";
import { User, UserAttendance } from "@/types";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

const AttendanceReportModal:FC= () => {
    
    const {isOpen,onClose} = useAttendanceReportModal();
    const [loading,setLoading] = useState(false);
    const [initialDate, setDate] = useState<DateRange | undefined>();
    const [oldFormat, setOldFormat] = useState(false);
    
    const disabledDates = {
        from: addDays(new Date(),2),
        //add 1 year
        to: set(new Date(),{year:new Date().getFullYear()+1})
    }
    const onSubmit = () =>{
        if(!initialDate?.from) return toast.info('Please select a date range');
        const fileName = `Attendance Report ${format(initialDate.from,'yyyy-MM-dd')} - ${format(initialDate.to || initialDate.from,'yyyy-MM-dd')}`;
        const tardyFileName = `Tardyness Report ${format(initialDate.from,'yyyy-MM-dd')} - ${format(initialDate.to || initialDate.from,'yyyy-MM-dd')}`;
        const incentiveFileName = `Incentive Report ${format(initialDate.from,'yyyy-MM-dd')} - ${format(initialDate.to || initialDate.from,'yyyy-MM-dd')}`;
        setLoading(true);
        // Parse Date TimeZone
        const parsedDate = parseDateRange(initialDate);
        const date = {from: convertToTimezone(new Date(parsedDate.from + '')), ...(parsedDate.to && {to:convertToTimezone(new Date(parsedDate.to + ''))})};
        setDate(date);
        axios.post(route('attendance.generate_report'),{
          date
        })
        .then(async(response:{data:User[]})=>{
            const timezone = parseInt(localStorage.getItem('myTimezone')?? "0",10);
            if(!oldFormat){
                
                const report = await newReportFormat(response.data,timezone);
                const incentiveReport = await formatIncentiveReport(response.data);
                await ExportToExcel(report,fileName);
                await ExportToExcel(incentiveReport,incentiveFileName);
            }
            //the else statement below is deprecated, but kept for reference
            // else{            
                // const report = await formatReport(response.data);
                // const taryReport = await formatTardinessReport(response.data);
                // await ExportToExcel(report,'oldFormat_'+fileName);
                // await ExportToExcel(taryReport,'oldFormat_'+tardyFileName);
            // }
            toast.success('Attendance/Taridness and Incentive report generated. Check your downloads folder');
        })
        .catch(error=>{
            console.error(error);
            toast.error('An error occurred while generating report. Please try again');
        })
        .finally(()=>{
            setLoading(false);
        });
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Generate Attendance and Incentive Report</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="space-y-2.5">
                            <p>Please choose date range.</p>
                            {loading && <p>This may take a while. Please do not close or refresh this page</p>}
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex flex-col gap-y-3.5">
                    
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            disabled={loading}
                            id="date"
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal",
                            !initialDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {initialDate?.from ? (
                            initialDate.to ? (
                                <>
                                {format(initialDate.from, "LLL dd, y")} -{" "}
                                {format(initialDate.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(initialDate.from, "LLL dd, y")
                            )
                            ) : (
                            <span>Pick a date range</span>
                            )}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={initialDate?.from}
                            selected={initialDate}
                            onSelect={setDate}
                            numberOfMonths={1}
                            disabled={disabledDates}
                        />
                        </PopoverContent>
                    </Popover>
                    <div className="flex flex-col gap-y-2.5">
                        <div className="flex items-center gap-x-2.5">
                            <ShieldAlertIcon className="h-5 w-5 text-primary" />
                            <p className="text-sm font-bold">Warning!</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Employees with no shift schedule may not be included in the report or incorrect values may appear. <br />
                            Please make sure each employee has a shift schedule set before generating the report.
                        </p>
                    </div>
                    {/* Not needed anymore, but keep the code */}
                    {/* <div className="flex items-center space-x-2">
                        <Switch id="old_format" checked={oldFormat} onCheckedChange={()=>setOldFormat(val=>!val)} />
                        <Label htmlFor="old_format" className={cn("text-xs transition duration-300",oldFormat?'text-primary':'text-muted-foreground')}>Generate using Old Format <span className="italic font-light tracking-tight">(Tardiness and Attendance are separate files)</span></Label>
                    </div> */}
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <Button disabled={loading} type="button" onClick={onSubmit}>
                        {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                        {loading ? "Generating Report..." : "Generate Report"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
export default AttendanceReportModal;


const formatReport:(data:User[])=>Promise<any[]>= async(data) =>{
    
    /*
    arrange in the format below:
    Name    Site	Employee ID	Role/Designation	01/02/2024	02/02/2024	03/02/2024	04/02/2024	05/02/2024	06/02/2024	07/02/2024	08/02/2024
    FirstName LastName  Manila	FOQT	CSR	1	1	0	0	1	1	1	1
    FirstName LastName  Leyte	348P	CSR	Not Yet Hired	1	0	0	0	0	0	1
    ***Note: 1 = Present, 0 = Absent, Not Yet Hired = Not Yet Hired
    ***Note: The dates should be dynamic based on the selected date range
    data is an array of users, each user has an array of UserAttendance records
    export interface UserAttendance {    
        id: number;
        date:string; //2024-02-01
        time_in?:string; //19:00:00
        time_out?:string; //04:00:00
        is_tardy:string;
        shift_id?:string;
        shift?:Shift;
    }
    */
    const dates: string[] = data.reduce((acc: string[], curr) => {
        curr.attendances.forEach(attendance => {
            if (!acc.includes(attendance.date)) {
                acc.push(attendance.date);
            }
        });
        return acc;
    }, []).sort();
    const header = ['Name','Site', 'Employee ID', 'Role/Designation', ...dates];
    const rows = data.map(user => {
        const row = [ `${user.last_name}, ${user.first_name}`, user.site, user.company_id, user.position];
        dates.forEach(date => {
            const attendance = user.attendances.find(attendance => attendance.date === date);
            if (attendance) {
                row.push(attendance.time_in ? '1' : '0');
            } 
            if(!attendance && user.is_archived===0){
                row.push('0');
            }
            if(!attendance && user.is_archived===1){
                row.push('RESIGNED');
            }
        });
        return row;
    });
    return [header, ...rows]

}

const formatTardinessReport:(data:User[])=>Promise<any[]>= async(data) => {
    const dates: string[] = data.reduce((acc: string[], curr) => {
        curr.attendances.forEach(attendance => {
            if (!acc.includes(attendance.date)) {
                acc.push(attendance.date);
            }
        });
        return acc;
    }, []).sort();
    const header = ['Name','Site', 'Employee ID', 'Role/Designation', ...dates];
    const rows = data.map(user => {
        const row = [ `${user.last_name}, ${user.first_name}`, user.site, user.company_id, user.position];
        dates.forEach(date => {
            const attendance = user.attendances.find(attendance => attendance.date === date);
            if (attendance) {
                row.push(attendance.is_tardy);
            } 
            if(!attendance && user.is_archived===0) {
                row.push('No Time In/Absent');
            }
            if(!attendance && user.is_archived===1){
                row.push('RESIGNED');
            }
        });
        return row;
    });
    return [header, ...rows]
}

const newReportFormat:(data:User[], timezone:number)=>Promise<any[]>= async(data,timezone) =>{
    /*
    arrange in the format below:
    Date	Name	Site	Project	Employee ID	Shift	Time In	Time Out	Tardy	Total Hours Actual Hours
    2023-09-08	First Name Last Name	Manila	Project Grand	FOIO	19:00:00 - 04:00:00	19:30:00	04:30:00	00:30:00	08:30:00    09:00:00
    2023-09-09	First Name Last Name	Manila	Project Grand	FOIK	20:00:00 - 05:00:00	20:20:00	05:20:00	00:20:00	08:40:00    09:00:00


    ***Note: Total Hours should be calculated based on the time in and time out, capped at 9 hours
    ***Note: Tardy should be calculated based on the shift time in and the actual time in, if the actual time in is later than the shift time in, then the tardy is the difference between the two
    ***Note: Total Hourse are always capped at 9 hours, then subract the tardy from the total hours

    data is an array of users, each user has an array of UserAttendance records
    export interface UserAttendance {    
        id: number;
        date:string; //2024-02-01
        time_in?:string; //19:00:00
        time_out?:string; //04:00:00
        is_tardy:string;
        shift_id?:string;
        shift?:Shift;
    }

    
    export interface Shift  {
        id: number;
        start_time: string; //19:00:00
        end_time: string; //04:00:00
        schedule: string;
    }
    */

    

    const isActive = (user:User, attendance:UserAttendance) => {
        let response = user.is_archived > 0 ? 'Inactive' : 'Active';
        const date_attended = new Date(attendance.date);
        const date_archived = new Date(user.updated_at??"");
        if(user.is_archived === 1 && !isNaN(date_archived.getTime()) && !isNaN(date_attended.getTime())){
            response = (date_attended  < date_archived? "Active" : "Inactive");
        }
        return response;
    }

    const header = ['Active / Inactive','Date','Name','Site','Project','Employee ID','Shift','Time In','Time Out','Tardy','Total Hours','Actual Hours'];
    const rows = (index:number) => data.reduce<any[]>((acc, user) => {
        console.log('Timezone on Generate: ', index)
        user.attendances.forEach(attendance => {
            const tIn = () =>{
                if(attendance.time_in) return attendance.time_in;
                if(!attendance.time_in && !attendance.time_out && user.is_archived===0) return AttendanceStatus(attendance?.status_code ?? -1);
                if(!attendance.time_in && user.is_archived===1) return 'RESIGNED';
                return "No Time In";
            }

            const tOut = () =>{
                if(attendance.time_out) return attendance.time_out;
                if(!attendance.time_in && !attendance.time_out && user.is_archived===0) return AttendanceStatus(attendance?.status_code ?? -2);
                if(!attendance.time_out && user.is_archived===1) return 'RESIGNED';
                return "No Time Out";
                
            }

            const isTardy = () =>{
               
                if(attendance.is_tardy && attendance.is_tardy !== 'No Time In/Absent')   return attendance.is_tardy;
                if(!attendance.is_tardy && user.is_archived===1) return 'RESIGNED';
                // return "No Time In/Absent";
                return AttendanceStatus(attendance?.status_code ?? -3);
            }

            const totHrs = () =>{
                // if(!attendance.time_out && !attendance.time_in && user.is_archived===0) return 'No Time In/Out';
                // if(!attendance.time_out && !attendance.time_in && user.is_archived===1) return 'Resigned';
                
                if(attendance.time_out && attendance.time_in){

                    if(!attendance.shift) return "No Shift";
                    const [tardyH, tardyM, tardyS] = (attendance.is_tardy || '00:00:00').split(':').map((val) => isNaN(Number(val)) ? 0 : Number(val));
                    const realTardySeconds = (tardyH || 0) * 3600 + (tardyM || 0) * 60 + (tardyS || 0);
                    const seconds = calculateTotalHours(attendance.time_out, attendance.time_in,attendance.shift.end_time, attendance.shift.start_time);
                    const cappedSeconds = seconds > 32400 ? 32400 : seconds;
                    const tardySeconds = attendance.shift?.is_swing === 1 ? 0 : realTardySeconds;

                    if(attendance.time_out && attendance.time_in) return secondsToHms((cappedSeconds));
                }
                
                 // return "No Time In/Out";
                return AttendanceStatus(attendance?.status_code ?? 0);
            }

            const actualHrs = () => {
                if(!attendance.time_out && !attendance.time_in && user.is_archived===0) return AttendanceStatus(attendance?.status_code ?? -1);
                if(!attendance.time_out && !attendance.time_in && user.is_archived===1) return 'RESIGNED';
                
                if(attendance.time_out && attendance.time_in){
                    const seconds = calculateTotalHours(attendance.time_out,attendance.time_in);
                    if(attendance.time_out && attendance.time_in) return secondsToHms(seconds);
                }
                // return "No Time In/Out";
                return AttendanceStatus(attendance?.status_code ?? -1);
            }

           
            // Modify this line to add Active / Inactive based on date effectivity
            const row : string[] = [
                isActive(user,attendance),
                attendance.date,
                `${user.last_name}, ${user.first_name}`,
                user.site,
                user.project?.name || 'No Project',
                user.company_id,
                convertTimeByOffset( user.attendances[0].shift?.schedule || 'No Shift',timeZonesWithOffsets()[index].offset,timeZonesWithOffsets()[index].name),
                InOutByOffset(tIn(),timeZonesWithOffsets()[index].offset,timeZonesWithOffsets()[index].name) ,
                InOutByOffset(tOut(),timeZonesWithOffsets()[index].offset,timeZonesWithOffsets()[index].name) ,
                isTardy(),
                !user.attendances[0]?.shift?.schedule || !user.shift?'No Shift': totHrs(),
                actualHrs(),
            ];
            acc.push(row);
        });
        return acc;
    }, []);
    return [header, ...rows(timezone)]
}



const formatIncentiveReport:(data:User[])=>Promise<any[]>= async(data) =>{
    
    /*
    arrange in the format below:
    Name	Site	Employee ID	Role/Designation	13/05/2024	14/05/2024	15/05/2024	16/05/2024
    Bermudez, Teejay	Manila	FOQT	CSR	09:00:00	08:30:00	09:00:00	No Time In/Out
    Abarientos, Domiegen P.	Leyte	348P	CSR	09:00:00	09:00:00	No Time In/Out	07:45:00

    ***Note: The dates should be dynamic based on the selected date range
    ***Note: Total Hours = cappped at 9 hours minus tardy - see calculation from the function above
    data is an array of users, each user has an array of UserAttendance records
    export interface UserAttendance {    
        id: number;
        date:string; //2024-02-01
        time_in?:string; //19:00:00
        time_out?:string; //04:00:00
        is_tardy:string;
        shift_id?:string;
        shift?:Shift;
    }
    */
    const dates: string[] = data.reduce((acc: string[], curr) => {
        curr.attendances.forEach(attendance => {
            if (!acc.includes(attendance.date)) {
                acc.push(attendance.date);
            }
        });
        return acc;
    }, []).sort();
    const header = ['Active / Inactive', 'Name','Site', 'Employee ID', 'Role/Designation', ...dates];
    const rows = data.map(user => {
        const row = [ `${user.is_archived === 0? 'Active' : 'Inactive'}`,`${user.last_name}, ${user.first_name}`, user.site, user.company_id, user.position];
        dates.forEach(date => {
            const attendance = user.attendances.find(attendance => attendance.date === date);
            const totHrs = () =>{
                if(!attendance?.time_out && !attendance?.time_in && user.is_archived===1) return 'RESIGNED';
                if((!attendance?.time_out || !attendance?.time_in) && user.is_archived===0) return AttendanceStatus(attendance?.status_code ?? -1);
                if(attendance?.time_out && attendance?.time_in && attendance?.shift){
                   // Shift Calculate 
                    const shift_seconds = calculateTotalHours(attendance.shift?.start_time , attendance.shift?.end_time);
                    
                    const [tardyH, tardyM, tardyS] = (attendance.is_tardy || '00:00:00').split(':').map((val) => isNaN(Number(val)) ? 0 : Number(val));
                    const realTardySeconds = (tardyH || 0) * 3600 + (tardyM || 0) * 60 + (tardyS || 0);
                    const seconds = calculateTotalHours(attendance.time_out, attendance.time_in);
                    const cappedSeconds = seconds > 32400 ? 32400 : seconds;
                    const tardySeconds = attendance.shift?.is_swing === 1 ? 0 : realTardySeconds;
                    if( attendance.time_out && attendance.time_in) return secondsToHms((cappedSeconds-tardySeconds));
                }
                 
                // return "No Time In/Out";
                return AttendanceStatus(attendance?.status_code ?? -1);
            }
            
            if (attendance && !!user.shift) {
                row.push(totHrs() || '');
            }
            if(!attendance && user.is_archived===1){
                row.push('RESIGNED');
            }
            if (attendance && !user.shift) {
                row.push('Shift Not Set');
            }
            if(!attendance && user.is_archived===0){
                row.push('');
            }
            
        });
        return row;
    });
    return [header, ...rows];
    

}

const calculateTotalHours = (timeOut:string,timeIn:string, shiftOut?:string, shiftIn?:string):number =>{
    // Convert each time string to seconds
    const [hours_out, minutes_out, seconds_out] = timeOut.split(':').map(Number);
    const [hours_in, minutes_in, seconds_in] = timeIn.split(':').map(Number);
    let timeOutSeconds = hours_out * 3600 + minutes_out * 60 + seconds_out;
    let timeInSeconds = hours_in * 3600 + minutes_in * 60 + seconds_in;
    // Calculate the difference in seconds
    let differenceInSeconds;
    if (timeOutSeconds < timeInSeconds) {
        // If time out is earlier than time in, assume time out is on the next day
        differenceInSeconds = (24 * 3600 - timeInSeconds) + timeOutSeconds;
    } else {
        // Otherwise, just subtract the two times
        differenceInSeconds = timeOutSeconds - timeInSeconds;
    }

     //Actual Hours Between Shift Schedule
     if(shiftOut?.trim() && shiftIn?.trim()){
        const [hours_sout, minutes_sout, seconds_sout] = shiftOut.split(':').map(Number);
        const [hours_sin, minutes_sin, seconds_sin] = shiftIn.split(':').map(Number);
        const shiftOutSeconds = hours_sout * 3600 + minutes_sout * 60 + seconds_sout;
        const shiftInSeconds = hours_sin * 3600 + minutes_sin * 60 + seconds_sin;
        const DiffSeconds = (timeInSeconds - shiftInSeconds) + (timeOutSeconds - shiftOutSeconds);
        return differenceInSeconds - Math.abs(DiffSeconds);
    }
    // Convert the difference back to hh:mm:ss format
    return differenceInSeconds;
}

const secondsToHms = (d:number) => {
    // if(d < 0) {
    //     d = Math.abs(d);
    // }
    if (isNaN(d)) {
        return 'Invalid time'; // Handle invalid input (NaN or negative number)
    }
    const hours = Math.floor(d / 3600);
    const remaining =  d % 3600;
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}