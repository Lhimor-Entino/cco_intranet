import Header from '@/Components/Header';
import Layout from '@/Components/Layout/Layout';
import { TrainingAssessment, TrainingAssessmentQuestion } from '@/types/trainingInfo';
import { Head, useForm } from '@inertiajs/inertia-react';
import {ChangeEventHandler, FC, useEffect, useState} from 'react';
import QuestionYooptaEditor from '../Admin/AssessmentComponents/QuestionYooptaEditor';
import { Button } from '@/Components/ui/button';
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, Loader2, SendHorizonalIcon, StepForward, StepForwardIcon } from 'lucide-react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { cn } from '@/lib/utils';
import { Textarea } from '@/Components/ui/textarea';
import AssessmentPagination from './AssessmentPagination';
import { toast } from 'sonner';

interface Props {
    assessment:TrainingAssessment;
    uuid:string;
}

const TrainingAssessmentPage:FC<Props> = ({assessment,uuid}) => {
    
    const questions = (assessment.questions||[]).filter((question)=>question.points>0);
    const questionLength = questions.length;
    
    const [currentQuestionIndex,setCurrentQuestionIndex] = useState(0);
    const currentQuestion = questions[currentQuestionIndex];
    
    const {data,setData,processing,post} = useForm({
        'uuid':uuid,
        'training_assessment_id':assessment.id,
        userAnswers: [] as {question_id:number,answer:string}[]
    });
    
    const answeredQuestions = data.userAnswers.filter((uA)=>uA.answer.length>0).length;
    

    const onSetAnswer = (qId:number,answer:string) => {
        setData(val=>({
            ...val,
            userAnswers: val.userAnswers.find(uA=>uA.question_id===qId)?
                val.userAnswers.map(uA=>uA.question_id===qId?{question_id:qId,answer}:uA):
                [...val.userAnswers,{question_id:qId,answer}]
        }));
    }

    const onSubmit = () =>{
        if(answeredQuestions<questionLength) return toast.error('Please answer all questions before submitting');
        post(route('assessment.agent.store'),{
            onSuccess:()=>toast.success('Assessment submitted successfully'),
            onError:()=>toast.error('Internal Error. Failed to submit assessment. Please try again.')
        })
    }

    const onNext = () =>{
        const answer = data.userAnswers.find(uA=>uA.question_id===currentQuestion.id)?.answer||"";
        if(answer.length<1) return toast.error('Please answer the question before proceeding');
        setCurrentQuestionIndex(val=>val+1);
    }

    const SubmitIcon = !processing?SendHorizonalIcon:Loader2;

    return (
        <>
            <Head title={assessment.title} />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container pb-2.5'>
                    <div className='h-auto flex items-center justify-between'>
                        <p className='text-lg font-bold '>
                            {assessment.title}
                        </p>
                        <div className='flex flex-col gap-y-1'>
                            <p className='text-sm text-muted-foreground'>Total Questions: {questionLength}</p>
                            <p className='text-sm text-muted-foreground'>Answered Questions {`${answeredQuestions.toString()}/${questionLength.toString()}`}</p>
                        </div>
                    </div>
                    <div className='flex-1 rounded border border-border p-2.5 overflow-y-auto'>
                        <div className='flex justify-between items-center'>
                            <p className='text-primary/80 tracking-tight font-bold'>{`Question #${(currentQuestionIndex+1).toString()} - ${currentQuestion.question_type_description.description}`}</p>
                            {currentQuestionIndex<questionLength-1 && (
                                <Button disabled={processing} variant='secondary' size='sm' onClick={onNext}>
                                    Next Question
                                    <StepForwardIcon className='h-5 w-5 ml-2' />
                                </Button>
                            )}
                            {currentQuestionIndex===questionLength-1 && (
                                <Button disabled={processing} variant='secondary' size='sm' onClick={onSubmit}>
                                    Submit Answers
                                    <SubmitIcon className={cn('h-5 w-5 ml-2',processing&&'animate-spin')} />
                                </Button>
                            )}
                        </div>
                        <QuestionYooptaEditor question={currentQuestion} readonly />
                        <AnswerPanel question={currentQuestion} onAnswer={onSetAnswer} answer={data.userAnswers.find(uA=>uA.question_id===currentQuestion.id)?.answer||""} />
                        
                    </div>
                    <div className='h-auto flex items-center justify-center gap-x-0.5'>
                        <AssessmentPagination 
                            questions={questions} 
                            currentQuestionIndex={currentQuestionIndex} 
                            currentQuestionId={currentQuestion.id}
                            setCurrentQuestionIndex={id=>setCurrentQuestionIndex(questions.findIndex(q=>q.id===id))} 
                            onFirst={()=>setCurrentQuestionIndex(0)}
                            onPrevious={()=>setCurrentQuestionIndex(val=>val-1)}
                            onNext={()=>setCurrentQuestionIndex(val=>val+1)}
                            onLast={()=>setCurrentQuestionIndex(questions.length-1)}                            
                            />
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default TrainingAssessmentPage;

interface AnswerPanelProps {
    question:TrainingAssessmentQuestion;
    onAnswer:(qId:number,answer:string)=>void;
    answer:string;
}

const AnswerPanel:FC<AnswerPanelProps> = ({question,onAnswer,answer,}) =>{
    const answers = (question.question_type===2)?answer.split('|'):[];
    const onMultipleChoiceAnswer = (choice:string) => {
        //limit the number of answers to 2, deselect the first answer if answers.length is 2
        if(answers.includes(choice)){
            onAnswer(question.id,answers.filter(a=>a!==choice).join('|'));
        }else if(answers.length<2){
            onAnswer(question.id,[...answers,choice].join('|'));
        }else if(answers.length===2){
            //de-select the first answer, and select the current choice
            onAnswer(question.id,[answers[1],choice].join('|'));
        }
    }

    const enumAnswers = question.question_type===4?
        !answer?
            Array.from({length:question.enum_item_count},()=> ''):
            answer.split('|'):
        [];

    const onEnumerationAnswer = (idx:number,answer:string) =>  onAnswer(question.id,enumAnswers.map((a,i)=>i===idx?answer:a).join('|'));
    

    return (
        <div className='flex flex-col gap-y-2.5'>
            {question.question_type===1 && (
                <>
                    <Label>Multiple Choice Single Answer - choose the correct answer</Label>
                    {question.choices!.map((choice,index) => (
                        <div role='button' onClick={()=>onAnswer(question.id,choice.choice)} key={index} className='flex flex-row items-center'>
                            <Button  size='sm' variant={answer===choice.choice?'default':'secondary'} className='rounded-r-none'> <CheckIcon className='h-5 w-5' /> </Button>
                            <Input readOnly className={cn('!ring-0 !ring-offset-0 h-9 rounded-l-none cursor-pointer',answer===choice.choice&&'!border-primary')} value={choice.choice} />
                        </div>
                    ))}
                </>
            )}
            {question.question_type===2 && (
                <>
                    <Label>Multiple Answers Multiple Answers - select two answers</Label>
                    {question.choices!.map((choice,index) => (
                        <div role='button' onClick={()=>onMultipleChoiceAnswer(choice.choice)} key={index} className='flex flex-row items-center'>
                            <Button  size='sm' variant={answers.includes(choice.choice)?'default':'secondary'} className='rounded-r-none'> <CheckIcon className='h-5 w-5' /> </Button>
                            <Input readOnly className={cn('!ring-0 !ring-offset-0 h-9 rounded-l-none cursor-pointer',answers.includes(choice.choice)&&'!border-primary')} value={choice.choice} />
                        </div>
                    ))}
                </>
            )}

            {question.question_type===3 && (
                <>
                    <Label>Type the Answer - type the correct answer</Label>
                    <Input value={answer} onChange={(e)=>onAnswer(question.id,e.target.value)} />
                </>
            )}

            {question.question_type===4 && (
                <>
                    <Label>Enumeration - list all the items asked</Label>
                    { enumAnswers.map((enumAnswer,index) => (
                        <div key={index} className='flex flex-row items-center'>
                            <Button tabIndex={-1} size='sm' variant='secondary' className='rounded-r-none'>{index+1}.</Button>
                            <Input onChange={e=>onEnumerationAnswer(index,e.target.value)} className='!ring-0 !ring-offset-0 h-9 rounded-l-none cursor-pointer' value={enumAnswer} />
                        </div>
                    ))}
                </>
            )}

            {question.question_type===5 && (
                <>
                    <Label>Essay - type your answers</Label>
                    <Textarea rows={2} value={answer} onChange={(e)=>onAnswer(question.id,e.target.value)} />
                </>
            )}
        </div>
    );
}