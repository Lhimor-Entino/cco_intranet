import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { TrainingAssessmentQuestion } from '@/types/trainingInfo';
import {ChangeEventHandler, FC} from 'react';

interface Props {
    onSetAnswer:(answer:string)=>void;
    answer?:string;
}

const TypeTheAnswer:FC<Props> = ({onSetAnswer,answer}) => {
    
    const handleAnswerChange:ChangeEventHandler<HTMLInputElement> = ({target}) => onSetAnswer(target.value);
    return (
        <div className='flex items-center gap-x-1.5'>
            <Label>Corrent Answer:</Label>
            <Input onChange={handleAnswerChange} className='flex-1' value={answer} /> 
        </div>
    );
};

export default TypeTheAnswer;