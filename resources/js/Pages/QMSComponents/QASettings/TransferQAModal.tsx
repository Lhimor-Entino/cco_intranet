import TeamsComboBox from '@/Components/TeamsComboBox';
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Team, User } from '@/types';
import { QAGroup } from '@/types/QAElement';
import { useForm } from '@inertiajs/inertia-react';
import { Loader2Icon } from 'lucide-react';
import {FC, FormEventHandler, useState} from 'react';
import { toast } from 'sonner';
import QAGroupComboBox from './QAGroupComboBox';

interface Props {
    isOpen?:boolean;
    onClose:()=>void;
    agent:User;
    groups:QAGroup[];
}

const TransferQAModal:FC<Props> = ({isOpen,onClose,agent,groups}) => {
    const [group,setGroup] = useState<QAGroup>();
    const {data,setData,processing,reset,post} = useForm<{
        user:User;
    }>({user:agent});

    const onSubmit:FormEventHandler<HTMLFormElement> = e => {
        if(!group) return toast.error('Please select a QA group to continue.');
        e.preventDefault();
        post(route('qa_group.transfer',{qa_group_id:group.id}),{
            onSuccess:()=>{
                onClose();
                toast.success(`${data.user?.first_name} ${data.user?.last_name} has been successfully transfered to ${group.name}`);
            },
            onError:()=>toast.error('An error occurred. Please try again.')            
        })
    }

    const agentFullName = data.user ? `${data.user.first_name} ${data.user.last_name}` : '';
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='md:min-w-[720px]'>
                <DialogHeader>
                    <DialogTitle>{`Transfer ${agentFullName}`}</DialogTitle>
                </DialogHeader>
                <form className='flex flex-col gap-y-3.5' onSubmit={onSubmit}>
                    <div className='flex flex-col gap-y-1'>
                        <Label>QA Groups:</Label>
                        <QAGroupComboBox selectedGroup={group} className='md:w-full' disabled={processing} groups={groups} onGroupSelect={setGroup} />
                    </div>
                    <p className='w-full text-center'>{!group?'Select a QA group to Continue Transfer':`Transfer ${agentFullName} to ${group.name}?`}</p>
                    <Button size='sm' disabled={processing|| !group} className='ml-auto'>
                        {processing && <Loader2Icon className='w-5 h-5 animate-spin ml-2' />}
                        Proceed
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default TransferQAModal;