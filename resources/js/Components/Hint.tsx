import {FC, ReactNode} from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';

interface Props {
    label: string|ReactNode;
    children: ReactNode;
    side?: 'left' | 'right'| 'top' | 'bottom';
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
    alignOffset?: number;
    className?: string;
}

const Hint:FC<Props> = ({label,children,side,align,sideOffset,alignOffset,className}) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent className={cn('z-[500000]',className)}  side={side} align={align} sideOffset={sideOffset} alignOffset={alignOffset}>
                    <div>
                        {label}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default Hint;