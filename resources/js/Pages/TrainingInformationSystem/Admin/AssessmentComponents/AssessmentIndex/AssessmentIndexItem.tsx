import { Button } from '@/Components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/Components/ui/table';
import { TrainingAssessment, TrainingAssessmentResult } from '@/types/trainingInfo';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import {FC} from 'react';

interface Props {
    result:TrainingAssessmentResult;
    onManualCheck:()=>void;
}

const AssessmentIndexItem:FC<Props> = ({result,onManualCheck}) => {
    const agent = result.user.first_name + " " + result.user.last_name;
    const manualCheckedBy = result.checked_by_id ? result.checked_by.first_name + " " + result.checked_by.last_name : 'N/A';    
    const remarks = 
        !!result.checked_by_id?
            result.user_score >= result.passing_score?'Passed':'Failed'
            :
            'Needs manual checking'
    return (
        <TableRow className='text-xs'>            
            <TableCell>
                <div className='space-y-1'>
                    <p className='text-xs'>{agent}</p>
                    <p className='text-xs'>{result.user.company_id}</p>
                </div>
            </TableCell>
            <TableCell>{result.assessment?.title||'N/A or Deleted'}</TableCell>
            <TableCell>{result.max_score}</TableCell>
            <TableCell>{result.passing_score}</TableCell>
            <TableCell>{result.user_score}</TableCell>
            <TableCell>
                <div className='space-y-1'>
                    <p>{manualCheckedBy}</p>
                    {result.date_checked && <p>{format(result.date_checked,'P')}</p>}
                </div>
            </TableCell>
            <TableCell>
                <div className='space-y-1'>
                    <p>{format(result.created_at,'PP')}</p>
                    <p>{format(result.created_at,'pp')}</p>
                </div>
            </TableCell>
            <TableCell>{remarks}</TableCell>
            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='text-xs' align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem className='cursor-pointer' onClick={onManualCheck}>
                            Manual Check
                        </DropdownMenuItem>
                        {/* <DropdownMenuSeparator /> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>

        </TableRow>
    );
};

export default AssessmentIndexItem;