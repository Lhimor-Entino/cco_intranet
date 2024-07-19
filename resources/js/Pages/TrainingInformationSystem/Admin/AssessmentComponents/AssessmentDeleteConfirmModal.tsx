import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/Components/ui/alert-dialog';
import { Button } from '@/Components/ui/button';
import { TrainingAssessment } from '@/types/trainingInfo';
import { useForm } from '@inertiajs/inertia-react';
import { Loader2 } from 'lucide-react';
import {FC} from 'react';
import { toast } from 'sonner';

interface Props {
    isOpen:boolean;
    data:TrainingAssessment;
    onClose:()=>void;
}

const AssessmentDeleteConfirmModal:FC<Props> = ({isOpen,data,onClose}) => {
    const {processing,post} = useForm();
    const onDelete = () => {
        post(route('assessment.destroy',{id:data.id}),{
            onSuccess:()=>{
                toast.success(`Assessment '${data.title}' deleted  successfully.`);
                onClose();
            },
            onError:()=>toast.error('An error occurred. Please try again.')
        });
    };
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Archive assessment {data.title}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will delete the assessment and all of its questions but will not affect the scores of the users who have taken it.
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

export default AssessmentDeleteConfirmModal;