import { PageProps } from "@/types";
import { Page } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import { type ClassValue, clsx } from "clsx"
import { DateRange } from "react-day-picker";
import { twMerge } from "tailwind-merge"
import {utils,writeFile} from 'xlsx';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ExportToExcel:(data:any[],fileName:string)=>Promise<void> = async(data,fileName)=>{
  const ws=utils.json_to_sheet(data,{skipHeader:true});
  const columnRange = `A1:${numberToExcelColumn(data[0].length)}`;
  ws['!autofilter'] = { ref:columnRange };
  const wb=utils.book_new();
  utils.book_append_sheet(wb,ws,"Data");
  writeFile(wb, `${fileName}.xlsx`,{bookType:'xlsx',bookSST:true,});
}

function numberToExcelColumn(num:number) {
  let columnName = '';
  while (num > 0) {
      let remainder = (num - 1) % 26;
      columnName = String.fromCharCode(65 + remainder) + columnName;
      num = Math.floor((num - 1) / 26);
  }
  return columnName + '1';
}

export const isValid24HrTime = (time:string) => {
  // Regular expression to match the time format hh:mm:ss
  var regex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

  // Test the input string against the regular expression
  return regex.test(time);
}
/*
1- Multiple Choice
2- Multiple Answers
3- Type the Answer
4- Enumeration
5- Essay
*/
export const questionTypes = [
  {id:1,description:'Multiple Choice'},
  {id:2,description:'Multiple Answers'},
  {id:3,description:'Type the Answer'},
  {id:4,description:'Enumeration'},
  {id:5,description:'Essay'},
] as {id:number;description:string}[];

