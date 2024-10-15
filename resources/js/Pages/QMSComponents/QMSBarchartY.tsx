
import { FC } from "react"
import { Bar, BarChart, CartesianGrid, LabelList, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props{

}
const QMSBarchartY:FC<Props> = () => {
    const remapped:any = [
        {
            Metric:"",
            Average:50,
            Goal:10,
            LabelAve:'',
            LabelGoal:'',
        },
        {
            Metric:"",
            Average:60,
            Goal:20,
            LabelAve:'',
            LabelGoal:'',
        },
        {
            Metric:"",
            Average:70,
            Goal:30,
            LabelAve:'',
            LabelGoal:'',
        },
        {
            Metric:"",
            Average:10,
            Goal:40,
            LabelAve:'',
            LabelGoal:'',
        },
        {
            Metric:"",
            Average:80,
            Goal:50,
            LabelAve:'',
            LabelGoal:'',
        },
        {
            Metric:"",
            Average:50,
            Goal:60,
            LabelAve:'',
            LabelGoal:'',
        },
        {
            Metric:"",
            Average:30,
            Goal:70,
            LabelAve:'',
            LabelGoal:'',
        },
        {
            Metric:"",
            Average:40,
            Goal:80,
            LabelAve:'',
            LabelGoal:'',
        },
        {
            Metric:"",
            Average:50,
            Goal:90,
            LabelAve:'',
            LabelGoal:'',
        }
    ]

    
    return (
        <ResponsiveContainer height={150} width={'100%'}>
            <BarChart data={remapped}>
                <CartesianGrid stroke='#64748b' strokeDasharray="3 3" />
                <XAxis type="category" className='text-xs border' dataKey="Metric" />
                {/* <Axis className='text-xs border' /> */}
                <Tooltip labelClassName='text-slate-900 font-semibold' />
                <Legend />
                <Bar radius={[4, 4, 0, 0]}  dataKey="Average" fill="#ec4899" activeBar={<Rectangle fill="#db2777" stroke="#be185d" />}>
                 <LabelList dataKey="LabelAve" />
                </Bar>
                {true&&<Bar radius={[4, 4, 0, 0]}  dataKey="Goal" fill="#3b82f6" activeBar={<Rectangle fill="#2563eb" stroke="#1d4ed8" />}>
                 <LabelList dataKey="LabelGoal" />
                </Bar>}
            </BarChart>
        </ResponsiveContainer>
    );
}
export default QMSBarchartY;