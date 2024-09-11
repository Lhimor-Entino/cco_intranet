import Header from '@/Components/Header';
import Layout from '@/Components/Layout/Layout';
import { PageProps, Project, User } from '@/types';
import { Inertia, Page } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import { FC, useState, useMemo, MouseEventHandler, MouseEvent, useEffect } from 'react';
import IPDDropdown from './IndividualPerformance/IPDDropdown';
import ProjectSelectionComboBox from './IndividualPerformance/ProjectSelectionComboBox';
import UserSelectionComboBox from './IndividualPerformance/UserSelectionComboBox';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { Button } from '@/Components/ui/button';
import { cn, convertToTimezone, parseDateRange, roundWithFormat } from '@/lib/utils';
import {  BarChartBig, BetweenHorizontalStart, CalendarIcon,  Edit,  ExpandIcon,  PencilIcon,  ShrinkIcon,  SquareArrowRightIcon } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { Calendar } from '@/Components/ui/calendar';
import { DateRange, SelectRangeEventHandler } from 'react-day-picker';
import { IndividualPerformanceMetric, IndividualPerformanceUserMetric } from '@/types/metric';
import { toast } from 'sonner';
import UserMetricCardItem from './IndividualPerformance/Dashboard/UserMetricCardItem';
import { Separator } from '@/Components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion';
import Hint from '@/Components/Hint';
import { Bar, BarChart, CartesianGrid, LabelList, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import RateAgentsModal, { RateAgentsForm } from './IndividualPerformance/Dashboard/RateAgentsModal';
import TrendsPanel from './IndividualPerformance/Dashboard/TrendsPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { round } from 'lodash';


type UserMetricGroup = {date:string,metrics:IndividualPerformanceUserMetric[]}
export type UserMetricAverage = {
    metric_name:string;
    average:number;
    total:number;
    days:number;
    goal:number; 
    unit:string;
}

export type Trend = {
    metricName: string;
    goal: number;
    trends: {
        userMetricId: number;
        date: string;
        score: number;
    }[];
}

interface Props {
    is_admin:boolean;
    is_team_leader:boolean;
    project:Project;
    project_histories: Project[];
    agents:User[];
    date_range?:DateRange;
    agent?:User;
    agent_averages?:UserMetricAverage[];
    grouped_metrics?:UserMetricGroup[];
}

const IndividualPerformanceDashboard:FC<Props> = ({is_admin,is_team_leader,project,agents,date_range,agent,agent_averages,grouped_metrics,project_histories}) => {
    const {projects,auth} = usePage<Page<PageProps>>().props;
    const {user} = auth;
    const isSelf = user.id === agent?.id;
    const [selectedUser,setSelectedUser] = useState<User|undefined>(agent);
    const [initialDate, setDate] = useState<DateRange | undefined>(date_range);
    useMemo(() => {
        const date = parseDateRange(initialDate);
        const param = {from: convertToTimezone(new Date(date.from + '')), to: convertToTimezone(new Date(date.to + ''))}
        setDate(param);
    },[]);
    const navigate = () => {
        if(!project) return toast.error('Please select a project');
        if(!selectedUser) return toast.error('Please select an agent');
        if(!initialDate) return toast.error('Please select a date range or pick a date');
        const date = parseDateRange(initialDate);
        console.log('Initial Date: ', date_range, 'Parse Date: ', date);
        Inertia.get(route('individual_performance_dashboard.index',{
            project_id:project.id,
            date,
            company_id:selectedUser.company_id
        }));
    };
    
    const onProjectSelect = (project:Project) => Inertia.get(route('individual_performance_dashboard.index',{project_id:project.id}));
    
    const agentName = selectedUser?selectedUser.first_name+' '+selectedUser.last_name:'';
    

    const [opened,setOpened] = useState<string[]>((grouped_metrics||[]).map(({date})=>(date)));
    const onShrinkAll = () => setOpened([]);
    const onExpandAll = () => setOpened((grouped_metrics||[]).map(({date})=>(date)));
    const onSetOpened = (dates:string[]) => setOpened(dates);
    const chartData = useMemo(()=>(agent_averages||[]).map(({metric_name,average,goal,unit})=>({
        Metric:metric_name,
        Average:average,
        Goal:goal===0?undefined:round(goal,2),
        LabelAve: average === 0 ? undefined :  (unit === '%'? roundWithFormat(average,2) +  unit : roundWithFormat(average,2)),
        LabelGoal: goal === 0 ? undefined :   (unit === '%'?  roundWithFormat(goal,2) + unit : roundWithFormat(goal,2))
    })),[agent_averages]);
    const [showRateAgentsModal,setShowRateAgentsModal] = useState(false);
    const [metricToEdit,setMetricToEdit] = useState<RateAgentsForm|undefined>(undefined);
    const totalGoals = agent_averages?.reduce((acc,curr)=>acc+curr.goal,0)||0;
    

    const onSetMetricToEdit = (metric:UserMetricGroup,e:MouseEvent) => {
        e.preventDefault();
        setShowRateAgentsModal(()=>{
            setMetricToEdit({
                agent:selectedUser,
                date:initialDate?.from,
                ratings:metric.metrics.map(({metric,value,id})=>({
                    user_metric_id:id,
                    metric,
                    score:value,
                    not_applicable:value===0
                }))
            });
            return true;
        });
    }

    const handleClose = () =>{
        setShowRateAgentsModal(val=>{
            setMetricToEdit(undefined);
            return false;
        });
    }

    /*
    get daily trends by metric name
    format: 
    {
        id:number - userMetric.metric.id,
        metricName: - userMetric.metric.metric_name,
        trends:{
            userMetricId:number - userMetric.metric.id,
            date:string - userMetric.data,
            score:number  - userMetric.value
        }[]
    }
    data format = yyyy-mm-dd
    score - get from userMetric.value
    metricName - get from metric.metric_name
    */
    const trends:Trend[] = useMemo(()=>{
        //flatten the grouped metrics
        const allUserMetrics = grouped_metrics?.map(({metrics})=>metrics).flat();
        if(!allUserMetrics) return [];
        //group by metric name
        const groupedByMetric = allUserMetrics.reduce((acc,metric)=>{
            if(!acc[metric.metric.metric_name]) acc[metric.metric.metric_name] = [];
            acc[metric.metric.metric_name].push(metric);
            return acc;
        },{} as Record<string,IndividualPerformanceUserMetric[]>);
        //get the trends
        return Object.entries(groupedByMetric).map(([metricName,metrics])=>({
            metricName,
            goal:round(metrics[0].metric.goal,2),
            trends:metrics.map(({id,date,value})=>({
                userMetricId:id,
                date,
                score:round(value,2)
            }))
        }));        
        
    },[grouped_metrics]);

    return (
        <>
            <Head title="Performance Dashboard" />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container pb-2.5 overflow-y-auto'>
                    <div className='md:relative flex flex-row md:flex-col items-center'>
                        <Header logo='performance' title="Performance Dashboard" />                        
                        <IPDDropdown project_id={project.id} isTeamLead={is_team_leader} isAdmin={is_admin} className='md:absolute md:right-0 md:top-[0.7rem] !ring-offset-background focus-visible:!outline-none'  />
                    </div>                
                    <div className="flex-1 flex flex-col gap-y-3.5 overflow-y-auto">
                        <div className='h-auto flex flex-col gap-y-1 md:gap-y-0 md:flex-row md:items-center md:justify-between'>
                            <ProjectSelectionComboBox isAdmin={is_admin || is_team_leader} projects={(is_team_leader && !is_admin)? project_histories : projects} selectedProject={project} onSelectProject={onProjectSelect} />
                            <div className='flex items-center gap-x-1.5'>
                                <UserSelectionComboBox isTeamLead={is_team_leader||is_admin} users={agents} selectedUser={selectedUser} onSelectUser={setSelectedUser} />
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            size='sm'
                                            id="date"
                                            variant={"outline"}
                                            className={cn(
                                            "w-60 justify-start text-left font-normal",
                                            !initialDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {initialDate?.from ? (
                                                initialDate.to ? (
                                                    <>
                                                    {format(initialDate.from, "LLL dd, y")} -{" "}
                                                    {format(initialDate.to, "LLL dd, y")}
                                                    </>
                                                ) : (
                                                    format(initialDate.from, "LLL dd, y")
                                                )
                                                ) : (
                                                <span className='text-xs'>Select date range or Pick a Date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={initialDate?.from}
                                        selected={initialDate}
                                        onSelect={setDate}
                                        numberOfMonths={1}
                                    />
                                    </PopoverContent>
                                </Popover>
                                <Button size='sm' onClick={navigate} variant='secondary'>
                                    Go
                                    <SquareArrowRightIcon className='h-5 w-5 ml-2' />
                                </Button>
                            </div>
                        </div>
                        {(!!date_range?.to && !!date_range?.from && !!agent_averages) && (
                            <div className='h-auto flex flex-col gap-y-2.5'>
                                <Accordion defaultValue='averages' type='single' collapsible className="w-full">                                    
                                    <AccordionItem value='averages'>
                                        <AccordionTrigger className='text-lg font-bold tracking-tight'>
                                            {`${!isSelf?'Agent':'My'}`} Averages from {format(date_range.from,'PP')} to {format(date_range.to,'PP')}
                                        </AccordionTrigger>
                                        <AccordionContent asChild>
                                            {((chartData || []).length > 0? 
                                            <ResponsiveContainer height={400} width={'100%'}>
                                                <BarChart data={chartData}>
                                                    <CartesianGrid stroke='#64748b' strokeDasharray="3 3" />
                                                    <XAxis className='text-xs' dataKey="Metric" />
                                                    <Tooltip labelClassName='text-slate-900 font-semibold' />
                                                    <Legend />
                                                    <Bar radius={[4, 4, 0, 0]}  dataKey="Average" fill="#ec4899" activeBar={<Rectangle fill="#db2777" stroke="#be185d" />} >
                                                    <LabelList dataKey="LabelAve" />
                                                    </Bar>
                                                        {totalGoals!==0&&<Bar radius={[4, 4, 0, 0]}   dataKey="Goal" fill="#3b82f6" activeBar={<Rectangle fill="#2563eb" stroke="#1d4ed8" />} >
                                                        <LabelList dataKey="LabelGoal"/>
                                                    </Bar>}
                                                </BarChart>
                                            </ResponsiveContainer>
                                            :
                                            <Card className='border border-dashed'>
                                                <div className='opacity-50'>
                                                    <CardHeader className='flex items-center justify-center'>
                                                    <BarChartBig size={50} />
                                                    </CardHeader>
                                                    <CardContent className="h-[60%] flex items-center justify-center">
                                                        <CardTitle>No Content Available</CardTitle>
                                                    </CardContent>
                                                </div>
                                            </Card>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>                                      
                                </Accordion>
                                <Accordion  defaultValue='trends' type='single' collapsible className="w-full">                                    
                                    <AccordionItem value='trends'>
                                        <AccordionTrigger className='text-lg font-bold tracking-tight'>
                                            {`${!isSelf?'Agent':'My'}`} Daily Trends from {format(date_range.from,'PP')} to {format(date_range.to,'PP')}
                                        </AccordionTrigger>
                                        <AccordionContent asChild>
                                            {((trends || []).length > 0? 
                                                <TrendsPanel trends={trends} />
                                                :
                                                <Card className='border border-dashed'>
                                                    <div className='opacity-50'>
                                                        <CardHeader className='flex items-center justify-center'>
                                                        <BarChartBig size={50} />
                                                        </CardHeader>
                                                        <CardContent className="h-[60%] flex items-center justify-center">
                                                            <CardTitle>No Content Available</CardTitle>
                                                        </CardContent>
                                                    </div>
                                                </Card>
                                            )}
                                            
                                        </AccordionContent>
                                    </AccordionItem>                                      
                                </Accordion>
                                <Accordion  defaultValue='daily-breakdown' type='single' collapsible className="w-full">                                    
                                    <AccordionItem value='daily-breakdown'>
                                        <div className=' flex-1  flex flex-col gap-y-2.5 overflow-y-auto'>
                                            <div className='h-auto flex items-center justify-between'>
                                                <Button variant="link" className=' p-0 m-0 flex items-start justify-start text-lg text-left font-bold tracking-tight flex-1'>
                                                    <h3 className='text-lg text-left font-bold'>
                                                        {`${!isSelf?agentName:'My'} Performance - ${format(date_range.from,'LLL dd, y')}`}
                                                        {!!date_range.to && ` to ${format(date_range.to,'LLL dd, y')}`}
                                                    </h3>
                                                </Button>
                                                <div className='ml-auto flex'>
                                                    <Button size='sm' variant='outline' className='border-r-0 rounded-r-none' onClick={onShrinkAll}>
                                                        <ShrinkIcon className='h-5 w-5' />
                                                        <span className='ml-2 hidden md:inline'>Shrink All</span>
                                                    </Button>
                                                    <Button size='sm' variant='outline' className='rounded-l-none' onClick={onExpandAll}>
                                                        <span className='mr-2 hidden md:inline'>Expand All</span>
                                                        <ExpandIcon className='h-5 w-5' />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                      
                                        <AccordionContent asChild>
                                            {( !!agent && !!date_range?.from && grouped_metrics && grouped_metrics.length > 0 ?
                                                <Accordion  type="multiple" value={opened} onValueChange={onSetOpened} className="w-full">
                                                    {grouped_metrics.map(group=>(                                        
                                                        <AccordionItem key={group.date} value={group.date}>
                                                            <AccordionTrigger className='text-lg flex items-center justify-between group'>
                                                                <div className='flex items-center gap-x-2'>
                                                                    <span>{group.date}</span>
                                                                    {(is_admin||is_team_leader)&&(<Hint label='Edit Agent Metric'>
                                                                        <p role='button' className=' opacity-0 group-hover:opacity-100 transition duration-300' onClick={e=>onSetMetricToEdit(group,e)}>
                                                                            <Edit className='h-5 w-5 text-primary' />
                                                                        </p>
                                                                    </Hint>)}
                                                                </div>
                                                            </AccordionTrigger>
                                                            <AccordionContent asChild>
                                                                <div className='gap-5 flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                                                                    {group.metrics.map(userMetric=>  <UserMetricCardItem agent={agent} key={userMetric.id}   userMetric={userMetric} />)}
                                                                </div>  
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    ))}                                        
                                                </Accordion>
                                                :
                                                <Card className='border border-dashed'>
                                                    <div className='opacity-50'>
                                                        <CardHeader className='flex items-center justify-center'>
                                                        <BetweenHorizontalStart size={50} />
                                                        </CardHeader>
                                                        <CardContent className="h-[60%] flex items-center justify-center">
                                                            <CardTitle>No Content Available</CardTitle>
                                                        </CardContent>
                                                    </div>
                                                </Card>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>                                      
                                </Accordion>
                            </div>
                        )}
                        {/*This Content was modified into top because of unresponsiveness*/}
                        {/* <div className='flex-1  flex flex-col gap-y-2.5 overflow-y-auto'>
                            { !!agent && !!date_range?.from && grouped_metrics && grouped_metrics.length>1 &&(
                                <>
                                    <div className='h-auto flex items-center justify-between'>
                                        <h3 className='text-lg font-bold tracking-tight'>
                                            {`${!isSelf?agentName:'My'} Performance - ${format(date_range.from,'LLL dd, y')}`}
                                            {!!date_range.to && ` to ${format(date_range.to,'LLL dd, y')}`}
                                        </h3>
                                        <div className='flex'>
                                            <Button size='sm' variant='outline' className='border-r-0 rounded-r-none' onClick={onShrinkAll}>
                                                <ShrinkIcon className='h-5 w-5' />
                                                <span className='ml-2 hidden md:inline'>Shrink All</span>
                                            </Button>
                                            <Button size='sm' variant='outline' className='rounded-l-none' onClick={onExpandAll}>
                                                <span className='mr-2 hidden md:inline'>Expand All</span>
                                                <ExpandIcon className='h-5 w-5' />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className='overflow-y-auto flex flex-col gap-y-3.5'>
                                        <Accordion  type="multiple" value={opened} onValueChange={onSetOpened} className="w-full">
                                            {grouped_metrics.map(group=>(                                        
                                                <AccordionItem key={group.date} value={group.date}>
                                                    <AccordionTrigger className='text-lg flex items-center justify-between group'>
                                                        <div className='flex items-center gap-x-2'>
                                                            <span>{group.date}</span>
                                                            {(is_admin||is_team_leader)&&(<Hint label='Edit Agent Metric'>
                                                                <p role='button' className=' opacity-0 group-hover:opacity-100 transition duration-300' onClick={e=>onSetMetricToEdit(group,e)}>
                                                                    <Edit className='h-5 w-5 text-primary' />
                                                                </p>
                                                            </Hint>)}
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent asChild>
                                                        <div className='gap-5 flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                                                            {group.metrics.map(userMetric=>  <UserMetricCardItem agent={agent} key={userMetric.id}   userMetric={userMetric} />)}
                                                        </div>  
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}                                        
                                        </Accordion>
                                    </div>
                                </>
                            )}
                        </div> */}
                    </div>                    
                </div>
            </Layout>
            <RateAgentsModal agentRatings={metricToEdit} agents={agents} isOpen={showRateAgentsModal} onClose={handleClose} projectMetrics={project.metrics} />
        </>
    );
};

export default IndividualPerformanceDashboard;


