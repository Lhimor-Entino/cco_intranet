import { ChangeEventHandler, FC, useState } from "react";

import { Label } from '@/Components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion';
import { toast } from "sonner";
import { Check, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import QuestionView from "./QuestionView";
import MultipleAnswersPanel from "./MultipleAnswersPanel";
import { Textarea } from "@/Components/ui/textarea";
import { TrainingAssessmentResultAnswer } from "@/types/trainingInfo";


interface AssessmentAnswerItemProps {
    answer:TrainingAssessmentResultAnswer;
    questionNo:string
    onScoreChange:(resultAnswerId:number,score:number)=>void
}

const AssessmentResultAnswerItem:FC<AssessmentAnswerItemProps> = ({answer,questionNo,onScoreChange}) => {

    const [score,setScore] = useState(answer.score);
    const onPointChange:ChangeEventHandler<HTMLInputElement> = ({target}) => {
        //set to 0 if target.value is less than 0 or blank
        if(parseInt(target.value)<0 || target.value==='') return setScore(0);
        //return if target.value is not a number
        if(isNaN(parseInt(target.value))) return;
        setScore(parseInt(target.value));
    }

    const onScoreSet = () =>{
        if(score>answer.points) return toast.error('Score cannot be greater than the question points');
        onScoreChange(answer.id,score);
    }

    return (
        <AccordionItem value={answer.id.toString()}>
            <AccordionTrigger asChild>
                <div role='button' className='w-full h-10 px-4 py-2 bg-secondary/50 text-secondary-foreground hover:bg-secondary/80 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors'>
                    <p className='w-1/2 text-right'>
                        Question #{questionNo}&nbsp;
                        {answer.needs_manual_check===1&&(
                            <span className='italic text-xs text-muted-foreground'>
                                - Needs manual check
                            </span>)
                        }
                    </p>
                    <ChevronsUpDownIcon className='mr-auto h-3.5 w-3.5 ml-2.5 stroke-[3.5px]' />
                </div>
            </AccordionTrigger>
            <AccordionContent asChild>
                <div className='py-3.5 flex flex-col gap-y-1.5 md:flex-row md:gap-y-0 md:gap-x-1 md:items-stretch'>                    
                    <div className={cn('space-y-2.5 w-full border rounded p-2.5 flex gap-x-1',(answer.question_type===5 || answer.question_type===4),'flex-col gap-x-0')}>
                        <div className='space-y-1 flex-1'>
                            <div className='flex items-center justify-between'>
                                <Label className='text-muted-foreground'>Question: ({answer.points} pts.) </Label>
                                <div className='space-y-1'>
                                    <Label>User Score:</Label>
                                    <div className='flex flex-row items-center'>
                                        <Input className='w-[4.5rem] !ring-0 !ring-offset-0 h-9 border-r-0 rounded-r-none' value={score} onChange={onPointChange} />
                                        <Button onClick={onScoreSet} variant='secondary'  size='sm' className='border-l-0 rounded-l-none'>
                                            <Check className='h-5 w-5' />
                                        </Button>
                                    </div>
                                </div>
                            </div>                         
                            <QuestionView question={answer.question} id={answer.id} />                            
                        </div>
                        <div className='space-y-1'>
                            {(answer.question_type===1||answer.question_type===3) && (
                                <>
                                    <div className='space-y-1'>
                                        <Label className='text-muted-foreground'>User Answer:</Label>
                                        <Input className='!ring-0 !ring-offset-0' value={answer.user_answer} readOnly />
                                    </div>
                                    <div className='space-y-1'>
                                        <Label className='text-muted-foreground'>Correct Answer:</Label>
                                        <Input className='!ring-0 !ring-offset-0' value={answer.correct_answer} readOnly />
                                    </div>
                                </>
                            )}
                            {(answer.question_type===2||answer.question_type===4) && <MultipleAnswersPanel result={answer} />}
                            {(answer.question_type===5) && (
                                <div className='space-y-1'>
                                    <Label>User Answer</Label>
                                    <Textarea readOnly value={answer.user_answer} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};

export default AssessmentResultAnswerItem;