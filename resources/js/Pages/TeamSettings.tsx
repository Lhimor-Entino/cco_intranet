import Layout from '@/Components/Layout/Layout';
import TeamsModal from '@/Pages/TeamSettingsComponents/TeamsModal';
import TeamsComboBox from '@/Components/TeamsComboBox';
import { Button } from '@/Components/ui/button';
import { PageProps, Team, User } from '@/types';
import { Inertia, Page } from '@inertiajs/inertia';
import { Head, useForm, usePage } from '@inertiajs/inertia-react';
import { ArrowLeftRight, Edit3Icon, PackagePlus, UserPlus2, UserPlus2Icon, UserRoundXIcon } from 'lucide-react';
import {FC, FormEventHandler, useState} from 'react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Label } from '@/Components/ui/label';
import { format } from 'date-fns';
import { Separator } from '@/Components/ui/separator';
import AddMemberToTeamModal from './TeamSettingsComponents/AddMemberToTeamModal';
import TransferMemberModal from './TeamSettingsComponents/TransferMemberModal';
import UnassignMemberModal from './TeamSettingsComponents/UnassignMemberModal';
import DeleteTeamConfirmModal from './TeamSettingsComponents/DeleteTeamConfirmModal';

interface Props {
    teams:Team[]
    team:Team;
    team_leads:User[];
    teamless_agents:User[];
}

const TeamSettings:FC<Props> = ({team,team_leads,teams,teamless_agents}) => {
    const [showAddMemberModal,setShowAddMemberModal] = useState(false);
    const [showTransferMemberModal,setShowTransferMemberModal] = useState<User>();
    const [deleteTeamModal,setDeleteTeamModal] = useState(false);
    const {users} = team;
    const {data,setData,processing,reset,post} = useForm({
        name:'',
        user_id:team.user_id as number|undefined
    });
    const [teamForm,setTeamForm] = useState<{show?:boolean;edit?:boolean}>({});
    const handleToggleShowForm = (edit?:boolean) => setTeamForm(val=>({show:!val.show,edit})); 
    const [unassignAgent,setUnassignAgent] = useState<User>();
const {projects} = usePage<Page<PageProps>>().props
    return (
        <>
            <Head title="Team Settings" />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container pb-2.5 overflow-y-auto'>
                    <div className='h-14 flex items-center gap-x-2'>
                        <TeamsComboBox className='flex-1' teams={teams} size='sm' disabled={processing} selectedTeam={team} onTeamSelect={t=>Inertia.get(route('team.index',{team_id:t.id}))} />
                        <div className="flex items-center">
                            <Button onClick={()=>handleToggleShowForm()} size='sm' variant='secondary' className="rounded-r-none border-r-0 gap-x-2 border border-muted-foreground">
                                <PackagePlus className="h-5 w-5" /> <span className='hidden md:inline'>Create a Team</span> 
                            </Button>
                            <Button onClick={()=>handleToggleShowForm(true)} className="rounded-l-none rounded-r-none gap-x-2 border border-muted-foreground" size='sm' variant='secondary'>
                                <span className='hidden md:inline'>Edit Team</span> <Edit3Icon className="h-5 w-5" />
                            </Button>
                            <Button onClick={()=>setShowAddMemberModal(true)} className="rounded-l-none border-l-0 gap-x-2 border border-muted-foreground" size='sm' variant='secondary'>
                                <span className='hidden md:inline'>Add Team Member</span> <UserPlus2Icon className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                    <Separator />
                    <div className='flex-1 overflow-y-auto flex flex-col gap-y-2.5'>
                        <div className='flex items-center justify-between h-16 md:gap-x-0 gap-x-2'>
                            <div className='w-full md:w-1/3 flex flex-col gap-y-1 text-sm'>
                                <div className='flex items-center justify-between'>
                                    <Label>Team Name:</Label>
                                    <span>{team.name}</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <Label>Team Lead:</Label>
                                    <span>{team.user?.first_name} {team.user?.last_name}</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <Label>Total Members:</Label>
                                    <span>{users.length} Total Members</span>
                                </div>
                            </div>
                            <DeleteTeamConfirmModal setOpen={setDeleteTeamModal} isOpen={deleteTeamModal} onClose={()=>setDeleteTeamModal(false)} team={team} />
                        </div>
                        <Separator />
                        <Table className='flex-1 overflow-y-auto'>
                            <TableHeader className='bg-background sticky top-0'>
                                <TableRow>
                                    <TableHead className="w-[100px]">Agent</TableHead>
                                    <TableHead>Project</TableHead>
                                    <TableHead>Company ID</TableHead>
                                    <TableHead>Join Date</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map(u => (
                                    <TableRow key={u.id}>
                                        <TableCell className="font-medium w-72">{u.first_name} {u.last_name}</TableCell>
                                        <TableCell>{u.project?.name||'No Project'}</TableCell>
                                        <TableCell>{u.company_id}</TableCell>
                                        <TableCell>{!u.team_join_date?'N/A':format(new Date(u.team_join_date),'PPP')}</TableCell>
                                        <TableCell className="flex items-center justify-end">
                                            <Button onClick={()=>setShowTransferMemberModal(u)} size='sm' variant='outline' className='rounded-r-none border-r-0'>
                                                <ArrowLeftRight className='h-5 w-5 mr-2' />
                                                Transfer
                                            </Button>
                                            <Button onClick={()=>setUnassignAgent(u)} size='sm' variant='outline' className='rounded-l-none'>
                                                Unassign
                                                <UserRoundXIcon className='h-5 w-5 ml-2' />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </Layout>
            <TeamsModal isOpen={teamForm.show} team={teamForm.edit?team:undefined} onClose={()=>handleToggleShowForm()} teamLeads={team_leads} />
            <AddMemberToTeamModal isOpen={showAddMemberModal} onClose={()=>setShowAddMemberModal(false)} team={team} teamLessAgents={teamless_agents} />
            {!!showTransferMemberModal&&<TransferMemberModal isOpen={!!showTransferMemberModal} onClose={()=>setShowTransferMemberModal(undefined)} agent={showTransferMemberModal} teams={teams} />}
            <UnassignMemberModal agent={unassignAgent} isOpen={!!unassignAgent} onClose={()=>setUnassignAgent(undefined)} />
        </>
    );
};

export default TeamSettings;