import { Button } from "@/Components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/Components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { cn } from "@/lib/utils";
import { PageProps } from "@/types";
import { TrainingFolder } from "@/types/trainingInfo";
import { Page } from "@inertiajs/inertia";
import { useForm, usePage } from "@inertiajs/inertia-react";
import { CheckIcon, ChevronsUpDown, Loader2 } from "lucide-react";
import { FC, FormEventHandler, useState } from "react";
import { toast } from "sonner";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    folder: TrainingFolder;    
    folderNames:string[];
}

const EditMainFolderModal:FC<Props> = ({isOpen,onClose,folder,folderNames}) => {
    const {projects} = usePage<Page<PageProps>>().props;
    const [popoverOpen,setPopoverOpen] = useState(false);
    const {reset,data,setData,processing,post} = useForm<{name:string;project_ids:number[]}>({
        name:folder.name,
        project_ids:folder.projects.map(p=>p.id)
    });
    const onSubmit:FormEventHandler<HTMLFormElement> = (e)=>{
        e.preventDefault();
        if(data.project_ids.length===0) return toast.error('Please select at least one project');
        if(data.name.trim()==='') return toast.error('Please enter a valid folder name');
        //return a toast notification if data.name exists in folderNames
        if(folderNames.filter(f=>f!==folder.name).includes(data.name)) return toast.error('Folder name already exists');
        post(route('training_folder.update',{id:folder.id}),{
            onSuccess: ()=>{
                toast.success('Main folder updated successfully.');
                onClose();
            },
            onError:()=>toast.error('An error occurred. Please try again later.')
        });
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit {folder.name} Folder</DialogTitle>
                    <DialogDescription>
                        Edit main folder details
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className='flex flex-col gap-2.5' id='main_folder'>
                    <div className='space-y-1'>
                        <Label>Folder Name</Label>
                        <Input value={data.name} onChange={({target})=>setData('name',target.value)} required disabled={processing} />
                    </div>
                    <div className="space-y-1.5">
                        <Label >Project/s</Label>
                        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button disabled={processing} variant="outline" role="combobox" aria-expanded={popoverOpen} className="w-full justify-between" >
                                    Add Project
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-3.5">
                                <Command className="w-full">
                                    <CommandInput placeholder="Search projects..." />
                                    <CommandList className='w-full'>
                                        <CommandEmpty>No results found.</CommandEmpty>
                                        <CommandGroup className="w-full max-h-48 overflow-y-auto">
                                            {(projects||[]).map((project) => (
                                                <CommandItem className="w-full"
                                                    key={project.id}
                                                    onSelect={() => {
                                                        setData(val => ({ ...val, project_ids: val.project_ids.includes(project.id) ? val.project_ids.filter(id => id !== project.id) : [...val.project_ids, project.id] }));
                                                        setPopoverOpen(false);
                                                    }}>
                                                    <span className="capitalize">{`${project.name}`}</span>
                                                    <CheckIcon className={cn( "ml-auto h-4 w-4", data.project_ids.findIndex(id=>id===project.id)>-1 ? "opacity-100" : "opacity-0")}/>
                                                </CommandItem>
                                            ))}                                        
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <div className="flex flex-col gap-y-1 w-full">
                            {
                                data.project_ids.map((project_id) => {
                                    const project = projects.find(p => p.id === project_id);
                                    return(
                                        <div key={project?.id} className="flex items-center justify-between">
                                            <span className="capitalize text-sm">{`${project?.name}`}</span>
                                            <Button disabled={processing} type="button" variant='destructive' size='sm' onClick={()=>setData(val=>({...val,project_ids:val.project_ids.filter(id=>id!==project?.id)} ) )}> Remove </Button>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </form>
                <DialogFooter>
                    <Button disabled={processing} form='main_folder' size='sm' type="submit">
                        {processing && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditMainFolderModal