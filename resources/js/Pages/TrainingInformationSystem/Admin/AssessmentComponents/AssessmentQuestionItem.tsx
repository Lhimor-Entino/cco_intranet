import { AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion';
import { TrainingAssessmentQuestion } from '@/types/trainingInfo';
import {FC, useMemo} from 'react';
import QuestionYooptaEditor from './QuestionYooptaEditor';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { CheckSquare, ChevronsUpDownIcon, PencilLineIcon, Square, Trash2 } from 'lucide-react';
import { Checkbox } from '@/Components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Input } from '@/Components/ui/input';

interface Props {
    question:TrainingAssessmentQuestion;
    index:number;
    onEdit:()=>void;
    onDelete:()=>void;
}

const AssessmentQuestionItem:FC<Props> = ({question,index,onEdit,onDelete}) => {
    return (
        <AccordionItem value={question.id.toString()}>
            <AccordionTrigger asChild>
                <div role='button' className='w-full h-10 px-4 py-2 bg-secondary/50 text-secondary-foreground hover:bg-secondary/80 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors'>
                    <p className='w-1/2 text-right'>
                        Question #{(index+1).toString()}&nbsp;
                        <span className='italic text-xs font-light'>({`${question.question_type_description.description} - ${question.points} Point/s`})</span>
                    </p>
                    <ChevronsUpDownIcon className='mr-auto h-3.5 w-3.5 ml-2.5 stroke-[3.5px]' />
                </div>
            </AccordionTrigger>
            <AccordionContent asChild>
                <div className='flex flex-col gap-y-1.5 md:flex-row md:gap-y-0 md:gap-x-1 md:items-stretch'>
                    
                    <div className='space-y-2.5 lg:w-[45rem] border rounded p-2.5'>
                        <div className='space-y-1'>
                            <div className='flex items-center justify-between'>
                                <Label className='text-muted-foreground'>Question:</Label>   
                                
                                <div className='flex items-center gap-x-2'>
                                    <Button onClick={onEdit} variant='secondary' size='sm'><PencilLineIcon className='h-5 w-5 mr-2' />Edit</Button>
                                    <Button onClick={onDelete} variant='secondary' size='sm'><Trash2 className='h-5 w-5 mr-2' />Delete</Button>
                                </div>
                            </div>                         
                            <QuestionYooptaEditor readonly question={question} />
                            
                        </div>
                    </div>
                    <div className='flex flex-col gap-y-3.5 border p-2.5 rounded lg:flex-1 grow'>
                        <div className='flex flex-row items-center gap-x-2'>
                            <Label className='text-muted-foreground'>Question Type:</Label>
                            <p className='font-bold text-lg tracking-wide'>{question.question_type_description.description}</p>
                        </div>
                        <div className='flex flex-row items-center gap-x-2'>
                            <Label className='text-muted-foreground'>Point/s:</Label>
                            <p className='font-bold text-lg tracking-wide'>{question.points}</p>
                        </div>
                        
                        {(question.question_type===1 || question.question_type===2)&&(
                            <div className='flex flex-col gap-y-1.5'>
                                <Label className='text-muted-foreground'>Choices:</Label>
                                <div className='flex flex-col gap-y-1.5'>
                                    {(question.choices||[]).map((choice,index) => <ChoiceItem key={choice.id} choice={choice.choice} question={question} />)}
                                </div>
                            </div>
                        )}
                        {(question.question_type===1 || question.question_type===2) && (
                            <div className='flex flex-row items-center gap-x-2'>
                                <Label className='text-muted-foreground'>Answer/s:</Label>
                                <p className='font-bold text-lg tracking-wide'>{question.formatted_answer}</p>
                            </div>
                        )}

                        {question.question_type===3 && (
                            <div className='space-y-1'>
                                <Label>Corrent Answer:</Label>
                                <Input readOnly value={question.answer} />
                            </div>
                        )}

                        {question.question_type===4 && (
                            <div className='space-y-1'>
                                <Label>Enumeration Items:</Label>
                                <div className='flex flex-col gap-y-1.5'>
                                    {(question.enum_items||[]).map((item,index) => (
                                        <div key={index} className='flex flex-row items-center'>
                                            <Button variant='secondary' className='h-9 w-9 flex-1 pointer-events-none rounded-r-none'>
                                                {index}
                                            </Button>
                                            <Input readOnly value={item.item} className='rounded-l-none h-9' />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};

export default AssessmentQuestionItem;

interface ChoiceItemProps {
    choice:string;
    question:TrainingAssessmentQuestion;
}

const ChoiceItem:FC<ChoiceItemProps> = ({choice,question}) => {
    const isAnswer = useMemo(()=>{
        if(question.question_type===1 && question.answer===choice) return true;
        if(question.question_type===2 && question.answer.split('|').includes(choice)) return true;
        return false;
    },[question.answer,choice]);
    const Icon = isAnswer?CheckSquare:Square;
    return (
        <div className='flex items-center'>
            <Button size='sm' variant={isAnswer?'default':'secondary'} className='rounded-r-none pointer-events-none'>
                <Icon className='h-6 w-6' />
            </Button>
            <div className={cn('h-9 border  rounded-r-md flex-1 flex items-center px-1.5',!isAnswer?'border-border':'border-muted-foreground/80')}>
                <span className='text-sm'>{choice}</span>
            </div>
        </div>
    );
}