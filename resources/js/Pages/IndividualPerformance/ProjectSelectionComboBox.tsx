import { Button } from '@/Components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/Components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { cn } from '@/lib/utils';
import { Project } from '@/types';
import { ChevronsUpDown, Check } from 'lucide-react';
import {FC, useState} from 'react';

interface Props {
    projects:Project[];
    selectedProject?:Project;
    onSelectProject:(project:Project)=>void;
    isAdmin:boolean;
    className?:string;
}

const ProjectSelectionComboBox:FC<Props> = ({className,projects,selectedProject,onSelectProject,isAdmin}) => {
    const [open, setOpen] = useState(false);
    const onSelect = (project:Project) => {
        if(project.id === selectedProject?.id) return;
        onSelectProject(project);
        setOpen(false);
    }
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    size='sm'
                    disabled={!isAdmin}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full md:w-52 justify-between !min-h-[2.25rem]",className)}
                    >
                {selectedProject?selectedProject.name:"Select Project..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput placeholder="Search Project..." />
                    <CommandList>
                        <CommandEmpty>No Project found.</CommandEmpty>
                        <CommandGroup>
                            {projects.map((p) => (
                                <CommandItem key={p.id} value={p.name} onSelect={()=>onSelect(p)} >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            p.id === selectedProject?.id ? "opacity-100" : "opacity-0"
                                        )}/>
                                    {p.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default ProjectSelectionComboBox;