
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { TableCell, TableRow } from '@/Components/ui/table';
import { cn } from '@/lib/utils';
import { User } from '@/types';
import { QAElement } from '@/types/QAElement';
import axios from 'axios';
import { CheckCircle, CircleCheckBig, Loader2, SaveIcon } from 'lucide-react';
import {FC, useState} from 'react';
import { toast } from 'sonner';
import { useTransition } from 'transition-hook';

interface Props {
    elements: QAElement[];
    agent:User;    
    hideSaved?:boolean;
    date:Date;
    showName:boolean;
}

type formDataType = {
    qa_element_id:number;
    qa_element_score_id:number; 
    score:number;
    not_applicable:boolean;
    element:QAElement;
}

const QAScoringItem= ({elements,agent,hideSaved=false,date,showName}:Props) => {
    
    const [loading,setLoading] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);
    const isVisible = () =>{
        if(!hideSaved) return true;
        if(hideSaved && !hasSaved) return true;
        if(hideSaved && hasSaved) return false;
        return true
    };
    const {stage, shouldMount} = useTransition(isVisible(), 300) // (state, timeout)  
    const [formData, setFormData] = useState<formDataType[]>(elements.map(element=>{
        const user_score = agent.user_elements.find(um=>um.qa_element_id === element.id);
       
        return {
            qa_element_id:element.id,
            qa_element_score_id:user_score?.id ?? 0,
            score:user_score?.score ?? 0,
            not_applicable:user_score?.is_applicable == 0,
            element
        }
    }));

    const handleChange = (id:number,value:string) => {
        //return if value is not a number
        if(isNaN(+value)) return;
        const score = +value;
        setFormData(formData.map(data=>data.qa_element_id === id ? {...data,score} : data));
    };

    const handleNotApplicable = (id:number) =>()=> setFormData(formData.map(data=>data.qa_element_id === id ? {...data,not_applicable:!data.not_applicable,score:0} : data));
    

    const onSubmit = () =>{

        //return a toast if a score from formData is 0 and not_applicable is false
        const hasZeroScore = formData.some(data=>data.score===0 && !data.not_applicable);
        /**Suggested to allow input 0 in rating agent Commented By: Josh**/
        // if(hasZeroScore) return toast.error('Please make sure a score is not zero. Tick N/A if not applicable instead')

        setLoading(true);
        axios.post(route('qa_group.save_rating'),{
            date,
            user_id:agent.id,
            scores:formData.map(data=>({
                qa_element_id:data.qa_element_id,
                qa_element_score_id:data.qa_element_score_id,
                score:data.score,
                not_applicable:data.not_applicable
            }))
        }).then(()=>{
            setHasSaved(true);
            toast.success('Saved',{duration:1234});
        }).catch(e=>{
            toast.error('Error saving rating. Please try again');
            console.error(e);
        }).finally(()=>setLoading(false));
    }

    const Icon = loading?Loader2:CircleCheckBig;
    return (
        <>
            {shouldMount&&(
                <TableRow className={cn('transition duration-300',stage==='enter'?'opacity-100':'opacity-0')} >
                    <TableCell className='sticky left-0 bg-background shadow-[1px_0] shadow-primary z-50'>
                        <div className='flex items-center'>
                            {showName?<span>{`${agent.company_id}, ${agent.first_name} ${agent.last_name} `}</span>:<span>{`${agent.company_id}`}</span>}
                            <CheckCircle className={cn('h-4 w-4 ml-auto transition duration-300 shrink-0',hasSaved?'text-success':'text-muted-foreground')} />
                        </div>
                    </TableCell>
                    {formData.map(element=>(
                            <TableCell key={element.qa_element_id} >
                                <div className='flex items-center'>
                                    <div className='relative'>                                
                                        <Input type="number" autoComplete='off' id={`{item-${element.qa_element_id.toString()}}`} disabled={loading||element.not_applicable} className='[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none h-9 w-64 text-left rounded-r-none' placeholder='0' value={element.score} onChange={e=>{ e.target.value = e.target.value.replace(/^0+(?=\d)/,''); return handleChange(element.qa_element_id,e.target.value)}} />
                                        <label htmlFor={`{item-${element.qa_element_id.toString()}}`} className={cn('top-2.5 right-2.5 text-muted-foreground italic text-xs absolute transition duration-300',element.not_applicable && 'opacity-50')}>
                                            Score
                                        </label>
                                    </div>
                                    <Button  tabIndex={-1} onClick={handleNotApplicable(element.qa_element_id)} size='sm' className='rounded-l-none' variant={element.not_applicable?'outline':'info'}>
                                        N/A
                                    </Button>
                                </div>
                            </TableCell>
                        ))}
                    <TableCell className='flex items-center justify-end'>
                        <Button disabled={loading} onClick={onSubmit} size='icon_sm'>
                            <Icon className={cn(loading&&'animate-spin')} />
                        </Button>
                    </TableCell>
                </TableRow>  
            )} 
        </>
    );
};

export default QAScoringItem;

