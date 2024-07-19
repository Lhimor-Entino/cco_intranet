import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { cn } from '@/lib/utils';
import { TrainingAssessment, TrainingAssessmentQuestion, TrainingFolder } from '@/types/trainingInfo';
import { useForm } from '@inertiajs/inertia-react';
import { Loader2, Plus, PlusCircleIcon, SaveIcon } from 'lucide-react';
import {ChangeEventHandler, FC, FormEventHandler, useState} from 'react';
import { toast } from 'sonner';
import QuestionYooptaEditor from './QuestionYooptaEditor';
import AssessmentQuestionItem from './AssessmentQuestionItem';
import AssessmentQuestionModal from './AssessmentQuestionModal';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/Components/ui/alert-dialog';

interface Props {
    assessment:TrainingAssessment;
    main_folder:TrainingFolder;
}

const AssessmentEdit:FC<Props> = ({assessment,main_folder}) => {
    const {post,processing,data,setData} = useForm({training_assessment_id:assessment.id,title:assessment.title,passing_score:assessment.pass_score.toString()});
    const [editQuestion,setEditQuestion] = useState<TrainingAssessmentQuestion|undefined>(undefined);
    const [deleteQuestion,setDeleteQuestion] = useState<TrainingAssessmentQuestion|undefined>(undefined);
    const {questions} = assessment;
    const [adding,setAdding] = useState(false);
    const [updating,setUpdating] = useState(false);
    const AddNewIcon = (processing&&adding)? Loader2:PlusCircleIcon;
    const UpdateIcon = (processing&&updating)? Loader2:SaveIcon;
    const onAdd = () =>{
        post(route('assessment.questions.store'),{
            onStart:()=>setAdding(true),
            onError:()=>toast.error('An error occurred while adding question. Please try again.'),
            onFinish:()=>setAdding(false),
        });
    }

    const onUpdate:FormEventHandler<HTMLFormElement> = (e) =>{
        e.preventDefault();
        if(data.passing_score.trim()==='') return toast.error('Passing score is required.');
        if(data.title.trim()==='') return toast.error('Assessment title is required.');
        if(parseInt(data.passing_score)>assessment.total_points) return toast.error('Passing score cannot be greater than the total points of the assessment.');
        if(parseInt(data.passing_score)<1) return toast.error('Passing score cannot be less than 1.');
        post(route('assessment.update',{id:assessment.id}),{
            onStart:()=>setUpdating(true),
            onFinish:()=>setUpdating(false),
            onError:()=>toast.error('An error occurred while updating assessment. Please try again.'),
        });
    }

    const handleSetPassingScore:ChangeEventHandler<HTMLInputElement> = ({target}) =>{
        let score = target.value;
        //return if score is not a number
        if(isNaN(parseInt(score))) return;
        //return if score is negative
        if(parseInt(score)<0) return;
        //remove leading zeros
        if(score.startsWith('0')) score = score.replace(/^0+/,'');
        setData('passing_score',score);
    }

    return (
        <>
            <div className='flex-1 flex flex-col gap-y-2.5 overflow-y-auto relative'>
                <form onSubmit={onUpdate} className='flex flex-col gap-y-1.5 md:gap-y-0 md:flex-row md:items-center md:gap-x-3.5'>
                    <div className='space-y-1 md:flex-1'>
                        <Label>Assessment Title</Label>
                        <Input value={data.title} onChange={({target})=>setData('title',target.value)} required disabled={processing} className={cn('h-9',data.title===''?'!border-destructive':'border-border')} placeholder='Assessment Title' />
                    </div>
                    <div className='flex items-center gap-x-1.5'>
                        <div className='space-y-1'>                        
                            <Label>Max Score</Label>
                            <Input disabled={processing} className='h-9' value={assessment.total_points} readOnly placeholder='Assessment Title' />
                        </div>
                        <div className='space-y-1'>
                            <Label>Passing Score</Label>
                            <Input required value={data.passing_score} onChange={handleSetPassingScore} disabled={processing} className={cn('h-9',data.passing_score==='0'?'!border-destructive':'border-border')} placeholder='0' />
                        </div>
                    </div>
                    <Button type='submit' disabled={processing} size='sm' className='md:mt-auto'>
                        <UpdateIcon className={cn('h-5 w-5 mr-2',processing&&'animate-spin')} />
                        Save Changes
                    </Button>
                    <Button type='button' onClick={onAdd} size='sm' disabled={processing} className='md:mt-auto'>
                        <AddNewIcon className={cn('h-5 w-5 mr-2',processing&&'animate-spin')} />
                        New Question
                    </Button>
                </form>
                <div className='flex-1 overflow-y-auto'>
                    {(questions?.length||0)===0 && <p className='pt-8 font-semibold text-lg tracking-wide text-center'>No Questions for this Assessment...</p>}
                    {!!questions&&(
                        <Accordion type="single" collapsible className="w-full ">                    
                            {(questions||[]).map((question,idx)=> <AssessmentQuestionItem onDelete={()=>setDeleteQuestion(question)} onEdit={()=>setEditQuestion(question)} key={question.id} question={question} index={idx} />)}                        
                        </Accordion>
                    )}
                </div>
            </div>
            <AssessmentQuestionModal question={editQuestion} isOpen={!!editQuestion} onClose={()=>setEditQuestion(undefined)} />
            {!!deleteQuestion&&<QuestionDeleteConfirmModal question={deleteQuestion} isOpen={!!deleteQuestion} onClose={()=>setDeleteQuestion(undefined)} />}
        </>
    );
};

export default AssessmentEdit;

const QuestionDeleteConfirmModal:FC<{isOpen:boolean,onClose:()=>void,question:TrainingAssessmentQuestion}> = ({isOpen,onClose,question}) => {
    const {post,processing} = useForm();
    const onDelete = () =>{
        post(route('assessment.questions.destroy',{id:question.id}),{
            onError:()=>toast.error('An error occurred while deleting question. Please try again.'),
            onSuccess:()=>onClose(),
        });
    }
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete Question                        
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this question?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
                    <Button onClick={onDelete} disabled={processing}>
                        {processing&&<Loader2 className='h-5 w-5 mr-2 animate-spin' />}
                        Continue
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}