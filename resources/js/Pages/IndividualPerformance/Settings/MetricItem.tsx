import { Button } from '@/Components/ui/button';
import { TableCell, TableRow } from '@/Components/ui/table';
import { minutesToHHMMSS } from '@/lib/utils';
import { IndividualPerformanceMetric } from '@/types/metric';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import {FC} from 'react';

interface Props {
    metric:IndividualPerformanceMetric;
    onEdit:(metric:IndividualPerformanceMetric)=>void;
    onDelete:(metric:IndividualPerformanceMetric)=>void;
}

const MetricItem:FC<Props> = ({metric,onEdit,onDelete}) => {
    return (
        <TableRow key={metric.id}>
            <TableCell className="font-medium">{metric.metric_name}</TableCell>
            <TableCell>{`${metric.user.first_name} ${metric.user.last_name}`}</TableCell>
            <TableCell className='capitalize'>{`${metric.format}`}</TableCell>
            <TableCell className='capitalize'>{`${metric.unit}`}</TableCell>
            <TableCell>{parseInt(metric.daily_goal) < 1 ? "No Daily Goal" : metric.daily_goal}</TableCell>
            <TableCell className='flex items-center gap-x-2 justify-end'>
                <Button size='icon' onClick={()=>onEdit(metric)}  variant='secondary'>
                    <PencilIcon />
                </Button>
                <Button onClick={()=>onDelete(metric)} size='icon' variant='destructive'>
                    <Trash2Icon />
                </Button>
            </TableCell>
        </TableRow>
    );
};

export default MetricItem;