
import { Team, User } from '@/types';
import {FC, FormEventHandler, useEffect} from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';

import { useForm } from '@inertiajs/inertia-react';
import { toast } from 'sonner';

import UserSelectionComboBox from '@/Pages/IndividualPerformance/UserSelectionComboBox';

import { Loader2 } from 'lucide-react';
import { QAGroup } from '@/types/QAElement';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';

interface Props {
    isOpen?:boolean;
    group?:QAGroup;
    onClose:()=>void;
    qa_users:User[];
}

const QAModal:FC<Props> = ({isOpen,group,onClose,qa_users}) => {
    const title = !!group?'Edit '+group.name:'Create QA Group';
    const description = !!group?'Edit the QA Group details below':'Fill in the form below to create a QA group';
    const {data,setData,processing,reset,post} = useForm({
        name:group?.name||'',
        user_id:group?.user_id
    });
    const onSubmit:FormEventHandler<HTMLFormElement> = e =>{
        e.preventDefault();
        if(data.name.trim().length<3) return toast.error('QA group name must be at least 3 characters long.');
        if(!data.user_id) return toast.error('Please select a QA.');
        const href = !!group?route('qa_group.update',{id:group.id}):route('qa_group.store');
        

        post(href,{
            onError:()=>toast.error('Failed to save QA group. Please try again.'),
            onSuccess:()=>{
                toast.success(`QA ${!group?'saved':'updated'} successfully.`);
                onClose();
            },
        })
    }

    useEffect(()=>{
        if(!isOpen) reset();
        if(isOpen && group){
            setData({
                name:group.name,
                user_id:group.user_id
            });
        }
    },[isOpen,group])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{`${title}`}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className='flex flex-col gap-y-3.5'>
                    <div className='flex flex-col gap-y-1'>
                        <Label>QA Group Name</Label>
                        <Input name='name' disabled={processing} value={data.name} onChange={e=>setData('name',e.currentTarget.value)} required autoFocus />
                    </div>
                    <div className='flex flex-col gap-y-1'>
                        <Label>QA User</Label>
                        <UserSelectionComboBox disabled={processing} isTeamLead users={qa_users} selectedUser={qa_users.find(u=>u.id===data.user_id)} onSelectUser={u=>(setData('user_id',u.id))} />
                    </div>
                    <Button size='sm' disabled={processing} className='ml-auto'>
                        {processing&&<Loader2 className='animate-spin h-5 w-5 mr-2' />}
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default QAModal;