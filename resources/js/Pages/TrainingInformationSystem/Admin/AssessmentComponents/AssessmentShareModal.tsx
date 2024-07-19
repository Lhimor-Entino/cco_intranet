import { Button } from '@/Components/ui/button';
import { Calendar } from '@/Components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { cn, isValid24HrTime } from '@/lib/utils';
import { PageProps } from '@/types';
import { TrainingAssessment } from '@/types/trainingInfo';
import { Page } from '@inertiajs/inertia';
import { useForm, usePage } from '@inertiajs/inertia-react';
import axios from 'axios';
import { format } from 'date-fns';
import { CalendarIcon, CircleAlertIcon, CopyIcon, DotIcon, Loader2, TriangleAlertIcon } from 'lucide-react';
import {ChangeEventHandler, FC, useEffect, useRef, useState} from 'react';
import { toast } from 'sonner';

interface Props {
    assessment:TrainingAssessment;
    isOpen:boolean;
    onClose:()=>void;
}

const AssessmentShareModal:FC<Props> = ({assessment,isOpen,onClose}) => {
    
    const {newLink} = usePage<Page<PageProps>>().props.flash;
    const linkRef = useRef<HTMLInputElement>(null);
    const {data,setData,processing,post} = useForm({
        date:'',
        time:'',
        'training_assessment_id':assessment.id,
    });
    const [copied,setCopied] = useState(false);
    const onCopy = ()=> {
        if(!newLink) return toast.error('No link to copy');
        navigator.clipboard.writeText(newLink);
        setCopied(true);
        toast.success('URL Copied',{duration:1000});
        setTimeout(()=>setCopied(false),1000);
    }
    const onGenerate = () =>{
        if(!isValid24HrTime(data.time||'')) return toast.error('Invalid time format. Please use 24-hour format (HH:MM:SS)');
        if(!data.date) return toast.error('Please pick a date');
        if(assessment.total_points === 0 || !assessment.pass_score) return toast.error('Please set the passing score first');
        
        post(route('assessment.links.store'),{
            onSuccess:()=>toast.success('Link Generated Successfully'),
            onError:()=>toast.error('Failed to generate link')
        });
    }

    useEffect(()=>{
        if(newLink && linkRef.current) linkRef.current.value = newLink;
    },[newLink,linkRef.current]);

    const setDateToTommorow = ()=>{
        //this is only used for debugging purposes
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate()+1);
        setData(val=>({
            ...val,
            date:format(tomorrow, "yyyy-MM-dd"),
            time:'16:00:00',
        }));
        
    }

    return (
        <Dialog modal open={isOpen} onOpenChange={onClose}>
            <DialogContent className='md:min-w-[41rem]'>
                <DialogHeader>
                    <DialogTitle>
                        Share {assessment.title}
                    </DialogTitle>
                    <DialogDescription>
                        Create a Link for This Assessment
                    </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-y-1.5'>
                    {!newLink&&(<>
                        <p className='text-sm flex items-center gap-x-1'>
                            <TriangleAlertIcon className='h-5 w-5' />
                            <span>Please double check the notes below before creating a Share Link:</span>
                        </p>
                        <div className='flex flex-col gap-y-1 text-xs'>
                            {checkListItems.map((item,index)=>(
                                <div key={index} className='flex items-center gap-x-1'>
                                    <DotIcon className='h-5 w-5 text-primary shrink-0' />
                                    {item}
                                </div>
                            ))}                  
                        </div>
                        <div className='space-y-1'>
                            <Label>Set Valid Until Date:</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    disabled={processing}
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !data.date && "text-muted-foreground"
                                    )}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {data.date ? format(new Date(data.date), "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                    mode="single"
                                    selected={new Date(data.date||new Date())}
                                    onSelect={e=>e&&setData('date',format(e, "yyyy-MM-dd"))}
                                    initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className='space-y-1'>
                            <Label>Set Valid Time: (24hr Format hh:mm:ss) </Label>
                            <Input placeholder='16:00:00' disabled={processing} value={data.time} onChange={({target})=>setData('time',target.value)}  />
                        </div>
                    </>)}
                    {!!newLink&&(
                        <div className='flex items-center'>
                            <Input ref={linkRef} readOnly className='rounded-r-none border-r-0 h-9' />
                            <Button onClick={onCopy} disabled={copied} className='rounded-l-none' size='sm'>
                                <CopyIcon className='h-5 w-5 mr-2' />
                                Copy Link
                            </Button>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={onGenerate} disabled={processing} type="submit">
                        {processing&&<Loader2 className='h-5 w-5 mr-2 animate-spin' />}
                        Generate Share Link
                    </Button>
                    <Button onClick={setDateToTommorow} variant='outline'>
                        Set to Tommorow
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AssessmentShareModal;


const checkListItems =[
    'Check if the Assessment Title is correct.',
    'Check if the correct Passing Score is set.',
    'All Questions are easily understandable and clear.',
    'Each Question have the correct Point/s.',
    'Each Question have the correct Answer/s.',
    'If the Question is Type the Answer, Please make sure there are no errors in the spelling, and remove any unnecessary spaces and special characters.',
    'If the Question is Multiple Choice, or Multiple Answer, Please make sure there are at least 2 or 3 choices.',
    'If the Question is Enumeration, Please make sure there are at least 2 enumeration items.',
    'Any question that does not meet the criteria above will not be shown during the assessment!'
];