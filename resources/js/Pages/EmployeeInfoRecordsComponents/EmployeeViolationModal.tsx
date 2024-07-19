import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/Components/ui/alert-dialog';
import { Button } from '@/Components/ui/button';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { User, UserViolation } from '@/types';
import { format } from 'date-fns';
import {FC, MouseEventHandler, ReactNode, useState} from 'react';
import EmployeeViolationForm from './EmployeeViolationForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Check, Loader2, Trash2, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Inertia } from '@inertiajs/inertia';
import { toast } from 'sonner';

interface Props {
    user:User;
    children:ReactNode;
}

const EmployeeViolationModal:FC<Props> = ({user,children}) => {
    const {violations} = user;
    const [selectedViolation,setSelectedViolation] = useState<UserViolation>();
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className='max-h-[95vh] h-full flex flex-col gap-y-3.5  lg:min-w-[50rem]'>
                <AlertDialogHeader className='h-auto relative'>
                    <AlertDialogTitle>{`${user.first_name} ${user.last_name}, ${user.company_id}`}</AlertDialogTitle>
                    <AlertDialogDescription>
                        View or Add Violations/Memos for {user.first_name} {user.last_name}
                    </AlertDialogDescription>
                    <AlertDialogCancel className='absolute top-0 right-0'>                        
                        <XIcon />                        
                    </AlertDialogCancel>
                </AlertDialogHeader>
                <div className='flex-1 flex items-center gap-x-2 overflow-y-hidden'>
                    <ScrollArea className='w-auto lg:w-52 h-full border-r'>
                        {violations.length===0&&<Button size='sm' variant='ghost' disabled>No Violations Found</Button>}
                        {violations.map(violation=> <ViolationItem key={violation.id} violation={violation} selected={selectedViolation?.id===violation.id} onClick={()=>setSelectedViolation(violation)} />)}
                    </ScrollArea>
                    <div className='flex-1 h-full overflow-y-auto'>
                        <Tabs defaultValue='2' className="w-full">
                            <TabsList>
                                <TabsTrigger value="1">Add Violation</TabsTrigger>
                                <TabsTrigger value="2">Selected Violation</TabsTrigger>
                            </TabsList>
                            <TabsContent value="1" className='px-3.5'>
                                <EmployeeViolationForm user={user} />
                            </TabsContent>
                            <TabsContent className='px-3.5' value="2">
                                {!selectedViolation?<p className='text-muted-foreground'>Select a violation from the list on the left</p>:(
                                    <div className='flex flex-col gap-y-3.5'>
                                        <div className='space-y-1'>
                                            <p className='font-bold tracking-wide'>{selectedViolation.violation}</p>
                                            <p className='text-xs text-muted-foreground'>Violation/Reason</p>
                                        </div>
                                        <div className='space-y-1'>
                                            <p className='font-bold tracking-wide'>{format(new Date(selectedViolation.date),'PPP')}</p>
                                            <p className='text-xs text-muted-foreground'>Violation Date</p>
                                        </div>
                                        <div className='space-y-1'>
                                            <p>{selectedViolation.description||'n/a'}</p>
                                            <p className='text-xs text-muted-foreground'>Description</p>
                                        </div>
                                        <div className='space-y-1'>
                                            <p>Scanned Documents/Memos</p>
                                            {selectedViolation.images.length<1?<p className='text-muted-foreground'>No images attached</p>:(
                                                <>
                                                    <p className='text-sm'>Click on Image to Enlarge</p>
                                                    <div className='flex flex-wrap gap-2'>
                                                        {selectedViolation.images.map((image,index)=>(
                                                            <a target='_blank' key={image.id} href={image.image}>
                                                                <img key={index} src={image.image} alt={`violation-image-${index}`} className='w-20 h-20 object-cover rounded-md' />
                                                            </a>
                                                        ))}
                                                    </div>
                                                </>                                            
                                            )}
                                        </div>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default EmployeeViolationModal;

interface ViolationItemProps {
    violation:UserViolation;
    selected:boolean;
    onClick:()=>void;
}

const ViolationItem:FC<ViolationItemProps> = ({violation,selected,onClick}) =>{
    const [deleting,setDeleting] = useState(false);
    const [loading,setLoading] = useState(false);
    const handleDelete:MouseEventHandler<HTMLDivElement> = e =>{
        e.stopPropagation();
        setDeleting(true);
    }

    const onDelete = () =>{
        Inertia.post(route('violation.destroy',{id:violation.id}),{},{
            onStart:()=>setLoading(true),
            onFinish:()=>setLoading(false),
            onSuccess:()=>setDeleting(false),
            onError:()=>toast.error('An error occurred. Please try again.')
        });
    }

    return (
        <div role='button' onClick={onClick} className={cn('group min-h-[1.688rem]  py-1  px-3 rounded w-full hover:bg-primary/5 hover:underline flex items-center gap-x-2 justify-between font-medium transition',
                selected && 'bg-primary/5 text-primary'
            )}>
            <div className='flex items-center justify-between gap-x-1.5  w-full'>
                <p className={cn('truncate text-xs',selected&&'underline')}>{limitStringLength(violation.violation)}</p>
                <p className={cn('truncate text-xs ',selected&&'underline')}>{format(new Date(violation.date),'MM/dd/yy')}</p>
            </div>
            {!deleting&&(<div onClick={handleDelete} role='button' className='h-full rounded-full opacity-70 hover:opacity-100 hover:bg-secondary transition'>
                <Trash2 className='h-5 w-5' />
            </div>)}

            {(deleting&&!loading)&&(
                <div className='flex items-center gap-x-2'>
                    <div onClick={()=>setDeleting(false)} role='button' className='h-full rounded-full opacity-70 hover:opacity-100 hover:bg-secondary transition'>
                        <XIcon className='h-5 w-5' />
                    </div>
                    <div role='button' onClick={onDelete} className='h-full rounded-full opacity-70 hover:opacity-100 hover:bg-secondary transition'>
                        <Check className='h-5 w-5' />
                    </div>
                </div>
            )}

            {(deleting&&loading)&& (
                <div  className='h-full rounded-full opacity-70 hover:opacity-100 hover:bg-secondary transition'>
                    <Loader2 className='h-5 w-5 animate-spin' />
                </div>
            )}
        </div>
    );
}

function limitStringLength(str:string) {
    if (str.length <= 10) {
        return str;
    } else {
        return str.substring(0, 7) + "...";
    }
}