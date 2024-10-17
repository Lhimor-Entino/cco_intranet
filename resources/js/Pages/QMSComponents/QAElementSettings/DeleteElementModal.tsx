import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/Components/ui/alert-dialog';
import { Button } from '@/Components/ui/button';
import { IndividualPerformanceMetric } from '@/types/metric';
import { QAElement } from '@/types/QAElement';
import { useForm } from '@inertiajs/inertia-react';
import { Loader2 } from 'lucide-react';
import {FC} from 'react';
import { toast } from 'sonner';

interface Props {
    isOpen:boolean;
    element:QAElement;
    onClose:()=>void;
}

const DeleteElementModal:FC<Props> = ({isOpen,element,onClose}) => {
    const {post,processing} = useForm();
    const onDelete = () => post(route('quality_management_system.destroy',{id:element.id}),{
        onSuccess:()=>{
            onClose();
            toast.success('QA Element deleted successfully');
        },
        onError:()=>toast.error('An error occurred while deleting metric. Please try again')
    });
    return (
        <AlertDialog onOpenChange={onClose} open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete {element.qa_element}</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently this QA Element from the system.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
                    <Button onClick={onDelete} disabled={processing}>
                        {processing && <Loader2 className='animate-spin mr-2 h-5 w-5' />}
                        Delete
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteElementModal;