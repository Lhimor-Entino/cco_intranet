import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { TrainingAssessmentQuestion } from '@/types/trainingInfo';
import { CheckIcon, MinusCircleIcon, PlusCircleIcon } from 'lucide-react';
import {FC} from 'react';

interface Props {
    choices:string[];
    onAddChoice:()=>void;
    onRemoveChoice:()=>void;
    onSetAnswer:(answer:string)=>void;
    answer?:string;
    onChoiceChange:(index:number,value:string)=>void;
}

const MultipleAnswers:FC<Props> = ({choices,onAddChoice,onRemoveChoice,onSetAnswer,answer,onChoiceChange}) => {
    const answers = answer?.split('|')||[];
    const handleSetAnswer = (choice:string) =>{
        //limit the number of answers to 2, deselect the first answer if answers.length is 2
        if(answers.includes(choice)){
            onSetAnswer(answers.filter(a=>a!==choice).join('|'));
        }else if(answers.length<2){
            onSetAnswer([...answers,choice].join('|'));
        }else if(answers.length===2){
            //de-select the first answer, and select the current choice
            onSetAnswer([answers[1],choice].join('|'));
        }
    }
    //answerText is the answer to be displayed, example: "Choice 1, Choice 2, and Choice 3, or Choice 1, and 4 others.."
    const answerText = answers.length>0?answers.length>1?`${answers.slice(0,answers.length-1).join(', ')} and ${answers[answers.length-1]}`:answers[0]:'Not Set';

    return (
        <div className='flex flex-col gap-y-1.5'>
            <div className='flex flex-row items-center justify-between'>
                <div className='flex flex-row items-center gap-x-2'>
                    <Button onClick={onAddChoice} size='sm' variant='secondary'><PlusCircleIcon className='h-5 w-5' /> </Button>
                    <Button onClick={onRemoveChoice} disabled={choices.length===0} size='sm' variant='secondary'><MinusCircleIcon className='h-5 w-5 ' /> </Button>
                </div>
                <div className='flex flex-row items-center gap-x-2'>
                    <span className='font-bold'>Answers:</span>
                    <span>{answerText}</span>
                </div>
            </div>
            <div className='grid gap-2.5 items-center justify-center grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6'>
                {choices.map((choice,index) => (
                    <div key={index} className='flex flex-row items-center'>
                        <Input onChange={e=>onChoiceChange(index,e.target.value)} className='!ring-0 !ring-offset-0 h-9 rounded-r-none' value={choice} />
                        <Button onClick={()=>handleSetAnswer(choice)} size='sm' variant={answers.includes(choice)?'default':'secondary'} className='rounded-l-none'> <CheckIcon className='h-5 w-5' /> </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MultipleAnswers;