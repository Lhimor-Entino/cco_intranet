import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { CheckIcon, MinusCircleIcon, PlusCircleIcon } from 'lucide-react';
import { FC } from 'react';

interface Props {
    choices:string[];
    onAddChoice:()=>void;
    onRemoveChoice:()=>void;
    onSetAnswer:(answer:string)=>void;
    answer?:string;
    onChoiceChange:(index:number,value:string)=>void;
}

const MultipleChoice:FC<Props> = ({choices,onAddChoice,onRemoveChoice,onSetAnswer,answer,onChoiceChange}) => {
    
    

    return (
        <div className='flex flex-col gap-y-1.5'>
            <div className='flex flex-row items-center justify-between'>
                <div className='flex flex-row items-center gap-x-2'>
                    <Button onClick={onAddChoice} size='sm' variant='secondary'><PlusCircleIcon className='h-5 w-5' /> </Button>
                    <Button onClick={onRemoveChoice} disabled={choices.length===0} size='sm' variant='secondary'><MinusCircleIcon className='h-5 w-5 ' /> </Button>
                </div>
                <div className='flex flex-row items-center gap-x-2'>
                    <span className='font-bold'>Answer:</span>
                    <span>{answer||'Not Set'}</span>
                </div>
            </div>
            <div className='grid gap-2.5 items-center justify-center grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6'>
                {choices.map((choice,index) => (
                    <div key={index} className='flex flex-row items-center'>
                        <Input onChange={e=>onChoiceChange(index,e.target.value)} className='!ring-0 !ring-offset-0 h-9 rounded-r-none' value={choice} />
                        <Button onClick={()=>onSetAnswer(choice)} size='sm' variant={answer===choice?'default':'secondary'} className='rounded-l-none'> <CheckIcon className='h-5 w-5' /> </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MultipleChoice;