import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { User } from '@/types';
import {FC, FormEventHandler} from 'react';
import { useForm } from '@inertiajs/inertia-react';
import { Button } from '@/Components/ui/button';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import UserSelectionComboBox from '@/Pages/IndividualPerformance/UserSelectionComboBox';
import QAUserSelectionBox from './QAUserSelectionComboBox';
import { QAGroup } from '@/types/QAElement';

interface Props {
    isOpen?:boolean;
    onClose:()=>void;
    group:QAGroup;
    unassigned_users:User[];
}

const AssignQAModal:FC<Props> = ({isOpen,onClose,group,unassigned_users}) => {
    const {data,setData,processing,reset,post} = useForm<{
        user?:User;
        qa_group_id:number
    }>({qa_group_id:group.id});

    const onSubmit:FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();
        post(route('qa_group.transfer',{qa_group_id:group.id}),{
            onSuccess:()=>{
                onClose();
                toast.success(`${data.user?.first_name} ${data.user?.last_name} has been successfully added to ${group.name}`);
            },
            onError:()=>toast.error('An error occurred. Please try again.')            
        });
    }

    const agentFullName = data.user ? `${data.user.first_name} ${data.user.last_name}` : '';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{`Assign to ${group.name}`}</DialogTitle>
                    <DialogDescription>
                        Select an agent to assign to the QA group.
                    </DialogDescription>
                </DialogHeader>
                <form className='flex flex-col gap-y-3.5' onSubmit={onSubmit}>
                    <div className='flex flex-col gap-y-1'>
                        <Label>Agents with unassigned QA:</Label>
                        <QAUserSelectionBox disabled={processing} selectedUser={data.user} users={unassigned_users} onSelectUser={e=>setData('user',e)} isQA={true} />
                    </div>
                    <p className='w-full text-center'>{!data.user?'Select an Agent to Continue':`Assign ${agentFullName} to ${group.name}?`}</p>
                    <Button size='sm' disabled={processing|| !data.user} className='ml-auto'>
                        {processing && <Loader2Icon className='w-5 h-5 animate-spin ml-2' />}
                        Proceed
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AssignQAModal;