import { useShiftSettingsModal } from "@/Hooks/useShiftSettingsModal";
import { FC, FormEventHandler, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useForm, usePage } from "@inertiajs/inertia-react";
import { Page } from "@inertiajs/inertia";
import { PageProps } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Loader2, PlusCircle } from "lucide-react";
import { isValid24HrTime } from "@/lib/utils";
import { toast } from "sonner";

const ShiftSettingsModal:FC = () => {
    const {isOpen,onClose} = useShiftSettingsModal();
    const {data,setData,processing,reset,post} = useForm({start_time:'',end_time:''});
    const {shifts} = usePage<Page<PageProps>>().props;

    const onSubmit:FormEventHandler<HTMLFormElement> = e =>{
        e.preventDefault();
        if (!isValid24HrTime(data.start_time) || !isValid24HrTime(data.end_time)) return toast.error('Please use a valid 24 HH:MM format for the time.');
        if(data.start_time === data.end_time) return toast.error('Time-in and Time-out cannot be the same.');
        //check if start_time already exists
        if(shifts.find(shift=>shift.start_time == data.start_time)) return toast.error('Time-in already exists.');
        post(route('shift.store'),{
            onError:()=>toast.error('Failed to add shift. Please try again.'),
            onSuccess:()=>toast.success('Shift added successfully.'),
        });
    }

    useEffect(()=>reset(),[isOpen]);

    return (
        <Dialog onOpenChange={onClose} open={isOpen}>
            <DialogContent className="max-h-full flex flex-col" >
                <DialogHeader className="px-3.5 h-full">
                    <DialogTitle>Shift Settings</DialogTitle>
                    <DialogDescription>
                        Please make sure it is in correct 24 HH:MM:SS format (ex. 16:00:00).
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 flex flex-col gap-y-2.5 overflow-y-auto px-3.5 ">
                    <form onSubmit={onSubmit} className="flex gap-x-2 h-32" >
                        <div className="flex-1 items-center flex gap-x-2">
                            <div className="space-y-1.5">
                                <Label>Time-in</Label>
                                <Input className="h-9" required disabled={processing} placeholder="18:00:00" autoFocus value={data.start_time} onChange={e=>setData('start_time',e.target.value)}  />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Time-out</Label>
                                <div className="flex">
                                    <Input className="h-9" required disabled={processing} placeholder="03:00:00" value={data.end_time} onChange={e=>setData('end_time',e.target.value)} />
                                    <Button disabled={processing} className="" size='sm' variant='outline'>
                                        {processing?<Loader2 className="animate-spin" />:<PlusCircle />}
                                    </Button>
                                </div>
                            </div>
                            
                            
                        </div>
                    </form>
                    {shifts.length<1&&(
                        <div className="text-muted-foreground text-sm">
                            No shifts found. Please add a shift.
                        </div>
                    
                    )}
                    {shifts.length>0&&(
                        <Table>
                            <TableHeader className="bg-background z-50 sticky top-0">
                                <TableRow>
                                    <TableHead>Time-in</TableHead>
                                    <TableHead>Time-out</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {shifts.map(shift=>(
                                    <TableRow key={shift.id}>
                                        <TableCell>{shift.start_time.substring(0, 5)}</TableCell>
                                        <TableCell>{shift.end_time.substring(0, 5)}</TableCell>
                                    </TableRow>                                
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
                <DialogFooter>
                    <Button type="button">Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
export default ShiftSettingsModal