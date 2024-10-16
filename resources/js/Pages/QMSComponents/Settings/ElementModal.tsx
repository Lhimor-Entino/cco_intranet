import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Separator } from '@/Components/ui/separator';
import { PageProps, Project, Setting } from '@/types';
import { IndividualPerformanceMetric, MetricFormat } from '@/types/metric';
import { QAElement } from '@/types/QAElement';
import { Page } from '@inertiajs/inertia';
import { useForm, usePage } from '@inertiajs/inertia-react';
import { round } from 'lodash';
import { ArrowDown, ArrowDownWideNarrow, ArrowUp, ArrowUp01, ArrowUpNarrowWide, ArrowUpWideNarrow, Loader2 } from 'lucide-react';
import {ChangeEventHandler, FC, FormEventHandler, useEffect, useState} from 'react';
import { toast } from 'sonner';

interface Props {
    isOpen:boolean;
    onClose:()=>void;
    element?:QAElement;
    project:Project;
}

const ElementModal:FC<Props> = ({isOpen,onClose,element,project}) => {
    const {metric_formats} = usePage<Page<PageProps>>().props;
    const [noGoal, setNoGoal] = useState(false);
    const {data,setData,processing,reset,post} = useForm<{
        project_id:number;
        qa_element:string;
        goal:number;
    }>({
        project_id:project.id,
        qa_element:element?.qa_element||"",
        goal:element?.goal||0
    });
    
    useEffect(()=>{
        if(!isOpen) return reset();
        if(isOpen && !!element){
            setData(val=>({
                ...val,
                qa_element:element.qa_element,
                goal:element.goal,
            }));
            if(element.goal === 0) setNoGoal(true);
        } 
    },[isOpen,element]);

    const handleToggleNoGoal = () => {
        setNoGoal(val=>!val);
        setData('goal',0);
    }

    const handleSetGoal:ChangeEventHandler<HTMLInputElement> = (e) => {
        const val = e.target.value;
        if(val === '' || !val) return setData('goal',0);
        e.target.value = e.target.value.replace(/^0+(?=\d)/,'');
        // const num = (data.format === 'duration'? parseInt(val) : parseFloat(val));
        const num = parseFloat(val);
        if(isNaN(num)) return;
        setData('goal',num);
    }

    

    const onSubmit:FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const href = element? route('quality_management_system.update',{id:element.id}):route('quality_management_system.store');
        post(href,{
            onSuccess:()=>onClose(),
            onError:e=>{
                toast.error('An error occurred. Please try again ');
                console.error(e);
            }
        });
    }

    // const onSettingChange = (value:string) => {
    //    setData(val => ({
    //      ...val,
    //      setting:{
    //         ...val.setting,
    //         value:value
    //      }
    //    }));
    // }


    const title = element?
        `Edit QA Element - ${element.qa_element} for ${project.name}`
        :"Add QA Element for " + project.name;
    const description = element?"Edit the QA Element details below":"Fill in the details below to add a new QA Element";
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='w-full max-w-[45rem] min-w-[24rem]'>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className='flex flex-col gap-y-5 '>
                    <div className='space-y-1'>
                        <Label>Metric Name</Label>
                        <Input disabled={processing} required autoFocus autoComplete='off' value={data.qa_element} onChange={(e)=>setData('qa_element',e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-y-2'>                        
                        <Label className='flex justify-between'>
                            <span>Max Score</span>
                            <div className="flex items-center space-x-2">
                                <Checkbox checked={noGoal} onCheckedChange={handleToggleNoGoal} id="no_goal" />
                                <label htmlFor="no_goal" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >
                                    No Daily Goals
                                </label>
                            </div>
                        </Label>
                        <div className='relative'>
                            <Input required={!noGoal} disabled={processing || noGoal} type='number' step="0.01" className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" value={round(data.goal,2)} onChange={handleSetGoal} />
                            <Label className='text-muted-foreground absolute right-3.5 top-3.5'>
                               Score
                            </Label>
                        </div>
                    </div>
                    {/* <Separator className='border'/> */}
                    {/* <small>Dashboard Settings (<b>Top Performer Order</b>)</small> */}
                    {/* <RadioGroup disabled={processing} onValueChange={onSettingChange}  value={data.setting.value} className="flex space-x-4">
                        <div className="flex items-center space-x-4">
                            <RadioGroupItem value="DESC" id="desc" />
                            <ArrowDownWideNarrow/>
                            <Label htmlFor="desc">Descending</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                            <RadioGroupItem value="ASC" id="asc" />
                            <ArrowUpNarrowWide/>
                            <Label htmlFor="asc">Ascending </Label>
                        </div>
                    </RadioGroup> */}
                    <Button type='submit' disabled={processing} className='ml-auto' size='sm' >
                        {processing && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
                        Save Changes
                    </Button>
                </form>
                {!!element&&(
                    <DialogFooter>
                        <DialogDescription>
                            Becareful when editing metrics. This will affect all agents' ratings for this metric. <br />
                            Please create a new metric instead.
                        </DialogDescription>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ElementModal;