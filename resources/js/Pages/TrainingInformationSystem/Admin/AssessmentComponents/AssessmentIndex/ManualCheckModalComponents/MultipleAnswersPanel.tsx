import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { TrainingAssessmentResultAnswer } from "@/types/trainingInfo";
import { FC } from "react";

const MultipleAnswersPanel:FC<{result:TrainingAssessmentResultAnswer}> = ({result}) =>{
    const userAnswers = result.user_answer.split('|');
    const correctAnswers = result.correct_answer.split('|');
    return (
        <>
            <div className='space-y-1'>
                <Label className='text-muted-foreground'>User Answer:</Label>
                <div className='flex flex-col gap-y-2'>
                    {userAnswers.filter(ua=>ua!=='').map((ua,idx)=><Input key={idx} className='!ring-0 !ring-offset-0' value={ua} readOnly />)}
                </div>
            </div>
            <div className='space-y-1'>
                <Label className='text-muted-foreground'>Correct Answer:</Label>
                <div className='flex flex-col gap-y-2'>
                    {correctAnswers.map((ua,idx)=><Input key={idx} className='!ring-0 !ring-offset-0' value={ua} readOnly />)}
                </div>
            </div>
        </>
    );
}

export default MultipleAnswersPanel;