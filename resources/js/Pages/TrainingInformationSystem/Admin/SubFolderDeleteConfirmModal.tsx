import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/Components/ui/alert-dialog';
import { Button } from '@/Components/ui/button';
import { TrainingSubFolder } from '@/types/trainingInfo';
import { useForm } from '@inertiajs/inertia-react';
import { Loader2 } from 'lucide-react';
import {FC} from 'react';
import { toast } from 'sonner';

interface Props {    
    folder:TrainingSubFolder;
    onClose: () => void;
    isOpen: boolean;
}

const SubFolderDeleteConfirmModal:FC<Props> = ({folder,onClose,isOpen}) => {
    const {processing,post} = useForm();
    const onDelete = () => {
        post(route('training_folder.sub.destroy',{id:folder.id}),{
            onSuccess:()=>{
                toast.success(`Folder '${folder.name}' deleted  successfully.`);
                onClose();
            },
            onError:()=>toast.error('An error occurred. Please try again.')
        });
    };
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete folder {folder.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will delete this folder and all subfolders and files in it.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
                    <Button onClick={onDelete} disabled={processing}>
                        {processing && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
                        Continue
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default SubFolderDeleteConfirmModal;