
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { MinusCircleIcon, PlusCircleIcon } from 'lucide-react';
import {ChangeEventHandler, FC, useState} from 'react';

interface Props {
    items:string[];
    onAddItem:()=>void;
    onRemoveItem:()=>void;
    onChangeItem:(index:number,answer:string)=>void;
}

const Enumeration:FC<Props> = ({items,onAddItem,onRemoveItem,onChangeItem}) => {
    return (
        <div className='flex flex-col gap-y-1.5'>            
            <div className='flex flex-row items-center gap-x-2'>
                <Button onClick={onAddItem} size='sm' variant='secondary'><PlusCircleIcon className='h-5 w-5' /> </Button>
                <Button onClick={onRemoveItem} disabled={items.length===1} size='sm' variant='secondary'><MinusCircleIcon className='h-5 w-5 ' /> </Button>
            </div>
            
            <div className='grid gap-2.5 items-center justify-center grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6'>
                {items.map((item,index) => (
                    <div key={index} className='flex flex-row items-center'>
                        <Input onChange={e=>onChangeItem(index,e.target.value)} className='!ring-0 !ring-offset-0 h-9' value={item} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Enumeration;