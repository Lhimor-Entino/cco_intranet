import { PageProps, Team } from '@/types';
import { Page } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import {FC, useState} from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { ChevronsUpDown,  Check } from 'lucide-react';
import { Button } from './ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';

interface Props {
    selectedTeam?:Team;
    onTeamSelect:(team:Team)=>void;
    disabled?:boolean;
    size?:'sm'|'default'|'lg'|'icon';
    teams:Team[];
    className?:string;
}

const TeamsComboBox:FC<Props> = ({teams,selectedTeam,onTeamSelect,disabled,size='default',className}) => {
    const [open,setOpen] = useState(false);    
    const onSelect = (team:Team) => {
        if(team.id === selectedTeam?.id) return;
        onTeamSelect(team);
        setOpen(false);
    }
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button  size={size} disabled={disabled} variant="outline" role="combobox" aria-expanded={open} className={cn("w-full md:w-96 justify-between !min-h-[2.25rem]",className)} >
                    <span>{selectedTeam?`${selectedTeam.name}`:'Select Team'}</span>
                    <span className='flex items-center truncate md:gap-x-3.5'>
                        {selectedTeam&&<span className='hidden sm:inline truncate text-muted-foreground font-light'>Team Lead: {`${selectedTeam.user.first_name} ${selectedTeam.user.last_name}`}</span>}
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[640px]" align='end' side='bottom'>
                <Command>
                    <CommandInput placeholder="Search Project..." />
                    <CommandList>
                        <CommandEmpty>No User found.</CommandEmpty>
                        <CommandGroup>
                            {teams.map(t => (
                                <CommandItem key={t.id} onSelect={()=>onSelect(t)} >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            t.id === selectedTeam?.id ? "opacity-100" : "opacity-0"
                                        )}/>
                                    <span>{t.name}</span>
                                    <span className='ml-auto'>{`TL: ${t.user.first_name} ${t.user.last_name}`}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default TeamsComboBox;