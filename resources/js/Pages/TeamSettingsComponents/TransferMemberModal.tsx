import TeamsComboBox from '@/Components/TeamsComboBox';
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Team, User } from '@/types';
import { useForm } from '@inertiajs/inertia-react';
import { Loader2Icon } from 'lucide-react';
import {FC, FormEventHandler, useState} from 'react';
import { toast } from 'sonner';

interface Props {
    isOpen?:boolean;
    onClose:()=>void;
    agent:User;
    teams:Team[];
}

const TransferMemberModal:FC<Props> = ({isOpen,onClose,agent,teams}) => {
    const [team,setTeam] = useState<Team>();
    const {data,setData,processing,reset,post} = useForm<{
        user:User;
    }>({user:agent});

    const onSubmit:FormEventHandler<HTMLFormElement> = e => {
        if(!team) return toast.error('Please select a team to continue.');
        e.preventDefault();
        post(route('team.transfer',{team_id:team.id}),{
            onSuccess:()=>{
                onClose();
                toast.success(`${data.user?.first_name} ${data.user?.last_name} has been successfully transfered to ${team.name}`);
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
                        <Label>Teams:</Label>
                        <TeamsComboBox selectedTeam={team} className='md:w-full' disabled={processing} teams={teams} onTeamSelect={setTeam} />
                    </div>
                    <p className='w-full text-center'>{!team?'Select a Team to Continue Transfer':`Transfer ${agentFullName} to ${team.name}?`}</p>
                    <Button size='sm' disabled={processing|| !team} className='ml-auto'>
                        {processing && <Loader2Icon className='w-5 h-5 animate-spin ml-2' />}
                        Proceed
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default TransferMemberModal;