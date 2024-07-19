import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Team, User } from '@/types';
import {FC, FormEventHandler} from 'react';
import UserSelectionComboBox from '../IndividualPerformance/UserSelectionComboBox';
import { useForm } from '@inertiajs/inertia-react';
import { Button } from '@/Components/ui/button';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    isOpen?:boolean;
    onClose:()=>void;
    team:Team;
    teamLessAgents:User[];
}

const AddMemberToTeamModal:FC<Props> = ({isOpen,onClose,team,teamLessAgents}) => {
    const {data,setData,processing,reset,post} = useForm<{
        user?:User;
        team_id:number
    }>({team_id:team.id});

    const onSubmit:FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();
        post(route('team.transfer',{team_id:team.id}),{
            onSuccess:()=>{
                onClose();
                toast.success(`${data.user?.first_name} ${data.user?.last_name} has been successfully added to ${team.name}`);
            },
            onError:()=>toast.error('An error occurred. Please try again.')            
        })
    }

    const agentFullName = data.user ? `${data.user.first_name} ${data.user.last_name}` : '';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{`Assign to ${team.name}`}</DialogTitle>
                    <DialogDescription>
                        Select an agent to assign to the team.
                    </DialogDescription>
                </DialogHeader>
                <form className='flex flex-col gap-y-3.5' onSubmit={onSubmit}>
                    <div className='flex flex-col gap-y-1'>
                        <Label>Agents with no Team:</Label>
                        <UserSelectionComboBox disabled={processing} selectedUser={data.user} users={teamLessAgents} onSelectUser={e=>setData('user',e)} isTeamLead={true} />
                    </div>
                    <p className='w-full text-center'>{!data.user?'Select an Agent to Continue':`Assign ${agentFullName} to ${team.name}?`}</p>
                    <Button size='sm' disabled={processing|| !data.user} className='ml-auto'>
                        {processing && <Loader2Icon className='w-5 h-5 animate-spin ml-2' />}
                        Proceed
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddMemberToTeamModal;