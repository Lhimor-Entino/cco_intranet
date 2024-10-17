
import { Button } from '@/Components/ui/button';
import { TableCell, TableRow } from '@/Components/ui/table';
import { isInSecondsOrMinutes, minutesToHHMMSS, roundWithFormat } from '@/lib/utils';
import { IndividualPerformanceMetric } from '@/types/metric';
import { QAElement } from '@/types/QAElement';
import { get, round } from 'lodash';
import { Grip, PencilIcon, Trash2Icon } from 'lucide-react';
import {FC} from 'react';
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

interface Props {
    element:QAElement;
    onEdit:(element:QAElement)=>void;
    onDelete:(element:QAElement)=>void;
    provided: DraggableProvided;
    snapshot: DraggableStateSnapshot;
}

const ElementItem:FC<Props> = ({element,onEdit,onDelete,provided,snapshot}) => {
    
    const grid = 8;
    const getItemStyle = (isDragging: boolean, draggableStyle:any) => ({
        // change background colour if dragging
        background: isDragging ? "rgba(255, 255, 255, 0.2)" : "transparent",
        // styles we need to apply on draggables
        ...draggableStyle
      });
    return (
        <TableRow  ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}  key={element.id}>
            <TableCell>{`${element.position}`}</TableCell>
            <TableCell className="font-medium">{element.qa_element}</TableCell>
            <TableCell>{`${element.user.first_name} ${element.user.last_name}`}</TableCell>
            <TableCell>{  (element.goal)  < 1 ? "No Max Score" : element.goal }</TableCell>
            <TableCell className='flex items-center gap-x-2 justify-end'>
                <Button size='icon' onClick={()=>onEdit(element)}  variant='secondary'>
                    <PencilIcon />
                </Button>
                <Button onClick={()=>onDelete(element)} size='icon' variant='destructive'>
                    <Trash2Icon />
                </Button>
            </TableCell>
        </TableRow>
    );
};

export default ElementItem;