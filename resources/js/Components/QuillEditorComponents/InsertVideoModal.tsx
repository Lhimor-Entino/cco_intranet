import {FC, FormEventHandler, useEffect, useState} from 'react';
import { QuillMedia } from '../QuillEditor';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface Props {
    isOpen:boolean;
    onInsert:(media:QuillMedia)=>void;
    onClose:()=>void;
}

const InsertVideoModal:FC<Props> = ({isOpen,onInsert,onClose}) => {
    const [vid,setVid] = useState<QuillMedia>({url:"",width:320,height:240});
    const reset = () => setVid({url:"",width:320,height:240});
    const onSubmit:FormEventHandler<HTMLFormElement> =e => {
        e.preventDefault();
        onInsert(vid);
        onClose();
    }
    useEffect(()=>{
        if(!isOpen) return;
        reset();       
    },[isOpen]);
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Insert Video</DialogTitle>
                    <DialogDescription>
                        Paste a Video URL to insert an image.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} id='vid' className='flex flex-col gap-y-2.5'>
                    <div className='space-y-1'>
                        <Label>Video URL</Label>
                        <Input required value={vid.url} onChange={(e)=>setVid(val=>({...val,url:e.target.value}))} autoFocus />
                    </div>
                    <div className='flex flex-row gap-x-2.5 items-center'>
                        <div className='space-y-1'>
                            <Label>Width</Label>
                            <Input type='number' required value={vid.width.toString()} onChange={(e)=>setVid(val=>({...val,width:parseInt(e.target.value)}))} />
                        </div>
                        <div className='space-y-1'>
                            <Label>Height</Label>
                            <Input type='number' required value={vid.height.toString()} onChange={(e)=>setVid(val=>({...val,height:parseInt(e.target.value)}))} />
                        </div>
                    </div>
                </form>
                <DialogFooter>
                    <Button size='sm' form='vid' type="submit">Insert Image</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default InsertVideoModal;