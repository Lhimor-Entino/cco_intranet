import { FC, FormEventHandler, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useAnnouncementModal } from "@/Hooks/useAnnouncementModal";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { Accordion } from "../ui/accordion";
import { Loader2, PinIcon, XIcon } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Editor from "../Editor";
import { SingleImageDropzone } from "../SingleImageDropzone";
import { useForm } from "@inertiajs/inertia-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AnnouncementModal:FC = () => {
    const {data,isOpen,onClose} = useAnnouncementModal();
    
    const title = !data?'New Announcement':'Edit Announcement';
    const description = !data?'Post a new announcement':'Edit current announcement';
    const submit = !data?'Post':'Update';

    const {data:frmData,setData,post,processing} = useForm({
        title:'',
        content:'',
        image:undefined as File|undefined,
    });
    const [imgPreview,setImgPreview] = useState<string|undefined>(undefined);
    
    const setImage = (file?:File)=>{
        setData('image',file);
        setImgPreview(file?URL.createObjectURL(file):data?.image);
    }

    const onSubmit =()=>{
        if(frmData.title.trim().length<5) return toast.error('Title is too short');
        if(frmData.content.trim().length<5) return toast.error('Content is too short');
        const href= data?route('settings.update',data.id):route('settings.store');
        post(href,{
            onSuccess:()=>{
                onClose();
                toast.success(!data?"Announcement save successfully. Don't forget to set it to Active.":"Announcement updated successfully.");
            },
            onError:()=>toast.error('Something Went Wrong. Please try again.'),
            preserveState:false
        })
    }

    useEffect(()=>{
        if(!isOpen) return;
        setData(val=>({...val,title:data?.title||'',content:data?.content||'',image:undefined}));
        setImgPreview(data?.image||undefined);
    },[isOpen,data]);

    const Icon = processing?Loader2:PinIcon;

    return (
        <Sheet open={isOpen}>
            <SheetContent side='left' className='h-full flex flex-col min-w-[100vw] lg:min-w-[48rem]  '>
                <SheetHeader className='h-auto'>
                    <SheetTitle className="w-full text-center">{title}</SheetTitle>
                    <SheetDescription className="w-full text-center">{description}</SheetDescription>
                </SheetHeader>
                <ScrollArea className='flex-1'>
                        <div className="space-y-1 p-2.5 ">
                            <Label>Title</Label>
                            <Input disabled={processing} required value={frmData.title} onChange={({target})=>setData('title',target.value)} autoFocus autoComplete="off" placeholder="Title" />
                        </div>
                        <div className="space-y-1 p-2.5 ">
                            <Label>Content</Label>
                            <Editor onChange={e=>setData('content',e)} editable={!processing} announcement={data} />
                        </div>
                        <div className="space-y-1 p-2.5 ">
                            <Label>Image <span className="text-sm italic text-muted-foreground">(optional)</span></Label>    
                            <div className="aspect-video max-w-xl mx-auto">                
                                <SingleImageDropzone  value={imgPreview} onChange={setImage} />     
                            </div>                       
                        </div>
                    
                </ScrollArea>
                <SheetFooter className='h-auto flex items-center justify-center p-3.5 gap-x-2'>                   
                    <Button disabled={processing} variant='secondary' onClick={onClose} type="button"> <XIcon className="h-5 w-5 mr-2" /> Close</Button>
                    <Button disabled={processing} variant='outline' onClick={onSubmit}> <Icon className={cn("h-5 w-5 mr-2",processing&&'animate-spin')} /> {submit}</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default AnnouncementModal