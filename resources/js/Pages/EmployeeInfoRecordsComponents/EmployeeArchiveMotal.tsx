import { User } from '@/types';
import {FC, useState} from 'react';
import { useEmployeeArchiveMotal } from './EmployeeInfoHooks/useEmployeeArchiveMotal';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/Components/ui/alert-dialog';
import { Button } from '@/Components/ui/button';
import { Loader2 } from 'lucide-react';
import { Inertia } from '@inertiajs/inertia';
import { toast } from 'sonner';



const EmployeeArchiveMotal:FC = () => {
    const {isOpen,user,onClose} = useEmployeeArchiveMotal();
    const [loading,setLoading] = useState(false);

    const onSubmit = () =>{
        if(!user) return toast.error('Something went wrong. Please refresh the page and try again');
        Inertia.post(route('employee.archive',{id:user.id}),{},{
            preserveState:false,
            onSuccess:()=>{
                onClose();
                toast.success(`${user.first_name} ${user.last_name}, ${user.company_id} has been archived.`)
            },
            onError:()=>toast.error('Something went wrong. Please try again'),
            onStart:()=>setLoading(true),
            onFinish:()=>setLoading(false)
        });
    }

    return (
        <AlertDialog onOpenChange={onClose} open={isOpen}>
            <AlertDialogContent>
                {user && (                    
                    <AlertDialogHeader>
                        <AlertDialogTitle>{`Archive ${user.first_name} ${user.last_name}, ${user.company_id}`}</AlertDialogTitle>
                        <AlertDialogDescription>
                            This Employee will still be included in Attendance and Tardiness reports.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                )}                
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <Button onClick={onSubmit} variant='outline' disabled={loading}>
                        {loading && <Loader2 className='h-5 w-5 mr-2 animate-spin' />}
                        Continue
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default EmployeeArchiveMotal;