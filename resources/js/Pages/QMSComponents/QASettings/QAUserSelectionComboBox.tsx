import { Button } from '@/Components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/Components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { cn } from '@/lib/utils';
import { User } from '@/types';
import { ChevronsUpDown,  Check } from 'lucide-react';
import {FC, useState} from 'react';

interface Props {
    users:User[];
    selectedUser?:User;
    onSelectUser:(user:User)=>void;
    isQA:boolean;
    disabled?:boolean;
    className?:string;
}

const QAUserSelectionBox:FC<Props> = ({users,selectedUser,onSelectUser,isQA,disabled,className}) => {
    const [open, setOpen] = useState(false);
    const onSelect = (user:User) => {
        if(user.id === selectedUser?.id) return;
        onSelectUser(user);
        setOpen(false);
    }
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button  size='sm' disabled={!isQA || disabled} variant="outline" role="combobox" aria-expanded={open} className={cn("w-full md:w-auto justify-between !min-h-[2.25rem]",className)} >
                    {selectedUser?`${selectedUser.first_name} ${selectedUser.last_name}`:'Select Agent'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 max-h-[18rem] ">
                <Command>
                    <CommandInput placeholder="Search Agent..." />
                    <CommandList>
                        <CommandEmpty>No User found.</CommandEmpty>
                        <CommandGroup>
                            {users.map((p) => (
                                <CommandItem key={p.id} onSelect={()=>onSelect(p)} >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            p.id === selectedUser?.id ? "opacity-100" : "opacity-0"
                                        )}/>
                                    {p.first_name} {p.last_name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default QAUserSelectionBox;