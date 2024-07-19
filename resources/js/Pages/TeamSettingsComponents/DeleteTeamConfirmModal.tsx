import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/Components/ui/alert-dialog';
import { Button } from '@/Components/ui/button';
import { Team } from '@/types';
import { useForm } from '@inertiajs/inertia-react';
import { Loader2Icon, Trash2, Trash2Icon } from 'lucide-react';
import {FC} from 'react';
import { toast } from 'sonner';

interface Props {
    isOpen:boolean;
    onClose:()=>void;
    team:Team;
    setOpen:(open:boolean)=>void;
}

const DeleteTeamConfirmModal:FC<Props> = ({isOpen,onClose,team,setOpen}) => {
    const {post,processing} = useForm();
    const onSubmit = () => {
        const {id} = team
        post(route('team.destroy',{id}),{
            onError:()=>toast.error('Failed to delete team. Please try again.'),
            onSuccess:()=>{
                toast.success(`${team.name} has been successfully deleted.`);
                onClose();
            }
        });
    }
    return (
        <AlertDialog open={isOpen} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <Trash2Icon className='w-5 h-5 mr-2' />
                    Delete Team
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will delete the team <strong>{team.name}</strong>. All agents will be unassigned from this team.
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

export default DeleteTeamConfirmModal;