import { roundWithFormat } from '@/lib/utils';
import { BreakDown } from '@/types/metric';
import { round } from 'lodash';
import {FC} from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

interface Props {
    breakdown:BreakDown[];
}

const AverageBarChart:FC<Props> = ({breakdown}) => {
    //sum all goals
    const totalGoals = breakdown.reduce((acc,curr)=>acc+curr.Goal,0);

    const remapped = breakdown.map(bd=>({
        Metric:bd.Metric,
        Average:round( bd.Average,2),
        Goal:bd.Goal === 0 ? undefined : round( bd.Goal,2),
        LabelAve: bd.Average === 0 ? undefined :  (bd.Unit === '%'? roundWithFormat( bd.Average,2) + bd.Unit :  roundWithFormat( bd.Average,2)),
        LabelGoal: bd.Goal === 0 ? undefined : (bd.Unit === '%'?  roundWithFormat(bd.Goal,2)  + bd.Unit : roundWithFormat(bd.Goal,2) )
    }));

    return (
        <ResponsiveContainer height={400} width={'100%'}>
            <BarChart data={remapped}>
                <CartesianGrid stroke='#64748b' strokeDasharray="3 3" />
                <XAxis className='text-xs' dataKey="Metric" />
                <Tooltip labelClassName='text-slate-900 font-semibold' />
                <Legend />
                <Bar radius={[4, 4, 0, 0]}  dataKey="Average" fill="#ec4899" activeBar={<Rectangle fill="#db2777" stroke="#be185d" />}>
                 <LabelList dataKey="LabelAve" />
                </Bar>
                {totalGoals!==0&&<Bar radius={[4, 4, 0, 0]}  dataKey="Goal" fill="#3b82f6" activeBar={<Rectangle fill="#2563eb" stroke="#1d4ed8" />}>
                 <LabelList dataKey="LabelGoal" />
                </Bar>}
            </BarChart>
        </ResponsiveContainer>
    );
};

export default AverageBarChart;