import { Button } from '@/Components/ui/button';
import { Calendar } from '@/Components/ui/calendar';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { Textarea } from '@/Components/ui/textarea';
import { cn } from '@/lib/utils';
import { User } from '@/types';
import { useForm } from '@inertiajs/inertia-react';
import { format } from 'date-fns';
import { AsteriskIcon, CalendarIcon, ImagePlus, Loader2, XIcon } from 'lucide-react';
import {ChangeEventHandler, FC, FormEventHandler} from 'react';
import { toast } from 'sonner';

interface Props {
    user:User;
}

const EmployeeViolationForm:FC<Props> = ({user}) => {
    const {data,setData,reset,processing,post} = useForm<{
        user_id:number;
        violation:string;
        date:Date|undefined;
        description:string;
        images:File[]|null;
    }>({user_id:user.id,violation:'',date:undefined,description:'',images:null});

    const handleImageSelect:ChangeEventHandler<HTMLInputElement> = e =>{
        if(!e.currentTarget.files) return;
        const {files} = e.currentTarget;
        //check if files contains only jpg/jpeg/png/webp
        const validFiles = Array.from(files).filter(file=>['image/jpeg','image/png','image/webp'].includes(file.type));
        setData(val=>({...val,images:[...(val.images||[]),...validFiles]}));
    }

    const onSubmit:FormEventHandler<HTMLFormElement> = e =>{
        if(!data.date) return toast.error('Please select a date.');
        e.preventDefault();
        post(route('violation.store'),{
            onSuccess:()=>reset(),
            onError:()=>toast.error('An error occurred. Please try again.')
        });
    }

    return (
        <form onSubmit={onSubmit} className='flex flex-col gap-y-2.5'>
            <div className='space-y-1'>
                <Label className='flex items-center'><span>Violation/Reason</span> <AsteriskIcon className='h-3 w-3 ml-2 text-destructive' /> </Label>
                <Input required autoFocus disabled={processing} value={data.violation} onChange={(e)=>setData('violation',e.currentTarget.value)} />
            </div>
            <div className='space-y-1'>
                <Label>Description</Label>
                <Textarea autoFocus disabled={processing} value={data.description} onChange={(e)=>setData('description',e.currentTarget.value)} />
            </div>
            <div className='space-y-2'>
                <Label className='flex items-center'><span>Violation Date</span> <AsteriskIcon className='h-3 w-3 ml-2 text-destructive' /></Label>
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
                        {data.date ? format(data.date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={data.date}
                        onSelect={e=>e&&setData('date',e)}
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className='flex flex-col gap-y-2.5'>
                <Label>Scanned Document/s</Label>
                <div className='flex items-center'>
                    <Label role='button' className='flex items-center gap-x-2' htmlFor='images'>                        
                        <ImagePlus className='h-5 w-5 mr-2' />
                        <span className='text-sm text-muted-foreground'>Click Here to Add Image/s</span>                    
                    </Label>
                    {/* accept only jpg/jpeg/png/webp */}
                    <input
                        accept='image/jpeg,image/png,image/webp'  
                        onChange={handleImageSelect} id='images' type='file' multiple hidden />
                </div>
                {data.images&&data.images.map(image=>(
                    <div key={image.name} className='flex items-center justify-between'>
                        <div className='flex items-center gap-x-1'>
                            <img src={URL.createObjectURL(image)} alt={image.name} className='h-12 w-12 object-contain rounded-md' />
                            <p className='truncate'>{image.name}</p>
                        </div>
                        <Button type='button' size='icon' variant='ghost' onClick={()=>setData('images',data.images&&data.images.filter(i=>i.name!==image.name))}>
                            <XIcon />
                        </Button>
                    </div>
                ))}
            </div>
            <div className='flex items-center justify-end gap-x-2 mt-9'>
                <Button type='button' disabled={processing} size='sm' onClick={()=>reset()}>Reset</Button>
                <Button variant='outline' type='submit' disabled={processing} size='sm'>
                    {processing && <Loader2 className='h-4 w-4 mr-2 animate-spin' />} 
                    Add Violation
                </Button>
            </div>
        </form>
    );
};

export default EmployeeViolationForm;