import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { User } from '@/types';
import { useForm } from '@inertiajs/inertia-react';
import { Loader2Icon } from 'lucide-react';
import {FC, useEffect} from 'react';
import { toast } from 'sonner';

interface Props {
    agent?:User;
    isOpen:boolean;
    onClose:()=>void;
}

const UnassignedGroupModal:FC<Props> = ({agent,isOpen,onClose}) => {
    const {setData,processing,post,reset,data} = useForm({user_id:agent?.id});

    

    const onSubmit = () =>{
        if(!data.user_id) return toast.error('Please select a user to continue.');
        post(route('qa_group.unassign'),{
            onError:()=>toast.error('Failed to unassign member. Please try again.'),
            onSuccess:()=>{
                onClose();
                toast.success(`${agent?.first_name} ${agent?.last_name} has been successfully unassigned from ${agent?.qa_group?.name}`);
            }
        });
    }

    useEffect(()=>setData('user_id',agent?.id),[agent?.id]);
    useEffect(()=>{
        if(!isOpen) reset();
    },[isOpen]);
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Unassign Agent</DialogTitle>
                    <DialogDescription>
                        {`Are you sure you want to unassign ${agent?.first_name} ${agent?.last_name} from ${agent?.qa_group?.name} ?`}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button disabled={processing} onClick={onSubmit} size='sm' className='ml-auto' variant='secondary'>
                        {processing && <Loader2Icon className='w-5 h-5 animate-spin ml-2' />}
                        Proceed
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UnassignedGroupModal;