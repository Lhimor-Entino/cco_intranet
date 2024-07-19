import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { TopFivePerformer, TopPerformer } from '@/types/metric';
import {FC} from 'react';

interface Props {
    topPerformers:TopPerformer[];
}

const TopPerformers:FC<Props> = ({topPerformers}) => {
    return (
        <div className='w-full grid gap-2.5 grid-col-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {topPerformers.map(tP=><TopPerformer key={tP.metric_id} topPerformer={tP} />)}
        </div>
    );
};

export default TopPerformers;

const TopPerformer:FC<{topPerformer:TopPerformer}> = ({topPerformer}) => {
    const {top_five_performers}=topPerformer;
    return (
        <div className='max-h-[23rem] border border-primary/50 rounded-xl pb-1.5 shadow-md shadow-primary/20 flex flex-col gap-y-3.5'>            
            <p className='border-b text-base rounded-t-xl font-semibold tracking-tight text-center bg-primary/90 text-background'>{`${topPerformer.metric_name}`}</p>
            
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-full">Agent</TableHead>
                        <TableHead>Avg</TableHead>
                        <TableHead>Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {top_five_performers.map((tFP)=><TopPerformerItem key={tFP.company_id} item={tFP} />)}
                </TableBody>
            </Table>
        </div>
    );
}

const TopPerformerItem:FC<{item:TopFivePerformer}> = ({item}) => {
    const {company_id,
        first_name,
        last_name,
        average,
        total_score
    }=item;
    return (
        <TableRow>
            <TableCell className="font-medium">{`${first_name} ${last_name}, ${company_id}`}</TableCell>
            <TableCell>{Math.round(average*100)/100}</TableCell>
            <TableCell>{total_score}</TableCell>
        </TableRow>
    );
};