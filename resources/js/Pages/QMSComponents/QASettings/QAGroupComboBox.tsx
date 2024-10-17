

import {FC, useState} from 'react';
import { cn } from '@/lib/utils';
import { ChevronsUpDown,  Check } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/Components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { Button } from '@/Components/ui/button';
import { QAGroup } from '@/types/QAElement';

interface Props {
    selectedGroup?:QAGroup;
    onGroupSelect:(group:QAGroup)=>void;
    disabled?:boolean;
    size?:'sm'|'default'|'lg'|'icon';
    groups:QAGroup[];
    className?:string;
}

const QAGroupComboBox:FC<Props> = ({groups,selectedGroup,onGroupSelect,disabled,size='default',className}) => {
    const [open,setOpen] = useState(false);    
    const onSelect = (group:QAGroup) => {
        if(group.id === selectedGroup?.id) return;
        onGroupSelect(group);
        setOpen(false);
    }
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button  size={size} disabled={disabled} variant="outline" role="combobox" aria-expanded={open} className={cn("w-full md:w-96 justify-between !min-h-[2.25rem]",className)} >
                    <span>{selectedGroup?`${selectedGroup.name}`:'Select QA'}</span>
                    <span className='flex items-center truncate md:gap-x-3.5'>
                        {selectedGroup&&<span className='hidden sm:inline truncate text-muted-foreground font-light'>QA : {`${selectedGroup.user.first_name} ${selectedGroup.user.last_name}`}</span>}
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[640px]" align='end' side='bottom'>
                <Command>
                    <CommandInput placeholder="Search QA..." />
                    <CommandList>
                        <CommandEmpty>No User found.</CommandEmpty>
                        <CommandGroup>
                            {groups.map(t => (
                                <CommandItem key={t.id} onSelect={()=>onSelect(t)} >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            t.id === selectedGroup?.id ? "opacity-100" : "opacity-0"
                                        )}/>
                                    <span>{t.name}</span>
                                    <span className='ml-auto'>{`QA: ${t.user.first_name} ${t.user.last_name}`}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default QAGroupComboBox;