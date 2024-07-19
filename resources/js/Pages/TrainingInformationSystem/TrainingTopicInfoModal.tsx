import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { TrainingTopic } from '@/types/trainingInfo';
import { useForm } from '@inertiajs/inertia-react';
import { Loader2, SaveIcon } from 'lucide-react';
import {FC, FormEventHandler, useEffect} from 'react';
import { toast } from 'sonner';

interface Props {
    isOpen:boolean;
    onClose:()=>void;
    topic:TrainingTopic;
}

const TrainingTopicInfoModal:FC<Props> = ({isOpen,onClose,topic}) => {
    const {data,setData,processing,reset,post} = useForm({title:"",description:"",current_version_id:0});
    const onSubmit:FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        post(route('training_info_system.update',{id:topic.id}),{
            preserveScroll: true,
            onSuccess:()=>onClose(),
            onError:()=>toast.error('An error occurred. Please try again later.')
        })
    }


    useEffect(()=>{
        if(!isOpen) return;
        if(!topic) return;
        setData(val=>({...val,title:topic.title||"",description:topic.description||"",current_version_id:topic.current_version?.id||0}));
    },[isOpen,topic]);

    return (
        <Dialog onOpenChange={onClose} open={isOpen}>
            <DialogContent >
                <DialogHeader>
                    <DialogTitle>Edit Topic</DialogTitle>
                    <DialogDescription>
                        Make changes to the Training Topic here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form className='flex flex-col gap-y-2.5' id='topic' onSubmit={onSubmit}>
                    <div className='space-y-1'>
                        <Label>Topic Title</Label>
                        <Input value={data.title} onChange={(e)=>setData('title',e.target.value)} disabled={processing} autoFocus required />
                    </div>
                    <div className='space-y-1'>
                        <Label>Description</Label>
                        <Textarea value={data.description} onChange={(e)=>setData('description',e.target.value)} disabled={processing} required />
                    </div>
                    <div className='space-y-1'>                        
                        <Label>Active Version</Label>
                        <Select value={data.current_version_id.toString()} onValueChange={e=>setData('current_version_id',parseInt(e))}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a version" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Versions</SelectLabel>
                                    {topic.versions.map(ver=><SelectItem key={ver.id} value={ver.id.toString()}>{ver.version}</SelectItem>)}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </form>
                <DialogFooter>
                    <Button disabled={processing} form='topic' type="submit">
                        {processing ? <Loader2 className='w-5 h-5 mr-2 animate-spin' /> : <SaveIcon className='w-5 h-5 mr-2' />}
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TrainingTopicInfoModal;