import Hint from '@/Components/Hint';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Separator } from '@/Components/ui/separator';
import { cn, roundWithFormat } from '@/lib/utils';
import { User } from '@/types';
import { IndividualPerformanceUserMetric } from '@/types/metric';
import { format } from 'date-fns';
import { round } from 'lodash';
import {FC} from 'react';

interface Props {
    userMetric:IndividualPerformanceUserMetric;
    agent:User;
}

const UserMetricCardItem:FC<Props> = ({userMetric,agent}) => {
    const hasGoal = userMetric.metric.goal >0;
    const hasFailed = userMetric.value !== 0 && hasGoal?  round(userMetric.value,2) < round(userMetric.metric.goal,2) : false;
    return (
        <Hint className='bg-slate-50 dark:bg-slate-950 border border-primary shadow-md shadow-primary' key={userMetric.id} label={<UserMetricHint agent={agent} userMetric={userMetric} />} side='right' >
            <Card key={userMetric.id} className={cn('flex flex-col w-full border-l-[5px] shadow-lg cursor-pointer hover:opacity-70 transition duration-300',
                    userMetric.value===0 && 'border-l-info shadow-info/20',
                    hasFailed && userMetric.value!==0 &&'border-l-destructive shadow-destructive/20 ',
                    !hasFailed && userMetric.value!==0 &&'border-l-success shadow-success/20')}>
                <CardHeader className='h-auto'>
                    <CardTitle className='text-lg truncate'>{userMetric.metric.metric_name}</CardTitle>
                    {/* <CardDescription>
                        {`ID: ${userMetric.id}`}
                    </CardDescription> */}
                </CardHeader>
                <CardContent className='flex-1 flex flex-col gap-y-1 w-full'>
                    {userMetric.value!==0&&(<>
                        <div className='flex items-center justify-between'>
                            <p>Agent Score:</p>
                            <div className={cn('flex items-center',hasFailed && 'text-destructive')}>
                                <p>{`${userMetric.metric.unit === '%' ? roundWithFormat(userMetric.value,2) : round(userMetric.value)} ${userMetric.metric.unit}`}</p>
                                {userMetric.metric.format==='rate' && userMetric.metric.rate_unit && <p className='ml-1'>per {userMetric.metric.rate_unit}</p>}
                            </div>
                        </div>
                        <div className='flex items-center justify-between'>
                            <p>Daily Goal:</p>
                            {hasGoal?(<div className='flex items-center'>
                                <p>{`${userMetric.metric.unit === '%' ? roundWithFormat(userMetric.metric.goal , 2) : round(userMetric.metric.goal)} ${userMetric.metric.unit}`}</p>
                                {userMetric.metric.format==='rate' && userMetric.metric.rate_unit && <p className='ml-1'>per {userMetric.metric.rate_unit}</p>}
                            </div>):(
                                <p className='text-muted-foreground'>No Goal Set</p>                        
                            )}                        
                        </div>
                    </>)}
                    {userMetric.value===0&&(
                        <div className='h-full w-full flex flex-col items-center justify-center'>
                            <p className='text-xl italic text-muted-foreground'>
                                Not Applicable
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>  
        </Hint>
    );
};

export default UserMetricCardItem;


interface UserMetricHintProps {
    userMetric:IndividualPerformanceUserMetric; 
    agent:User;
}

const UserMetricHint:FC<UserMetricHintProps> = ({userMetric,agent}) =>{
    
    const hasFailed = userMetric.value < userMetric.metric.goal; 
    return (
        <div className='flex flex-col gap-y-2 text-xs px-2.5 py-3.5 w-72'>
            <div className='flex flex-col gap-y-1'>
                <span className='font-bold truncate'>{userMetric.metric.metric_name}</span>
                <span className='font-semibold'>{format(new Date(userMetric.date),'PP')}</span>
                <span className='italic text-muted-foreground capitalize'>Format: {userMetric.metric.format}</span>
            </div>
            <Separator />
            <p className='font-semibold'>
                {`Agent: ${agent.first_name} ${agent.last_name}`}
            </p>            
            <Separator />
            <div className='flex items-center justify-between'>
                <p>Agent Score:</p>
                <div className={cn('flex items-center',hasFailed && 'text-red-600 dark:text-red-400')}>
                    <p>{`${userMetric.metric.unit === '%'? roundWithFormat(userMetric.value,2) : round(userMetric.value)} ${userMetric.metric.unit}`}</p>
                    {userMetric.metric.format==='rate' && userMetric.metric.rate_unit && <p className='ml-1'>per {userMetric.metric.rate_unit}</p>}
                </div>
            </div>
            <div className='flex items-center justify-between'>
                <p>Daily Goal:</p>
                <div className='flex items-center'>
                    <p>{`${userMetric.metric.unit === '%' ? roundWithFormat(userMetric.metric.goal,2) : round(userMetric.metric.goal)} ${userMetric.metric.unit}`}</p>
                    {userMetric.metric.format==='rate' && userMetric.metric.rate_unit && <p className='ml-1'>per {userMetric.metric.rate_unit}</p>}
                </div>
            </div>
        </div>
    );
}



