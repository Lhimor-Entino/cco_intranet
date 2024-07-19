import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useUpdateAttendaceModal } from "@/Hooks/useUpdateAttendaceModal";
import { isValid24HrTime } from "@/lib/utils";
import { User, UserAttendance } from "@/types";
import { useForm } from "@inertiajs/inertia-react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { FC, FormEventHandler, useEffect } from "react";
import { useQueryClient } from "react-query";
import { toast } from "sonner";


const UpdateAttendanceModal:FC = () => {
    const {isOpen,data:attendance,onClose} = useUpdateAttendaceModal();
    const {data,setData,processing,post} = useForm<{time_in:string|undefined,time_out:string|undefined}>({time_in:'',time_out:''});
    const queryClient = useQueryClient();
    const user = attendance?.user;
    useEffect(()=>{
        if(!user) return;
        if(!attendance?.user_attendance) return;
        if(!isOpen) return;
        
        const {time_in,time_out} = attendance.user_attendance;
        setData(val=>({...val,time_in:time_in||"",time_out:time_out||""}));
        
    },[attendance,user,isOpen]);
    const dt = attendance?.user_attendance?.date ? format(new Date(attendance.user_attendance.date),'PP') : format(new Date(),'PP');
    const onSubmit:FormEventHandler<HTMLFormElement> = (e) =>{
        e.preventDefault();
        const href=!!attendance?.user_attendance?.id ? route('attendance.update',{id:attendance.user_attendance.id}):route('attendance.store',{user_id:attendance!.user!.id,date:dt});
        
        if(!isValid24HrTime(data.time_in||'')) return toast.error('Invalid time format. Please use 24-hour format (HH:MM:SS)');
        //only check for isValid24HrTime for data.time_out if it is not undefined or empty
        if(data.time_out && !isValid24HrTime(data.time_out)) return toast.error('Invalid time format. Please use 24-hour format (HH:MM:SS)');

        post(href,{
            onSuccess:()=>{
                onClose();
                toast.success('Attendance Updated');                
                queryClient.removeQueries({ queryKey: ['attendances'] })
            },
            preserveState:false,
            onError:()=>toast.error('An error occured while updating attendance. Please try again later')
        });
    }


    

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Update Time-in/Time-out</AlertDialogTitle>
                <AlertDialogDescription asChild>
                    <div>
                        {`Update the time-in and time-out of ${user?.first_name} ${user?.last_name} on ${ dt}`} 
                        Please use 24-hour format (HH:MM)
                    </div>
                </AlertDialogDescription>
                </AlertDialogHeader>
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="flex flex-col gap-y-3.5">
                        <div className="space-y-1">
                            <Label>Time-in</Label>
                            <Input disabled={processing} required autoComplete="off" autoFocus  value={data.time_in} onChange={(e)=>setData('time_in',e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label>Time-out</Label>
                            <Input disabled={processing} autoComplete="off"  value={data.time_out} onChange={(e)=>setData('time_out',e.target.value)} />
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <Button onClick={onClose} type="button" disabled={processing}>Cancel</Button>
                        <Button type="submit" variant='outline' disabled={processing}>
                            {processing&&<Loader2 className='h-5 w-5 mr-2 animate-spin' />}
                            {processing?'Updating...':'Update'}
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    )
}
export default UpdateAttendanceModal