export function minutesToHHMMSS(minutes:number) {
  const totalSeconds = minutes * 60;
  const hours = Math.floor(totalSeconds / 3600);
  const remainingSeconds = totalSeconds % 3600;
  const minutesPart = Math.floor(remainingSeconds / 60);
  const secondsPart = remainingSeconds % 60;

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutesPart.toString().padStart(2, '0');
  const formattedSeconds = secondsPart.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
export const setTimeZone = (date : Date) => {
  return date.toLocaleDateString('en-US', {
    timeZone: 'Asia/Manila', // Set your desired timezone
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}
export const parseDateRange = (d:DateRange | undefined):{from:string | null; to: string | null} => {
  const from = setTimeZone(new Date(d?.from + '')); //new Date(d?.from + '').toLocaleDateString();
  const to = d?.to ? setTimeZone(new Date(d?.to + '')) : null; //new Date(d?.to + '').toLocaleDateString() : null;
  return {from:formatDate(from), to: formatDate(to)};
}

export const formatDate = (dateStr: string | null) => {
  if(!dateStr){return null}
  const [month, day, year] = dateStr.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// Utility function to convert a Date object to a specific timezone (adjustment only)
export const convertToTimezone = (date:Date, offsetHours:number = 8) => {
  // if (!date) return null;

  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000); // Convert to UTC first
  const timezoneDate = new Date(utcDate.getTime() + offsetHours * 60 * 60 * 1000); // Apply the timezone offset

  return timezoneDate;
};
export const isInSecondsOrMinutes = (unit:string,daily_goal:string) => {
  let parts = daily_goal.split(':');
  // Assuming the time string is always in the format HH:MM:SS
  let hours = parseInt(parts[0], 10) || 0;
  let minutes = parseInt(parts[1], 10) || 0;
  let seconds = parseInt(parts[2], 10) || 0;
  
  let totalSeconds = hours * 3600 + minutes * 60 + seconds;
  
  let totalMinutes = minutes % 60 === 0? (hours * 60) : minutes;
 
  if(unit ==="Minutes") return totalMinutes;
  if(unit ==="Seconds") return totalSeconds

  return 0;
}
export const roundWithFormat = (value:number,decimal:number = 0) => {
  return (Math.round(value * 100) / 100).toFixed(decimal);
}

export const isTeamLead = () => {
  const {user} = usePage<Page<PageProps>>().props.auth;
  if(user=== null) {return false;}

  return user.position == 'TEAM LEADER' ||
      user.position == 'TEAM LEADER 1' ||
      user.position == 'TEAM LEADER 2' ||
      user.position == 'TEAM LEADER 3' ||
      user.position == 'TEAM LEADER 4' ||
      user.position == 'TEAM LEADER 5' ||
      user.position == 'TEAM LEADER 6' ||
      user.position == 'TEAM LEADER 7' ||
      user.position == 'TEAM LEAD' ||
      user.position == 'TEAM LEAD 1' ||
      user.position == 'TEAM LEAD 2' ||
      user.position == 'TEAM LEAD 3' ||
      user.position == 'TEAM LEAD 4' ||
      user.position == 'TEAM LEAD 5' ||
      user.position == 'TEAM LEAD 6' ||
      user.position == 'TEAM LEAD 7'
    
};

export const hasTeam = () => {
  const {user} = usePage<Page<PageProps>>().props.auth;
  if(user=== null) {return false;}
  return !!user.team && !!user?.team_id;
}

export const isAdmin = () => {
  const {user} = usePage<Page<PageProps>>().props.auth;
  if(user=== null) {return false;}
  return user.position == 'PROGRAMMER' ||
  user.position == 'OPERATIONS MANAGER' ||
  user.position == 'GENERAL MANAGER' ||
  user.position == 'OPERATIONS SUPERVISOR' 
  user.position == 'OPERATIONS SUPERVISOR 2' 
  user.position == 'QUALITY ASSURANCE AND TRAINING SUPERVISOR' 
};

export const timeZonesWithOffsets = () => { 
  const UTC_8 = 8;
  return [
    { "name": "Asia/Manila", "offset": 8 /*8 - commented "8" because this is the default timezone*/ },
    { "name": "America/New_York", "offset": -4 },
    { "name": "Europe/London", "offset": 1 },
   
];}
export const AttendanceStatus = (code:number) => {

  const StatusCode = {
    '-3':"No Time/Absent",
    '-2':"No Time Out",
    '-1': "No Time In",
    0: "No Time In/Out", // This value returns only if there's attendance but no in/out and status 0
    5: "OFF",
    1: "ABSENT",
    4: "HOLIDAY",
    16: "RESIGNED",
    20: "PAID OFF", 
    // 15: "HOLIDAY"
  }[code] || ""

  return StatusCode;
  
}

export const convertTimeByOffset = (timeString: string, offset: number, timezone: string): string => {
  const timeFormatRegex = /^(?:[01]\d|2[0-3]):[0-5]\d - (?:[01]\d|2[0-3]):[0-5]\d$/;
  if (!timeFormatRegex.test(timeString)) return timeString;

  const [startTime, endTime] = timeString.split(' - ');

  // Helper function to convert time string to a Date object in the specified timezone
  const toDate = (time: string): Date => {
      const [hours, minutes] = time.split(':').map(Number);
      const date = new Date();
      date.setUTCHours(hours, minutes, 0, 0); // Set time in UTC
      return new Date(date.toLocaleString('en-PH', { timeZone: timezone })); // Convert to the specified timezone
  };

  // Helper function to format Date object back to HH:mm
  const formatTime = (date: Date): string => {
      const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: timezone };
      return new Intl.DateTimeFormat('en-PH', options).format(date);
  };

  // Convert times to Date objects
  const startDate = toDate(startTime);
  const endDate = toDate(endTime);

  // Apply offset (in hours) by adding or subtracting from the hours
  startDate.setUTCHours(startDate.getUTCHours() - offset);
  endDate.setUTCHours(endDate.getUTCHours() - offset);

  // Return the updated time range in HH:mm format
  return `${formatTime(startDate)} - ${formatTime(endDate)}`;
};
export const InOutByOffset = (timeString: string, offset: number, timezone: string): string => {
 
  const timeFormatRegex = /^\d{2}:\d{2}:\d{2}$/;
  if (!timeFormatRegex.test(timeString)) return timeString;
  const toDate = (time: string): Date => {
      const [hours, minutes, seconds] = time.split(':').map(Number);
      const date = new Date();
      date.setUTCHours(hours, minutes, seconds, 0); // Set time in UTC
      return new Date(date.toLocaleString('en-PH', { timeZone: timezone })); // Convert to the specified timezone
  };

  // Helper function to format Date object back to HH:mm
  const formatTime = (date: Date): string => {
      const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit',second: '2-digit', hour12: false, timeZone: timezone };
      return new Intl.DateTimeFormat('en-PH', options).format(date);
  };
  const time = toDate(timeString);
  time.setUTCHours(time.getUTCHours() - offset);
  return  `${formatTime(time)}`;
}