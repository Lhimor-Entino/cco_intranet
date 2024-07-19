import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Separator } from '@/Components/ui/separator';
import { PageProps, Project } from '@/types';
import { IndividualPerformanceMetric, MetricFormat } from '@/types/metric';
import { Page } from '@inertiajs/inertia';
import { useForm, usePage } from '@inertiajs/inertia-react';
import { Loader2 } from 'lucide-react';
import {ChangeEventHandler, FC, FormEventHandler, useEffect, useState} from 'react';
import { toast } from 'sonner';

interface Props {
    isOpen:boolean;
    onClose:()=>void;
    metric?:IndividualPerformanceMetric;
    project:Project
}

const MetricModal:FC<Props> = ({isOpen,onClose,metric,project}) => {
    const {metric_formats} = usePage<Page<PageProps>>().props;
    const [noGoal, setNoGoal] = useState(false);
    const {data,setData,processing,reset,post} = useForm<{
        project_id:number;
        metric_name:string;
        goal:number;
        format:MetricFormat;
        unit?:string;
        rate_unit?:string;
    }>({
        metric_name:metric?.metric_name||"",
        goal:metric?.goal||0,
        format:metric?.format||"number",
        unit:metric?.unit||"",
        rate_unit:metric?.rate_unit||"",
        project_id:project.id
    });
    
    useEffect(()=>{
        if(!isOpen) return reset();
        if(isOpen && !!metric){
            /*
            $duration = 0;
            if($request->format=='duration' && $request->unit=='Minutes') $duration = $request->goal;
            if($request->format=='duration' && $request->unit=='Hours') $duration = $request->goal*60;
            if($request->format=='duration' && $request->unit=='Seconds') $duration = $request->goal/60;
            */
            const goal = () => {
                if(metric.format === 'duration' && metric.unit === 'Minutes') return metric.goal;
                if(metric.format === 'duration' && metric.unit === 'Hours') return metric.goal/60;
                if(metric.format === 'duration' && metric.unit === 'Seconds') return metric.goal*60;
                return metric.goal;
            }
            setData(val=>({
                ...val,
                metric_name:metric.metric_name,
                goal:goal(),
                format:metric.format,
                unit:metric.unit,
                rate_unit:metric.rate_unit
            }));
            if(metric.goal === 0) setNoGoal(true);
        } 
    },[isOpen,metric]);

    const handleToggleNoGoal = () => {
        setNoGoal(val=>!val);
        setData('goal',0);
    }

    const handleSetGoal:ChangeEventHandler<HTMLInputElement> = (e) => {
        const val = e.target.value;
        if(val === '' || !val) return setData('goal',0);
        const num = parseInt(val);
        if(isNaN(num)) return;
        setData('goal',num);
    }

    

    const onSubmit:FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const href = metric?route('individual_performance_dashboard.update',{metric_id:metric.id}):route('individual_performance_dashboard.store');
        if(data.goal===0 && !noGoal) return toast.error('Goal cannot be zero. Check the "No Daily Goals" checkbox instead.');
        if(data.unit === "") return toast.error('Unit is required');
        if(data.format === 'duration' && (!['Hours','Minutes','Seconds'].includes(data.unit||""))) return toast.error('Select Unit');
        post(href,{
            onSuccess:()=>onClose(),
            onError:e=>{
                toast.error('An error occurred. Please try again ');
                console.error(e);
            }
        });
    }

    const onFormatChange = (format:MetricFormat) => {
        const unit = format === 'percentage'?'%':format === 'duration'?'Minutes':'Calls';
        setData(val=>({
            ...val,
            format,
            unit:format==='duration'?'minutes':unit
        }));
    }

    const handleUnitChange = (e:string) =>{
        setData(val=>{
            const goal = () =>{
                //from seconds to minutes
                if(val.format === 'duration' && e === 'Minutes' && val.unit==='Seconds') return val.goal/60.00;
                //from seconds to hours
                if(val.format === 'duration' && e === 'Hours' && val.unit==='Seconds') return val.goal/3600.00;
                //from minutes to seconds
                if(val.format === 'duration' && e === 'Seconds' && val.unit==='Minutes') return val.goal*60.00;
                //from minutes to hours
                if(val.format === 'duration' && e === 'Hours' && val.unit==='Minutes') return val.goal/60.00;
                //from hours to minutes
                if(val.format === 'duration' && e === 'Minutes' && val.unit==='Hours') return val.goal*60.00;
                //from hours to seconds
                if(val.format === 'duration' && e === 'Seconds' && val.unit==='Hours') return val.goal*3600.00;
                return val.goal;
            }
            return {...val,goal:goal(),unit:e};
        });
    }

    const title = metric?
        `Edit Metric - ${metric.metric_name} for ${project.name}`
        :"Add Metric for " + project.name;
    const description = metric?"Edit the metric details below":"Fill in the details below to add a new metric";
    const unitPlaceholder = data.format === 'rate' || data.format === 'number'?'Calls/Emails':data.format === 'duration'?'Minutes':'%';
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
                        <Input disabled={processing} required autoFocus autoComplete='off' value={data.metric_name} onChange={(e)=>setData('metric_name',e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-y-1.5 md:flex-row md:items-center md:gap-x-2.5 md:gap-y-0'>
                        <div className='space-y-1 md:flex-1'>
                            <Label>Metric Format</Label>
                            <Select value={data.format} onValueChange={(e:MetricFormat)=>onFormatChange(e)}>
                                <SelectTrigger disabled={processing}  className="w-full capitalize">
                                    <SelectValue  placeholder="Select a Format" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Formats</SelectLabel>
                                        {metric_formats.map((format) => <SelectItem key={format} value={format} className='capitalize'>{format}</SelectItem>)}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='flex items-center gap-x-2.5'>
                            <div className='w-full md:w-28 space-y-1'>
                                <Label>Unit</Label>
                                {data.format!=='duration'&&<Input className='placeholder:text-xs placeholder:tracking-tight' required placeholder={unitPlaceholder} disabled={processing || data.format==='percentage'} value={data.unit} onChange={(e)=>setData('unit',e.target.value)} />}
                                {data.format=='duration'&&(
                                    <Select value={data.unit} onValueChange={handleUnitChange}>
                                    <SelectTrigger disabled={processing}  className="w-full capitalize">
                                        <SelectValue  placeholder="Select a Duration Unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Duration</SelectLabel>
                                            <SelectItem value='Seconds' >Seconds</SelectItem>
                                            <SelectItem value='Minutes' >Minutes</SelectItem>
                                            <SelectItem value='Hours' >Hours</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                )}
                            </div>
                            {data.format === 'rate' && (
                                <>
                                    <div className='mt-auto flex flex-col items-center justify-center gap-y-[-0.125rem]'>
                                        <Label className='text-xs'>P</Label>
                                        <Label className='text-xs'>E</Label>
                                        <Label className='text-xs'>R</Label>
                                    </div>
                                    <div className='w-full md:w-28 space-y-1'>
                                        <Label>Rate Unit</Label>
                                        <Input className='placeholder: text-xs tracking-tight' required placeholder='Hour/30 Mins.' disabled={processing} value={data.rate_unit||""} onChange={(e)=>setData('rate_unit',e.target.value)} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className='flex flex-col gap-y-2'>                        
                        <Label className='flex justify-between'>
                            <span>Daily Goal</span>
                            <div className="flex items-center space-x-2">
                                <Checkbox checked={noGoal} onCheckedChange={handleToggleNoGoal} id="no_goal" />
                                <label htmlFor="no_goal" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >
                                    No Daily Goals
                                </label>
                            </div>
                        </Label>
                        <div className='relative'>
                            <Input required={!noGoal} disabled={processing || noGoal} type='text' value={data.goal} onChange={handleSetGoal} />
                            <Label className='text-muted-foreground absolute right-3.5 top-3.5'>
                                {data.format !== 'rate'?data.unit: `${data.unit} per ${data.rate_unit}` }
                            </Label>
                        </div>
                    </div>
                    <Button type='submit' disabled={processing} className='ml-auto' size='sm' >
                        {processing && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
                        Save Changes
                    </Button>
                </form>
                {!!metric&&(
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

export default MetricModal;