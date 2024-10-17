
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/Components/ui/alert-dialog';
import { Button } from '@/Components/ui/button';
import { Team } from '@/types';
import { QAGroup } from '@/types/QAElement';
import { useForm } from '@inertiajs/inertia-react';
import { Loader2Icon, Trash2, Trash2Icon } from 'lucide-react';
import {FC} from 'react';
import { toast } from 'sonner';

interface Props {
    isOpen:boolean;
    onClose:()=>void;
    group:QAGroup;
    setOpen:(open:boolean)=>void;
}

const DeleteQAGroup:FC<Props> = ({isOpen,onClose,group,setOpen}) => {
    const {post,processing} = useForm();
    const onSubmit = () => {
        const {id} = group
        post(route('qa_group.destroy',{id}),{
            onError:()=>toast.error('Failed to delete QA. Please try again.'),
            onSuccess:()=>{
                toast.success(`${group.name} has been successfully deleted.`);
                onClose();
            }
        });
    }
    return (
        <AlertDialog open={isOpen} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <Trash2Icon className='w-5 h-5 mr-2' />
                    Delete QA Group
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will delete the QA <strong>{group.name}</strong>. All agents will be unassigned from this QA.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
                    <Button onClick={onSubmit} disabled={processing}>
                        {processing && <Loader2Icon className='w-5 h-5 animate-spin ml-2' />}
                        Continue
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteQAGroup;