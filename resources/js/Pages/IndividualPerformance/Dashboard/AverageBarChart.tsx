import { BreakDown } from '@/types/metric';
import {FC} from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

interface Props {
    breakdown:BreakDown[];
}

const AverageBarChart:FC<Props> = ({breakdown}) => {
    //sum all goals
    const totalGoals = breakdown.reduce((acc,curr)=>acc+curr.Goal,0);

    const remapped = breakdown.map(bd=>({
        Metric:bd.Metric,
        Average:bd.Average,
        Goal:bd.Goal === 0 ? undefined : bd.Goal
    }));

    return (
        <ResponsiveContainer height={400} width={'100%'}>
            <BarChart data={remapped}>
                <CartesianGrid stroke='#64748b' strokeDasharray="3 3" />
                <XAxis className='text-xs' dataKey="Metric" />
                <Tooltip labelClassName='text-slate-900 font-semibold' />
                <Legend />
                <Bar radius={[4, 4, 0, 0]} label dataKey="Average" fill="#ec4899" activeBar={<Rectangle fill="#db2777" stroke="#be185d" />} />
                {totalGoals!==0&&<Bar radius={[4, 4, 0, 0]} label dataKey="Goal" fill="#3b82f6" activeBar={<Rectangle fill="#2563eb" stroke="#1d4ed8" />} />}
            </BarChart>
        </ResponsiveContainer>
    );
};

export default AverageBarChart;