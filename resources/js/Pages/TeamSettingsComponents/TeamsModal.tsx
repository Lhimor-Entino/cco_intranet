import { Team, User } from '@/types';
import {FC, FormEventHandler, useEffect} from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../Components/ui/dialog';
import { Label } from '../../Components/ui/label';
import { useForm } from '@inertiajs/inertia-react';
import { toast } from 'sonner';
import { Input } from '../../Components/ui/input';
import UserSelectionComboBox from '@/Pages/IndividualPerformance/UserSelectionComboBox';
import { Button } from '../../Components/ui/button';
import { Loader2 } from 'lucide-react';

interface Props {
    isOpen?:boolean;
    team?:Team;
    onClose:()=>void;
    teamLeads:User[];
}

const TeamsModal:FC<Props> = ({isOpen,team,onClose,teamLeads}) => {
    const title = !!team?'Edit '+team.name:'Create Team';
    const description = !!team?'Edit the team details below':'Fill in the form below to create a new team';
    const {data,setData,processing,reset,post} = useForm({
        name:team?.name||'',
        user_id:team?.user_id
    });
    const onSubmit:FormEventHandler<HTMLFormElement> = e =>{
        e.preventDefault();
        if(data.name.trim().length<3) return toast.error('Team name must be at least 3 characters long.');
        if(!data.user_id) return toast.error('Please select a team leader.');
        const href = !!team?route('team.update',{id:team.id}):route('team.store');
        

        post(href,{
            onError:()=>toast.error('Failed to save team. Please try again.'),
            onSuccess:()=>{
                toast.success(`Team ${!team?'saved':'updated'} successfully.`);
                onClose();
            },
        })
    }

    useEffect(()=>{
        if(!isOpen) reset();
        if(isOpen && team){
            setData({
                name:team.name,
                user_id:team.user_id
            });
        }
    },[isOpen,team])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{`${title}`}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className='flex flex-col gap-y-3.5'>
                    <div className='flex flex-col gap-y-1'>
                        <Label>Team Name</Label>
                        <Input name='name' disabled={processing} value={data.name} onChange={e=>setData('name',e.currentTarget.value)} required autoFocus />
                    </div>
                    <div className='flex flex-col gap-y-1'>
                        <Label>Team Leader</Label>
                        <UserSelectionComboBox disabled={processing} isTeamLead users={teamLeads} selectedUser={teamLeads.find(u=>u.id===data.user_id)} onSelectUser={u=>(setData('user_id',u.id))} />
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

export default TeamsModal;