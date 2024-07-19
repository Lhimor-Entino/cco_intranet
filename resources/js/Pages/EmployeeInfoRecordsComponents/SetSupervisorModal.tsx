import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { User } from '@/types';
import {FC, useEffect, useState} from 'react';
import { useSetSupervisorModal } from './EmployeeInfoHooks/useSetSupervisorModal';
import { Button } from '@/Components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { Check, ChevronsUpDownIcon, Loader2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/Components/ui/command';
import { cn } from '@/lib/utils';
import { Input } from '@/Components/ui/input';
import { Inertia } from '@inertiajs/inertia';
import { toast } from 'sonner';

interface Props {
    employees:User[];
}

const SetSupervisorModal:FC<Props> = ({employees}) => {
    const {isOpen,user,onClose} = useSetSupervisorModal();
    const [open, setOpen] = useState(false)
    const [head, setHead] = useState<User|undefined>();
    const [filter,setFilter] = useState<string>('');
    const [loading,setLoading] = useState<boolean>(false);


    const filteredEmployees = employees.filter(employee=>{
        if(filter === '') return true;
        return employee.first_name.toLowerCase().includes(filter.toLowerCase()) || employee.last_name.toLowerCase().includes(filter.toLowerCase());
    });

    const onSubmit = () =>{
        if(!head) return;
        if(!user) return;
        Inertia.post(route('employee.supervisor',{id:user.id}),{
            supervisor_id:head.id
        },{
            onStart:()=>setLoading(true),
            onFinish:()=>setLoading(false),
            onSuccess:()=>{
                onClose();
                toast.success('Supervisor/Head set successfully.')
            },
            onError:()=>toast.error('Failed to set supervisor. Please try again.')
        });
    }

    useEffect(()=>{
        if(user?.supervisor){
            setHead(user.supervisor);
        }
    },[isOpen,user]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose} modal>
            {user&&(
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{`${user.first_name} ${user.last_name}`}</DialogTitle>
                        <DialogDescription>
                            {`Assign Supervisor/Head for ${user.first_name} ${user.last_name}`} 
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between"
                                disabled={loading}
                                >
                                {head
                                    ? `${head.first_name} ${head.last_name}`
                                    : "Select Supervisor/Head..."}
                                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 max-h-72">
                                <Command>
                                    <Input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search Supervisor/Head..." />
                                    {/* <CommandEmpty>No Employee found.</CommandEmpty> */}
                                    <CommandGroup>
                                        {filteredEmployees.map((employee) => (
                                            <Button
                                                key={employee.id}
                                                onClick={() => {
                                                    setHead(employee);
                                                    setOpen(false);
                                                }}
                                                className='w-full fkex items-center justify-start'
                                                variant='ghost'
                                                size='sm'
                                            >
                                        
                                                <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    (head?.id === employee.id) ? "opacity-100" : "opacity-0"
                                                )}
                                                />
                                                {`${employee.first_name} ${employee.last_name}`}
                                            
                                            </Button>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading} onClick={onSubmit}>
                            {loading && <Loader2 className='w-5 h-5 mr-2 animate-spin' />}
                            Save changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            )}
        </Dialog>
    );
};

export default SetSupervisorModal;