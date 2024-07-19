import { useProjectSettingsModal } from "@/Hooks/useProjectSettingsModal"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
import { useForm, usePage } from "@inertiajs/inertia-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Edit, Loader2, Plus } from "lucide-react";
import { FormEventHandler, useState } from "react";
import { toast } from "sonner";
import { PageProps, Project } from "@/types";
import { Page } from "@inertiajs/inertia";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

const ProjectSettingsModal = () => {
    const {projects} = usePage<Page<PageProps>>().props;
    const {isOpen,onClose} = useProjectSettingsModal();
    const {data:project,setData:setProject,processing,post} = useForm({name:''});
    const [currentProject,setCurrentProject] = useState<Project|undefined>();
    const Icon = currentProject?Edit:Plus;
    const onSubmit:FormEventHandler<HTMLFormElement> = e =>{
        e.preventDefault();
        const href = currentProject?route('project.update',currentProject.id):route('project.store');
        const successLabel = currentProject?'Project updated successfully':'Project added successfully';
        post(href,{
            preserveScroll:true,
            onSuccess:()=>{
                //onClose();
                toast.success(successLabel);
                setCurrentProject(undefined);
                setProject('name','');
            },
            onError:()=>toast.error('Failed to add project. Please try again.'),     
            //preserveState:false
        });
    }

    const onRename = (project:Project) => {
        setProject('name',project.name);
        setCurrentProject(project);
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="max-h-full flex flex-col gap-y-2">
                <AlertDialogHeader className="h-auto">
                    <AlertDialogTitle>Project Settings</AlertDialogTitle>
                    <AlertDialogDescription>
                        Rename or Add a new project.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex-1 flex flex-col gap-y-2.5 overflow-y-auto">
                    <form onSubmit={onSubmit} className="flex items-center gap-x-2">
                        <Input required autoComplete="off" disabled={processing} value={project.name} onChange={e=>setProject('name',e.target.value)} placeholder="Project Name" className="flex-1 h-9" />
                        <Button disabled={processing} size='sm' variant='secondary'>
                        {processing?<Loader2 className="h-4 w-4 mr-2 animate-spin" />:<Icon className="h-5 w-5 mr-2" />}
                            {currentProject?'Rename':'Add'}
                        </Button>
                        {currentProject&&(
                            <Button onClick={()=>setCurrentProject(undefined)} size='sm' variant='outline'>
                                Cancel
                            </Button>
                        )}
                    </form>
                    {projects.length<1&&(
                        <div className="text-muted-foreground text-sm">
                            No projects found. Please add a project.
                        </div>
                    
                    )}
                    {projects.length>0&&(
                        <Table>
                            <TableHeader className="bg-background z-50 sticky top-0">
                                <TableRow>
                                    <TableHead>Project Name</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.map(project=>(
                                    <TableRow key={project.id}>
                                        <TableCell>{project.name}</TableCell>
                                        <TableCell>
                                            <Button size='sm' variant='outline' onClick={()=>onRename(project)}>
                                                Rename
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
                <AlertDialogFooter className="h-auto">
                    <AlertDialogCancel asChild>
                        <Button size='sm' variant='outline' disabled={processing}>
                            Close
                        </Button>
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
export default ProjectSettingsModal