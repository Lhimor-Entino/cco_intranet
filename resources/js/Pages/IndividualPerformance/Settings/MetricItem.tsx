import { Button } from '@/Components/ui/button';
import { TableCell, TableRow } from '@/Components/ui/table';
import { isInSecondsOrMinutes, minutesToHHMMSS } from '@/lib/utils';
import { IndividualPerformanceMetric } from '@/types/metric';
import { get } from 'lodash';
import { Grip, PencilIcon, Trash2Icon } from 'lucide-react';
import {FC} from 'react';
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

interface Props {
    metric:IndividualPerformanceMetric;
    onEdit:(metric:IndividualPerformanceMetric)=>void;
    onDelete:(metric:IndividualPerformanceMetric)=>void;
    provided: DraggableProvided;
    snapshot: DraggableStateSnapshot;
}

const MetricItem:FC<Props> = ({metric,onEdit,onDelete,provided,snapshot}) => {
    
    const grid = 8;
    const getItemStyle = (isDragging: boolean, draggableStyle:any) => ({
        // change background colour if dragging
        background: isDragging ? "rgba(255, 255, 255, 0.2)" : "transparent",
        // styles we need to apply on draggables
        ...draggableStyle
      });
    return (
        <TableRow  ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}  key={metric.id}>
            <TableCell>{`${metric.position}`}</TableCell>
            <TableCell className="font-medium">{metric.metric_name}</TableCell>
            <TableCell>{`${metric.user.first_name} ${metric.user.last_name}`}</TableCell>
            <TableCell className='capitalize'>{`${metric.format}`}</TableCell>
            <TableCell className='capitalize'>{`${metric.unit}`}</TableCell>
            {/* <TableCell>{  parseInt(metric.daily_goal) < 1 ? "No Daily Goal" : metric.daily_goal} {parseInt(metric.daily_goal)} {metric.daily_goal}</TableCell> */}
            <TableCell>{ metric.unit === "Minutes" || metric.unit ==="Seconds" ?  isInSecondsOrMinutes(metric.unit || "",metric.daily_goal)  < 1 ? "No Daily Goal" : metric.daily_goal : parseFloat(metric.daily_goal) < 1 ? "No Daily Goal" : metric.daily_goal}</TableCell>
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