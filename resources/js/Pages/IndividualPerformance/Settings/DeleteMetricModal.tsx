import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/Components/ui/alert-dialog';
import { Button } from '@/Components/ui/button';
import { IndividualPerformanceMetric } from '@/types/metric';
import { useForm } from '@inertiajs/inertia-react';
import { Loader2 } from 'lucide-react';
import {FC} from 'react';
import { toast } from 'sonner';

interface Props {
    isOpen:boolean;
    metric:IndividualPerformanceMetric;
    onClose:()=>void;
}

const DeleteMetricModal:FC<Props> = ({isOpen,metric,onClose}) => {
    const {post,processing} = useForm();
    const onDelete = () => post(route('individual_performance_dashboard.destroy',{metric_id:metric.id}),{
        onSuccess:()=>{
            onClose();
            toast.success('Metric deleted successfully');
        },
        onError:()=>toast.error('An error occurred while deleting metric. Please try again')
    });
    return (
        <AlertDialog onOpenChange={onClose} open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete {metric.metric_name}</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently this metric from the system.
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

export default DeleteMetricModal;