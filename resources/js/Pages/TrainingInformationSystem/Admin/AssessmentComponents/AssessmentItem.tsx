import Hint from '@/Components/Hint';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Separator } from '@/Components/ui/separator';
import { cn } from '@/lib/utils';
import { TrainingAssessment, TrainingFolder } from '@/types/trainingInfo';
import { format } from 'date-fns';
import { FileSymlink, MessageSquareShareIcon, PencilIcon, RecycleIcon, Trash2Icon, TriangleAlertIcon } from 'lucide-react';
import {FC, useMemo} from 'react';

interface Props {
    data:TrainingAssessment;
    onEdit:()=>void;
    mainFolder:TrainingFolder;
    onArchive:()=>void;
    onShare:()=>void;
    onOpenLinks:()=>void;
}

const AssessmentItem:FC<Props> = ({data,onEdit,mainFolder,onArchive,onShare,onOpenLinks}) => {
    return (
        <Hint label={<HintPanel onOpenLinks={onOpenLinks} onShare={onShare} onArchive={onArchive} data={data} onEdit={onEdit} />} side='right' >
            <div role='button' className='group flex h-36 hover:bg-muted-foreground/10 transition duration-300 w-auto rounded-lg items-center justify-center relative'>
                <div className='flex flex-row items-center gap-x-2.5 '>
                    <div className='flex flex-col gap-y-1 relative'>
                        {/* <TriangleAlertIcon className='h-8 w-8 text-red-500 stroke-[2.5px] absolute top-0.5 right-0.5  animate-ping' /> */}
                        <img className='h-24 w-[5.5rem]' src={`${route('public_route')}/assets/assessment.png`} alt="FPO" />
                        <Label className={cn('text-center text-xs',(data.questions?.length||0)===0&&'text-destructive')}>
                            {/* truncante the folder.name if too long */}
                            {data.title.length>8?data.title.slice(0,8)+'...':data.title}
                        </Label>
                    </div>
                </div>                
            </div>
        </Hint>
    );
};

export default AssessmentItem;


interface HintPanelProps {
    data:TrainingAssessment;
    onEdit:()=>void;
    onArchive:()=>void;
    onShare:()=>void;
    onOpenLinks:()=>void;
}

const HintPanel:FC<HintPanelProps> = ({data,onEdit,onArchive,onShare,onOpenLinks}) =>{
    return (
        <div className='flex flex-col gap-y-1 text-xs'>
            <p className='font-bold truncate'>{data.title}</p>
            <p>{`Created By: ${data.user.first_name} ${data.user.last_name}`} </p>
            <p>{`Created On: ${format(new Date(data.created_at),'Ppp')}`}</p>
            
            <Separator />
            <p className='font-semibold'>{(data.questions?.length||0).toString()} Question/s</p>
            <Separator />
            <p>Max Score: <span className='font-semibold'>{data.total_points}</span></p>
            <Separator />
            <p>Passing Score: <span className='font-semibold'>{data.pass_score.toString()}</span></p>
            <Separator />
            <div className='grid grid-cols-2'>
                <Button onClick={onEdit} className=' text-xs' variant='ghost' size='sm' ><PencilIcon className='h-4 w-4 mr-2' />Edit</Button>
                <Button onClick={onArchive} className=' text-xs' variant='ghost' size='sm' ><RecycleIcon className='h-4 w-4 mr-2' />Archive</Button>
                <Button onClick={onShare} className=' text-xs' variant='ghost' size='sm' ><MessageSquareShareIcon className='h-4 w-4 mr-2' />Share</Button>
                <Button onClick={onOpenLinks} className=' text-xs' variant='ghost' size='sm' ><FileSymlink className='h-4 w-4 mr-2' />Links</Button>
            </div>
        </div>
    );
}