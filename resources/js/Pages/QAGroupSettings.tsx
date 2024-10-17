import Layout from '@/Components/Layout/Layout';
import { Button } from '@/Components/ui/button';
import { PageProps, User } from '@/types';
import { Inertia, Page } from '@inertiajs/inertia';
import { Head, useForm, usePage } from '@inertiajs/inertia-react';
import { ArrowLeftRight, Edit3Icon, PackagePlus, UserPlus2, UserPlus2Icon, UserRoundXIcon } from 'lucide-react';
import {FC, FormEventHandler, useState} from 'react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Label } from '@/Components/ui/label';
import { format } from 'date-fns';
import { Separator } from '@/Components/ui/separator';
import { QAGroup } from '@/types/QAElement';
import QAGroupComboBox from './QMSComponents/QASettings/QAGroupComboBox';
import DeleteQAGroup from './QMSComponents/QASettings/DeleteQAGroup';
import QAModal from './QMSComponents/QASettings/QAModal';
import AssignQAModal from './QMSComponents/QASettings/AssignQAModal';
import UnassignMemberModal from './TeamSettingsComponents/UnassignMemberModal';
import TransferQAModal from './QMSComponents/QASettings/TransferQAModal';
import UnassignedGroupModal from './QMSComponents/QASettings/UnassignedGroupModal';

interface Props {
    groups:QAGroup[]
    group:QAGroup;
    users:User[];
    unassigned_users:User[];
}

const QAGroupSettings:FC<Props> = ({groups,group,users:qa_users,unassigned_users}) => {
    const [showAddMemberModal,setShowAddMemberModal] = useState(false);
    const [showTransferMemberModal,setShowTransferMemberModal] = useState<User>();
    const [deleteGroupModal,setDeleteGroupModal] = useState(false);
    const {users} = group;
    const {data,setData,processing,reset,post} = useForm({
        name:'',
        user_id:group.user_id as number|undefined
    });
    const [QAGroupForm,setQAGroupForm] = useState<{show?:boolean;edit?:boolean}>({});
    const handleToggleShowForm = (edit?:boolean) => setQAGroupForm(val=>({show:!val.show,edit})); 
    const [unassignAgent,setUnassignAgent] = useState<User>();
const {projects} = usePage<Page<PageProps>>().props
    return (
        <>
            <Head title="QA Settings" />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container pb-2.5 overflow-y-auto'>
                    <div className='h-14 flex items-center gap-x-2'>
                        <QAGroupComboBox className='flex-1' groups={groups} size='sm' disabled={processing} selectedGroup={group} onGroupSelect={t=>Inertia.get(route('qa_group.index',{qa_group_id:t.id}))} />
                        <div className="flex items-center">
                            <Button onClick={()=>handleToggleShowForm()} size='sm' variant='secondary' className="rounded-r-none border-r-0 gap-x-2 border border-muted-foreground">
                                <PackagePlus className="h-5 w-5" /> <span className='hidden md:inline'>Create a QA Group</span> 
                            </Button>
                            <Button onClick={()=>handleToggleShowForm(true)} className="rounded-l-none rounded-r-none gap-x-2 border border-muted-foreground" size='sm' variant='secondary'>
                                <span className='hidden md:inline'>Edit QA</span> <Edit3Icon className="h-5 w-5" />
                            </Button>
                            <Button onClick={()=>setShowAddMemberModal(true)} className="rounded-l-none border-l-0 gap-x-2 border border-muted-foreground" size='sm' variant='secondary'>
                                <span className='hidden md:inline'>Assign QA</span> <UserPlus2Icon className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                    <Separator />
                    <div className='flex-1 overflow-y-auto flex flex-col gap-y-2.5'>
                        <div className='flex items-center justify-between h-16 md:gap-x-0 gap-x-2'>
                            <div className='w-full md:w-1/3 flex flex-col gap-y-1 text-sm'>
                                <div className='flex items-center justify-between'>
                                    <Label className='whitespace-nowrap'>Name:</Label>
                                    <div className='border-b-4 border-primary/50 border-dotted w-full mr-2 ml-2'></div>
                                    <span className='whitespace-nowrap'>{group.name}</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <Label className='whitespace-nowrap'>User:</Label>
                                    <div className='border-b-4 border-primary/50 border-dotted w-full mr-2 ml-2'></div>
                                    <span className='whitespace-nowrap'>{group.user?.first_name} {group.user?.last_name}</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <Label className='whitespace-nowrap'>Total Assigned Agents:</Label>
                                    <div className='border-b-4 border-primary/50 border-dotted w-full mr-2 ml-2'></div>
                                    <span className='whitespace-nowrap'>{users.length} Total Members</span>
                                </div>
                            </div>
                            <DeleteQAGroup setOpen={setDeleteGroupModal} isOpen={deleteGroupModal} onClose={()=>setDeleteGroupModal(false)} group={group} />
                        </div>
                        <Separator />
                        <Table className='flex-1 overflow-y-auto'>
                            <TableHeader className='bg-background sticky top-0'>
                                <TableRow>
                                    <TableHead className="w-[100px]">Agent</TableHead>
                                    <TableHead>Project</TableHead>
                                    <TableHead>Company ID</TableHead>
                                    <TableHead>Date Assigned</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map(u => (
                                    <TableRow key={u.id}>
                                        <TableCell className="font-medium w-72">{u.first_name} {u.last_name}</TableCell>
                                        <TableCell>{u.project?.name||'No Project'}</TableCell>
                                        <TableCell>{u.company_id}</TableCell>
                                        <TableCell>{!u.qa_assigned_date?'N/A':format(new Date(u.qa_assigned_date),'PPP')}</TableCell>
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
            <QAModal isOpen={QAGroupForm.show} group={QAGroupForm.edit?group:undefined} onClose={()=>handleToggleShowForm()} qa_users={users} />
            <AssignQAModal isOpen={showAddMemberModal} onClose={()=>setShowAddMemberModal(false)} group={group} unassigned_users={unassigned_users} />
            {!!showTransferMemberModal&&<TransferQAModal isOpen={!!showTransferMemberModal} onClose={()=>setShowTransferMemberModal(undefined)} agent={showTransferMemberModal} groups={groups} />}
            <UnassignedGroupModal agent={unassignAgent} isOpen={!!unassignAgent} onClose={()=>setUnassignAgent(undefined)} />
        </>
    );
};

export default QAGroupSettings;