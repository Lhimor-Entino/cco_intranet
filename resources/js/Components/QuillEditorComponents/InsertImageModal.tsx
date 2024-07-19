import {FC, FormEventHandler, useEffect, useState} from 'react';
import { QuillMedia } from '../QuillEditor';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface Props {
    isOpen:boolean;
    onInsert:(media:QuillMedia)=>void;
    onClose:()=>void;
}

const InsertImageModal:FC<Props> = ({isOpen,onInsert,onClose}) => {
    const [img,setImg] = useState<QuillMedia>({url:"",width:320,height:240});
    const onSubmit:FormEventHandler<HTMLFormElement> =e => {
        e.preventDefault();
        onInsert(img);
        reset();
        onClose();
    }

    const reset = () => setImg({url:"",width:320,height:240});

    useEffect(()=>{
        if(!isOpen) return;
        reset();       
    },[isOpen]);
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Insert Image</DialogTitle>
                    <DialogDescription>
                        Paste an Image URL to insert an image.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} id='img' className='flex flex-col gap-y-2.5'>
                    <div className='space-y-1'>
                        <Label>Image URL</Label>
                        <Input required value={img.url} onChange={(e)=>setImg(val=>({...val,url:e.target.value}))} autoFocus />
                    </div>
                    <div className='flex flex-row gap-x-2.5 items-center'>
                        <div className='space-y-1'>
                            <Label>Width</Label>
                            <Input type='number' required value={img.width.toString()} onChange={(e)=>setImg(val=>({...val,width:parseInt(e.target.value)}))} />
                        </div>
                        <div className='space-y-1'>
                            <Label>Height</Label>
                            <Input type='number' required value={img.height.toString()} onChange={(e)=>setImg(val=>({...val,height:parseInt(e.target.value)}))} />
                        </div>
                    </div>
                </form>
                <DialogFooter>
                    <Button size='sm' form='img' type="submit">Insert Image</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default InsertImageModal;