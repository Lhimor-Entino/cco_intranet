import { Button } from '@/Components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Toggle } from '@/Components/ui/toggle';
import { TopFivePerformer, TopPerformer } from '@/types/metric';
import { ArrowDownWideNarrow, ArrowUpNarrowWide, LucideIcon, SortAsc } from 'lucide-react';
import {FC, useState} from 'react';

interface Props {
    topPerformers:TopPerformer[];
}
interface Sort {
    icon: LucideIcon;
    isAscending: boolean

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
    const [top, setTop] = useState(top_five_performers);
    const [sort,setSort] = useState<Sort>({isAscending:topPerformer.setting == 'ASC',icon:topPerformer.setting == 'ASC'? ArrowDownWideNarrow : ArrowUpNarrowWide}); 
    
    return (
        <div className='max-h-[23rem] border border-primary/50 rounded-xl pb-1.5 shadow-md shadow-primary/20 flex flex-col gap-y-3.5'>            
            <div className="place-items-center bg-primary/90 text-background tracking-tight border-b rounded-t-xl grid grid-cols-2 gap-4 bg-primary/90">
                <h5 className="col-span-1 w-full text-base font-semibold text-center">{`${topPerformer.metric_name}`}</h5>
                <Button onClick={() => {
                    let state = {isAscending:!sort.isAscending,icon:!sort.isAscending ? ArrowDownWideNarrow : ArrowUpNarrowWide}
                    setSort(state);
                    if(state.isAscending){
                        const asc = top_five_performers.sort((a,b) => a.total_score - b.total_score);
                        setTop(asc);
                    } else {
                        const desc = top_five_performers.sort((a,b) => b.total_score - a.total_score);
                        setTop(desc);
                    }
                }}
                variant="ghost" size="icon_sm" className="col-span-1 p-0 mr-2 justify-self-end">
                    <sort.icon/>
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-full">Agent</TableHead>
                        <TableHead>Avg</TableHead>
                        <TableHead>Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {top.map((tFP)=><TopPerformerItem key={tFP.company_id} item={tFP} />)}
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