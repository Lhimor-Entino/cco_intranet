import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';
import { TrainingAssessmentQuestion } from '@/types/trainingInfo';
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';
import {FC} from 'react';

interface Props {
    questions:TrainingAssessmentQuestion[];
    currentQuestionIndex:number;
    currentQuestionId:number;
    onFirst:()=>void;
    onPrevious:()=>void;
    onNext:()=>void;
    onLast:()=>void;
    setCurrentQuestionIndex:(id:number)=>void;
    processing?:boolean;
}

const AssessmentPagination:FC<Props> = ({questions,currentQuestionIndex,onFirst,onPrevious,onNext,onLast,setCurrentQuestionIndex,currentQuestionId,processing}) => {
    return (
        <div className='h-auto flex items-center justify-center gap-x-0.5'>
            <Button className='h-8' variant='outline' onClick={onFirst} disabled={currentQuestionIndex===0||processing}>
                <ChevronsLeftIcon className='w-5 h-5' />
                First
            </Button>
            <Button className='h-8' variant='outline' onClick={onPrevious} disabled={currentQuestionIndex===0||processing}>
                <ChevronLeftIcon className='w-5 h-5' />
                Previous
            </Button>
            {questions.map(((q,i)=>(
                <Button disabled={processing} key={q.id} className={cn('h-8 !transition-all',((Math.abs(currentQuestionIndex-i))>=6)&&'hidden')} variant={currentQuestionIndex===i?'default':'outline'} onClick={()=>currentQuestionId!==q.id&&setCurrentQuestionIndex(q.id)} >
                    {i+1}
                </Button>
            )))}
            <Button className='h-8' variant='outline' onClick={onNext} disabled={currentQuestionIndex===(questions.length-1)||processing}>
                Previous
                <ChevronRightIcon className='w-5 h-5' />
            </Button>
            <Button className='h-8' variant='outline' onClick={onLast} disabled={currentQuestionIndex===(questions.length-1)||processing}>
                Last
                <ChevronsRightIcon className='w-5 h-5' />
            </Button>
        </div>
    );
};

export default AssessmentPagination;