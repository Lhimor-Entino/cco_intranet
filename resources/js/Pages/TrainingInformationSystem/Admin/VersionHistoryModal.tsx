import { Button } from '@/Components/ui/button';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Separator } from '@/Components/ui/separator';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/Components/ui/sheet';
import { TrainingFolder, TrainingTopic } from '@/types/trainingInfo';
import { Inertia } from '@inertiajs/inertia';
import { format } from 'date-fns';
import { FC, version } from 'react';

interface Props {
    isOpen:boolean;
    onClose:()=>void;
    topic:TrainingTopic;
    mainFolder:TrainingFolder;
}

const VersionHistoryModal:FC<Props> = ({isOpen,onClose,topic,mainFolder}) => {
    const {versions} = topic;
    const navigate = (topicId:number,version:string|undefined) =>{
        Inertia.get(route('training_info_system.edit2',{main_folder_id:mainFolder.id,id:topicId,version}),{},{
            preserveState:false,
        });
    }
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side='right' className='h-full flex flex-col min-w-[100vw] lg:min-w-[41rem] z-[50000] '>
                <SheetHeader>
                    <SheetTitle>{topic.title} Version History</SheetTitle>
                    <SheetDescription>
                        <span className='flex items-center gap-x-2'>
                            <span className='text-xs'>Current Version:</span>
                            <span className='text-xs font-semibold'>{topic.current_version?.version}</span>
                        </span>                    
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className='flex-1 pr-8'>
                    {versions.map((version) => (
                        <div key={version.id}  className='flex flex-row items-center justify-between mb-3.5 border-b border-b-muted-foreground/50'>
                            <div className='flex flex-col gap-y-1'>
                                <div className='flex items-center gap-x-2'>
                                    <span className='text-xs'>Version:</span>
                                    <span className='text-xs font-semibold'>{version.version}</span>
                                </div>
                                <div className='flex items-center gap-x-2'>
                                    <span className='text-xs'>Created By:</span>
                                    <span className='text-xs font-semibold'>{`${version.user.first_name} ${version.user.last_name}`}</span>
                                </div>
                                <div className='flex items-center gap-x-2'>
                                    <span className='text-xs'>Created At:</span>
                                    <span className='text-xs font-semibold'>{format(new Date(version.created_at),'PPp')}</span>
                                </div>
                            </div>
                            <Button onClick={()=>navigate(version.training_topic_id,version.version)} size='sm' variant='secondary'>View</Button>
                        </div>
                    ))}
                </ScrollArea>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="submit">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default VersionHistoryModal;