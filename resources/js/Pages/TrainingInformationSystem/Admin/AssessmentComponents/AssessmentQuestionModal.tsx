import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/Components/ui/alert-dialog';
import { TrainingAssessmentQuestion } from '@/types/trainingInfo';
import {FC, useEffect, useState} from 'react';
import QuestionYooptaEditor from './QuestionYooptaEditor';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { questionTypes } from '@/lib/utils';
import { Input } from '@/Components/ui/input';
import MultipleChoice from './QuestionTypePanels/MultipleChoice';
import MultipleAnswers from './QuestionTypePanels/MultipleAnswers';
import TypeTheAnswer from './QuestionTypePanels/TypeTheAnswer';
import Enumeration from './QuestionTypePanels/Enumeration';
import Essay from './QuestionTypePanels/Essay';
import { Separator } from '@/Components/ui/separator';
import { toast } from 'sonner';
import { useForm } from '@inertiajs/inertia-react';
import { Loader2 } from 'lucide-react';

interface Props {
    question?:TrainingAssessmentQuestion;
    isOpen:boolean;
    onClose:()=>void;
}

const AssessmentQuestionModal:FC<Props> = ({question,isOpen,onClose}) => {
    const {data,setData,processing,post,reset} = useForm({
        question:question?.question,
        questionType:question?.question_type.toString(),
        choices:question?.choices?.map(c=>c.choice)||[],
        answer:question?.answer,
        points:question?.points||0,
        hasEditedQuestion:false,
        enumItems:question?.enum_items?.map(e=>e.item)||[]
    });
    const isNew = data.question===question?.question && question?.created_at===question?.updated_at;
    const handleAddChoice = () => setData(val=>({...val,choices:([...val.choices,`Choice ${val.choices.length+1}`])})) 
    //remove last choice
    const handleRemoveChoice = () => setData(val=>({...val,choices:val.choices.slice(0,val.choices.length-1)}));

    const handleChangeChoice = (index:number,value:string) =>  setData(val=>({...val,choices:val.choices.map((v,i) => i===index?value:v),answer:''}));
    
    const setPoints = (rawValue:string) => {
        if(rawValue==='') return setData(val=>({...val,points:0}));
        //return if the value is not a number
        if(isNaN(parseInt(rawValue))) return;
        //return if negative number
        if(parseInt(rawValue)<0) return;

        setData(val=>({...val,points:parseInt(rawValue)}));
    }

    const handleSave = () => {
        if(!question?.id) return toast.error('An error occured while updating the question');
        if(isNew) return toast.error('Please update the question text');
        if(!!data.answer&&data.questionType==='2' && data.answer.split('|').length<2) return toast.error('There must be 2 answers for Multiple Answers');
        if((data.questionType==='1' || data.questionType==='2')&&data.choices.length<2) return toast.error('There must be at least 2 choices for Multiple Choice or Multiple Answers');
        if(!data.points || data.points===0) return toast.error('Please set the correct point/s for the question');
        if( (data.questionType!=='4' && data.questionType!=='5') && (!data.answer || data.answer==='')) return toast.error('Please set the answer for the question');
        if(data.questionType==='4' && data.enumItems.length<2) return toast.error('There must be at least 2 items for Enumeration');
        //return toast if data.questionType==='4' and one of the items is empty or ''
        if(data.questionType==='4' && data.enumItems.some(e=>e.trim()==='')) return toast.error('Please fill up all items for Enumeration');
        post(route('assessment.questions.update',{id:question.id}),{
            onSuccess:()=>{onClose();toast.success('Question successfully updated')},
            onError:()=>toast.error('An error occured while updating the question'),
            preserveScroll:true,
            preserveState:false
        });
    }
    //useEffect(()=>console.log(data.question),[data.question]);

    const onTypeChange = (value:string) =>  setData(val=>({...val,questionType:value,choices:[],answer:value==='4'?'Item 1':''}));
    const onSetAnswer = (rawAnswer:string) => {
        //if rawAnswer starts or ends with '|', remove it
        const answer = rawAnswer.startsWith('|')?rawAnswer.slice(1):rawAnswer.endsWith('|')?rawAnswer.slice(0,-1):rawAnswer;
        if(data.questionType==='2') setData('points',answer.split('|').length);
        setData(val=>({
            ...val,
            answer,
        }));
    };
    
    const onTypeTheAnswerChange = (value:string) => {
        let rawAnswer = value;
        //remove return carriages
        rawAnswer = rawAnswer.replace(/\r/g,'');
        setData('answer',rawAnswer);
    }

    const handleChange = (q:string) => setData(val=>({...val,question:q,hasEditedQuestion:true}));
    
    const handleAddItem = () => setData(val=>({...val,enumItems:[...val.enumItems,`Item ${val.enumItems.length+1}`],points:val.enumItems.length+1}));

    const handleRemoveItem = () => setData(val=>({...val,enumItems:val.enumItems.slice(0,val.enumItems.length-1),points:val.enumItems.length-1}));

    const handleChangeItem = (index:number,value:string) => setData(val=>({...val,enumItems:val.enumItems.map((v,i) => i===index?value:v),answer:''}));

    useEffect(()=>{
        if(!isOpen) reset();
        if(isOpen && !!question){
            setData(val=>({
                ...val,
                question:question.question,
                questionType:question.question_type.toString(),
                choices:question.choices?.map(c=>c.choice)||[],
                answer:question.answer,
                points:question.points||0,
                hasEditedQuestion:false,
                enumItems:question.enum_items?.map(e=>e.item)||[]
            }));
        }
    },[question,isOpen])

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className='max-h-[95vh] h-full w-full max-w-[64rem] flex flex-col '>
                <AlertDialogHeader className='h-auto'>
                    <AlertDialogTitle>Edit Question</AlertDialogTitle>
                </AlertDialogHeader>
                <div className='flex-1 relative overflow-y-auto px-3.5 space-y-3.5'>
                    
                    <div className='h-auto flex flex-col gap-y-2 sticky top-0  bg-background'>
                        <div className='flex flex-row items-center gap-x-3.5'>
                            <div className='space-y-1'>
                                <Label>Question Type:</Label>
                                <Select value={`${data.questionType}`} onValueChange={onTypeChange}>
                                    <SelectTrigger disabled={processing} className="h-8 w-60">
                                        <SelectValue placeholder={questionTypes.find(qT=>qT.id.toString()===data.questionType)?.description} />
                                    </SelectTrigger>
                                    <SelectContent side="top">
                                        {questionTypes.map((t) => (
                                            <SelectItem key={t.id} value={`${t.id}`}>
                                                {t.description}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='space-y-1'>
                                <Label>Point/s:</Label>
                                <Input readOnly={data.questionType==='2' || data.questionType==='4'} disabled={processing} value={data.points} onChange={({target})=>setPoints(target.value)} className='w-32' placeholder='Input Point/s' />
                            </div>
                        </div>
                    </div>
                    <Separator />    
                    
                    {!!question&&(<div className='space-y-1 flex-1 '>
                        <Label>Question:</Label>
                        <div className=' border border-border/60 rounded-md p-1.5'>
                            <QuestionYooptaEditor onChange={handleChange} question={question} />
                        </div>
                    </div>)}
                    {data.questionType!=='5'&&(<>
                        <Separator />                
                        <div className='flex flex-col gap-y-2.5'>
                            <h5 className='font-bold text-lg tracking-wide'>
                                Answer Details - 
                                {data.questionType==='1' && 'Select the correct answer'}
                                {data.questionType==='2' && 'Select 2 answers'}
                                :
                            </h5>
                            {data.questionType==='1' && <MultipleChoice choices={data.choices} onAddChoice={handleAddChoice} onRemoveChoice={handleRemoveChoice} answer={data.answer} onSetAnswer={onSetAnswer} onChoiceChange={handleChangeChoice}/>}
                            {data.questionType==='2' && <MultipleAnswers choices={data.choices} onAddChoice={handleAddChoice} onRemoveChoice={handleRemoveChoice} answer={data.answer} onSetAnswer={onSetAnswer} onChoiceChange={handleChangeChoice}/>}
                            {data.questionType==='3' && <TypeTheAnswer onSetAnswer={onTypeTheAnswerChange} answer={data.answer} />}
                            {data.questionType==='4' && <Enumeration onAddItem={handleAddItem} onRemoveItem={handleRemoveItem} items={data.enumItems} onChangeItem={handleChangeItem}/>}
                            {/* {data.questionType==='5' && <Essay question={question} />} */}
                        </div>
                    </>)}
                </div>
                <AlertDialogFooter className='h-auto'>
                    <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
                    <Button disabled={processing} onClick={handleSave}>
                        {processing&&<Loader2 className='h-5 w-5 mr-2 animate-spin' />}
                        Save Changes
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AssessmentQuestionModal;