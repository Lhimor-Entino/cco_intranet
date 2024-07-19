import { Button } from '@/Components/ui/button';
import { TrainingFolder, TrainingTopic } from '@/types/trainingInfo';
import { Inertia } from '@inertiajs/inertia';
import { Link, useForm } from '@inertiajs/inertia-react';
import { LockIcon, LockOpenIcon, LogOutIcon, Plus, SquarePenIcon } from 'lucide-react';
import {FC, useState} from 'react';
import { toast } from 'sonner';
import TrainingTopicInfoModal from './TrainingTopicInfoModal';

interface Props {
    topic?:TrainingTopic;
    mainFolder?:TrainingFolder;
}

const TraningInfoHeader:FC<Props> = ({topic,mainFolder}) => {
    const isAdminRoute = route().current('training_info_system.admin');
    const label = topic?topic.title:`Training Information System ${isAdminRoute?'Settings':''}`;
    const [showModal,setShowModal] = useState(false);
    return (
        <>
            <div className='flex flex-col gap-y-2 md:gap-y-0 md:flex-row md:items-center md:justify-between'>
                <div className='flex flex-row items-center w-full'>
                    <h1 className='text-2xl font-bold md:flex-1'>{label}</h1>
                    {!!topic&&(<Button onClick={()=>setShowModal(true)} variant='outline' size='icon' className='ml-2.5 opacity-50 hover:opacity-100 rounded-full'>
                        <SquarePenIcon className='h-5 w-5' />
                    </Button>)}
                    <Link href={route('assessment.index')}>
                        <Button size='sm' className='ml-auto' variant='secondary'>
                            View Assessment Results
                        </Button>
                    </Link>
                </div>
            </div>
            {!!topic && <TrainingTopicInfoModal isOpen={showModal} onClose={()=>setShowModal(false)} topic={topic} />}
        </>
    );
};

export default TraningInfoHeader;
