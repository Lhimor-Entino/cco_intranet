/*
|--------------------------------------------------------------------------
| Programmer Settings - Debug Login Modal - can only be accessed by programmers; used for logging in as another user without password for debugging purposes
|--------------------------------------------------------------------------
*/

import {FC, FormEventHandler, useEffect} from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { useForm } from '@inertiajs/inertia-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';



interface Props {
    isOpen: boolean;
    onClose: ()=>void;
}

const DebugLoginModal:FC<Props> = ({isOpen,onClose}) => {
    const {data,setData,processing,reset,post} = useForm({company_id:"",password:""});
    useEffect(() => {
        if(!isOpen) reset();
    }, [isOpen]);

    const onSubmit:FormEventHandler<HTMLFormElement> = (e)=>{
        e.preventDefault();
        post(route('programmer.login'),{
            onError:()=>toast.error('Error logging in. Check console or network tab for more details'),
            onSuccess:onClose
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Debug Login
                    </DialogTitle>
                    <DialogDescription>
                        Log in as another user without password for debugging purposes                    
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} id="debug" className='flex flex-col gap-y-3.5'>
                    <div className='space-y-1'>
                        <Label>Company ID</Label>
                        <Input value={data.company_id} onChange={e=>setData('company_id',e.target.value)} disabled={processing} autoFocus required  />
                    </div>
                    <div className='space-y-1'>
                        <Label>Master Password</Label>
                        <Input type='password' value={data.password} onChange={e=>setData('password',e.target.value)} disabled={processing} required  />
                    </div>
                </form>
                <DialogFooter>
                    <Button form='debug' size='sm' disabled={processing} type="submit">
                        {processing && <Loader2 className='h-5 w-5 mr-2 animate-spin' />}
                        Proceed
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DebugLoginModal;