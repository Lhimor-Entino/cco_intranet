import Hint from '@/Components/Hint';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { Separator } from '@/Components/ui/separator';
import { TrainingFolder } from '@/types/trainingInfo';
import { Inertia } from '@inertiajs/inertia';
import { format } from 'date-fns';
import { FolderIcon, FolderOpenIcon, MoreVerticalIcon, PencilIcon, PencilLine, Trash2, Trash2Icon } from 'lucide-react';
import {FC, MouseEventHandler, ReactNode, useState} from 'react';

interface Props {
    folder:TrainingFolder;
    onDelete: (folder:TrainingFolder) => void;
    onEdit: (folder:TrainingFolder) => void;
}

const MainFolderItem:FC<Props> = ({folder,onDelete,onEdit}) => {
    const imgHref = `${route('public_route')}/assets/${folder.sub_folder_count!==0?'folder':'folder_empty'}.png`;
    return (
        <Hint label={<HintPanel onDelete={()=>onDelete(folder)} onEdit={()=>onEdit(folder)}  folder={folder} />} side='right' >
            <div onClick={()=>Inertia.get(route('training_info_system.admin',{id:folder.id}))} role='button' className='group flex h-36 hover:bg-muted-foreground/10 transition duration-300 w-auto rounded-lg items-center justify-center relative'>
                <div className='flex flex-row items-center gap-x-2.5 '>
                    <div className='flex flex-col gap-y-1'>
                        <img className='h-24 w-[5.5rem]' src={imgHref} alt="FPO" />
                        <Label className='text-center text-xs'>
                            {/* truncante the folder.name if too long */}
                            {folder.name.length>8?folder.name.slice(0,8)+'...':folder.name}
                        </Label>
                    </div>
                </div>                
            </div>
        </Hint>
    );
};

export default MainFolderItem;

interface HintPanelProps {
    folder:TrainingFolder;    
    onDelete: () => void;
    onEdit: () => void;
}

const HintPanel:FC<HintPanelProps> = ({folder,onDelete,onEdit}) =>{    
    return (
        <div className='flex flex-col gap-y-1 text-xs'>
            <p>
                <span className='font-bold truncate'>{folder.name}</span>
                {folder.sub_folder_count===0&&<span className='italic text-muted-foreground'>&nbsp;(empty)</span>}
            </p>
            <p>{`Created By: ${folder.user.first_name} ${folder.user.last_name}`} </p>
            <p>{`Created On: ${format(new Date(folder.created_at),'Ppp')}`}</p>
            <Separator />
            <p className='font-semibold'>Project/s:</p>
            <div className='gap-1 grid grid-cols-2'>
                {folder.projects.map(project=><p key={project.id} className='text-xs'>{project.name}</p>)}
            </div>
            <Separator />
            <p className='text-center'>{`${folder.sub_folder_count.toString()} items`}</p>
            <Separator />
            <div className='flex flex-row'>
                <Button onClick={onEdit} className='w-1/2 text-xs' variant='ghost' size='sm' ><PencilIcon className='h-4 w-4 mr-2' />Edit</Button>
                <Button onClick={onDelete} className='w-1/2 text-xs' variant='ghost' size='sm' ><Trash2Icon className='h-4 w-4 mr-2' />Delete</Button>
            </div>
        </div>
    );
}