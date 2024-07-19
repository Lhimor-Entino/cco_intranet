import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { TrainingAssessmentResult } from '@/types/trainingInfo';
import { FC, useState } from 'react';

import { Loader2 } from 'lucide-react';
import { useForm } from '@inertiajs/inertia-react';
import { toast } from 'sonner';
import { Accordion } from '@/Components/ui/accordion';
import AssessmentResultAnswerItem from './ManualCheckModalComponents/AssessmentResultAnswerItem';

interface Props {
    result:TrainingAssessmentResult;
    isOpen:boolean;
    onClose:()=>void;
}

const ManualCheckModal:FC<Props> = ({isOpen,result,onClose}) => {
    const [hasUpdatedScore,setHasUpdatedScore] = useState(false);
    const {data,setData,processing,post} = useForm({
        result_id:result.id,
        questionAnswerScores:result.answers.map(a=>({result_answer_id:a.id,score:a.score}))
    });
    const {answers} = result;
    const onQAScoreChange = (resultAnswerId:number,score:number) =>  {
        toast.info('Score updated');
        setData(val=>({...val,questionAnswerScores:val.questionAnswerScores.map((qas)=>qas.result_answer_id===resultAnswerId?{...qas,score}:qas)}))
        if(!hasUpdatedScore) setHasUpdatedScore(true);
    };
    
    const handleSave = () => {
        if(!hasUpdatedScore) return toast.error('No changes to save');
        post(route('assessment.manual_check'),{
            onError:()=>toast.error('Failed to save changes. Please try again'),
            onSuccess:()=>{
                toast.success('Changes saved successfully');
                onClose();
            }
        });
    }

    const totalUpdatedUserScore = data.questionAnswerScores.reduce((acc,qas)=>acc+qas.score,0);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-[1024px] max-h-[99vh] h-full flex flex-col">
                <DialogHeader className='h-auto'>
                    <DialogTitle>{result.assessment?.title||'N/A or Deleted'}</DialogTitle>
                    <DialogDescription asChild>
                        <div className='flex flex-col gap-y-1'>
                            <p> Manual Check Assessment for {result.user.company_id}, {result.user.first_name} {result.user.last_name}</p>
                            <p>Agent Score: {result.user_score}/{result.max_score}</p>
                            {hasUpdatedScore && <p>Updated Score: {totalUpdatedUserScore}/{result.max_score}</p>}
                            <p>Passing Score: {result.passing_score}</p>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <div className='flex-1 flex flex-col gap-y-3.5 overflow-y-auto'>
                    <Accordion type="single" collapsible className="w-full ">                    
                        {answers.map((a,idx)=> <AssessmentResultAnswerItem key={a.id} onScoreChange={onQAScoreChange} questionNo={(idx+1).toString()} answer={a}   />)}                        
                    </Accordion>
                </div>
                <DialogFooter className='h-auto'>
                    <Button disabled={processing} onClick={handleSave} type="submit">
                        {processing && <Loader2 className='h-5 w-5 mr-2 animate-spin' />}
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ManualCheckModal;













