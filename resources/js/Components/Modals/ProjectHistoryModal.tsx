import { FC, useEffect, useState } from "react"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { Loader2, XIcon } from "lucide-react"
import { useProjectHistoryModal } from "@/Hooks/useProjectHistoryModal"
import axios from "axios"
import { toast } from "sonner"
import { Skeleton } from "../ui/skeleton"
import { PageProps, ProjectHistory, User } from "@/types"
import { usePage } from "@inertiajs/inertia-react"
import { Inertia, Page } from "@inertiajs/inertia"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { format, set } from 'date-fns';

const ProjectHistoryModal:FC = () => {
    const {user,isOpen,onClose} = useProjectHistoryModal();
    const [loading,setLoading] = useState(false);
    const [histories,setHistories] = useState<ProjectHistory[]>([]);
    useEffect(()=>{
        if(!user) return;
        setLoading(true);
        axios.get(route('project_history.index',{user_id:user.id}))
        .then(({data})=>setHistories(data))
        .catch(e=>{
            console.error(e);
            toast.error('Failed to fetch project history. Please try again.');
        })
        .finally(()=>setLoading(false));
    },[user]);

    //if(!user) return null;
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="h-full flex flex-col gap-y-2.5">
                {user && <Content histories={histories} user={user} onClose={onClose} loading={loading} />}                
            </AlertDialogContent>
        </AlertDialog>
    )
}
export default ProjectHistoryModal;

interface ContentProps{
    user:User;
    onClose:()=>void;
    loading:boolean;
    histories:ProjectHistory[];
}

const Content:FC<ContentProps> = ({user,onClose,loading,histories}) =>{
    const [isEditing,setIsEditing] = useState(false);
    const {projects} = usePage<Page<PageProps>>().props;
    const [project_id,setProjectId] = useState<string|undefined>();
    const [saving,setSaving] = useState(false);
    useEffect(()=>setProjectId(user.project_id?.toString()),[user]);

    const onConfirm = () =>{
        if(!project_id) return;
        if(user.project_id?.toString()===project_id) return toast.info('User is already in this project.');
        Inertia.post(route('project_history.store'),{user_id:user.id,project_id},{
            onStart:()=>setSaving(true),
            onFinish:()=>setSaving(false),
            onError:()=>toast.error('Failed to transfer project. Please try again.'),
            onSuccess:()=>{
                toast.success(`${user.first_name} ${user.last_name} has been transferred to new Project ${projects.find(p=>p.id===parseInt(project_id))?.name||''}`);
                onClose();
            }
        });
    }

    return (
        <>
            <AlertDialogHeader className="relative h-auto">
                <AlertDialogTitle>Project History</AlertDialogTitle>
                <AlertDialogDescription>
                    {`Project history for ${user.first_name} ${user.last_name}`}
                </AlertDialogDescription>
                {/* close button (x) */}
                <Button onClick={onClose} variant='ghost' size='icon' className="absolute top-0 right-0">
                    <XIcon />
                </Button>
            </AlertDialogHeader>
            <div className="flex-1 overflow-auto">
                {loading&&(
                    <Skeleton className="h-full w-full" />
                )}
                {!loading&&(
                    <div className="h-full flex flex-col gap-y-2 ">
                        <div className="flex items-center gap-x-3.5 h-auto">
                            {!isEditing?(
                                <>
                                    <div className="flex items-center text-sm">
                                        Current Project&nbsp;:&nbsp;<span className="font-bold">{user.project?.name||'None'}</span>
                                    </div>
                                    <Button onClick={()=>setIsEditing(true)} size='sm' className="ml-auto">Transfer</Button>
                                </>
                            ):(
                                <>
                                    <Select onValueChange={e=>setProjectId(e)} value={project_id}>
                                        <SelectTrigger disabled={saving}>
                                            <SelectValue  className="h-9" placeholder="Select a project" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-72">
                                            <SelectGroup>
                                            <SelectLabel>Project</SelectLabel>
                                                {
                                                    projects.map((project) =><SelectItem disabled={user.project_id===project.id} key={project.id} value={project.id.toString()}>{project.name}</SelectItem>)
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <Button disabled={saving} onClick={onConfirm} size='sm' className="ml-auto">
                                        {saving&&(<Loader2 className="animate-spin w-5 h-5 mr-2" />)}
                                        Confirm Transfer
                                    </Button>
                                </>
                            )}
                        </div>
                        
                        {histories.length>0&&(
                            <Table >
                                <TableHeader className="bg-background z-50 sticky top-0">
                                    <TableRow>
                                        <TableHead>Project</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {histories.map(({project,start_date,id})=>(
                                        <TableRow key={id}>
                                            <TableCell>{project.name}</TableCell>
                                            <TableCell>{format(new Date(start_date),'yyyy-MM-dd')}</TableCell>
                                        </TableRow>                                
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                        {histories.length===0&&(
                            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                No project history found.
                            </div>
                        
                        )}
                        
                    </div>
                )}
            </div>
        </>
    )
}