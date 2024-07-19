import { useShiftModal } from '@/Hooks/useShiftModal';
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { usePage } from '@inertiajs/inertia-react';
import { Inertia, Page } from '@inertiajs/inertia';
import { PageProps } from '@/types';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from 'react-query';

const ShiftModal = () => {
    const {data,isOpen,onClose,dt} = useShiftModal();
    const {shifts} = usePage<Page<PageProps>>().props;
    const [shift_id, setShiftId] = useState("0");
    const [loading, setLoading] = useState<boolean>(false);
    
    const queryClient = useQueryClient();
    if(!data) return null;
    const onConfirm = () =>{
        const {id} = data;
        if(shift_id === "0") return toast.error('Please select a shift');
        Inertia.post(route('employee.shift',{id,date:dt||""}),{shift_id},{
            onStart:()=>setLoading(true),
            onFinish:()=>setLoading(false),
            onError:()=>toast.error('An error occurred. Please try again later.'),
            onSuccess:()=>{
                onClose();
                toast.success('Shift successfully changed');
                queryClient.removeQueries({ queryKey: ['attendances'] })
            },
            preserveState:false
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Employee Shift</DialogTitle>
                    <DialogDescription>
                        {`Change the shift schedule for ${data.first_name} ${data.last_name}`}
                    </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-y-3.5'>
                    <div className='space-y-1'>
                        <Label>Original Shift:</Label>
                        <Input value={`${!data.shift?'Shift Not Set':data.shift.schedule}`} readOnly />
                    </div>
                    <div className='space-y-1'>
                        <Label>New Shift:</Label>                        
                        <Select onValueChange={e=>setShiftId(e)} >
                            <SelectTrigger disabled={loading}>
                                <SelectValue placeholder="Select a Shift" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Shift Schedule</SelectLabel>
                                    {
                                        shifts.map((shift) =><SelectItem key={shift.id} value={shift.id.toString()}>{shift.schedule}</SelectItem>)
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button disabled={loading} onClick={onConfirm}>
                        {loading&&<Loader2 className="h-5 w-5 mr-2 animate-spin" />}
                        Save changes                        
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ShiftModal