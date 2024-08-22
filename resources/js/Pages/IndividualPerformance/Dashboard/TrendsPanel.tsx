import { Trend } from '@/Pages/IndividualPerformanceDashboard';
import { format } from 'date-fns';
import { round } from 'lodash';
import {FC} from 'react';
import { Area, Bar, CartesianGrid, ComposedChart, Label, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Props {
    trends:Trend[];
}

const TrendsPanel:FC<Props> = ({trends}) => {
    return (
        <div className='flex flex-col gap-y-2.5'>
            {trends.map(trend=>(
                <div key={trend.metricName} className='flex flex-col gap-y-1'>
                    <h5 className='w-full text-center text-lg font-semibold tracking-tight text-muted-foreground border-b'>
                        {trend.metricName}
                    </h5>
                    <TrendItem dailyTrends={trend} />
                </div>
            ))}
        </div>
    );
};

export default TrendsPanel;

const TrendItem:FC<{dailyTrends:Trend}> = ({dailyTrends}) => {
    //format date to MM/DD
    //sort by date ascending
    const data = dailyTrends.trends.map(trend=>({
        Goal: round(dailyTrends.goal,2),
        Date:format(new Date(trend.date),'MM/dd'),
        Score: round(trend.score,2)
    })).sort((a,b)=>a.Date.localeCompare(b.Date));

    const maxScore = Math.max(...data.map(d=>d.Score));
    const roundedMaxScore = Math.ceil(maxScore/10)*10;
    return (
        <ResponsiveContainer width="100%" height={350}>
            <ComposedChart width={500} height={350} data={data}>
                <CartesianGrid stroke='#64748b' strokeDasharray="3 3" />
                {dailyTrends.goal!==0&&<Area type="monotone" dataKey="Goal" fill="#8884d8" stroke="#8884d8" />}
                <XAxis className='text-xs text-center' dataKey="Date"  />
                <YAxis  className='text-xs' dataKey="Score" domain={[0,roundedMaxScore]} />
                <Tooltip labelClassName='text-slate-900 font-semibold' />
                <Bar radius={[4, 4, 0, 0]} dataKey="Score" barSize={20} fill="#413ea0" />
                <Line type="monotone" dataKey="Score" stroke="#ff7300" />
                <Legend verticalAlign="top" height={36}/>
            </ComposedChart>
        </ResponsiveContainer>
    );
}