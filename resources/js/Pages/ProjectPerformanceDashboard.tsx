import { PageProps, Project, Team } from '@/types';
import { BreakDown, IndividualPerformanceUserMetric, TeamTrend, TopPerformer } from '@/types/metric';
import { Inertia, Page } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import {FC, useMemo, useState} from 'react';
import { DateRange } from 'react-day-picker';
import { Trend } from './IndividualPerformanceDashboard';
import Layout from '@/Components/Layout/Layout';
import Header from '@/Components/Header';
import IPDDropdown from './IndividualPerformance/IPDDropdown';
import ProjectSelectionComboBox from './IndividualPerformance/ProjectSelectionComboBox';
import { Popover, PopoverContent } from '@/Components/ui/popover';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { Button } from '@/Components/ui/button';
import { cn, convertToTimezone, parseDateRange } from '@/lib/utils';
import {  BarChartBig, BetweenHorizontalStart, CalendarIcon, Filter, SquareArrowRightIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/Components/ui/calendar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion';
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import TrendsPanel from './IndividualPerformance/Dashboard/TrendsPanel';
import TopPerformers from './IndividualPerformance/Dashboard/TopPerformers';
import AverageBarChart from './IndividualPerformance/Dashboard/AverageBarChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Separator } from '@/Components/ui/separator';
import { Label } from '@/Components/ui/label';

interface Props {
    is_team_leader:boolean;
    is_admin:boolean;
    date_range?:DateRange;
    projects:Project[];
    project_histories: Project[];
    project:Project;
    breakdown:BreakDown[];
    user_metrics :IndividualPerformanceUserMetric[];
    project_trends:TeamTrend[];
    top_performers: TopPerformer[];
}

const ProjectPerformanceDashboard:FC<Props> = ({is_team_leader,is_admin,date_range,projects,project, breakdown,project_trends,top_performers,project_histories}) => {
    const {user} = usePage<Page<PageProps>>().props.auth;
    const [date, setDate] = useState<DateRange | undefined>(date_range);
    useMemo(() => {
        const date_parsed = parseDateRange(date_range);
        const param = {from: convertToTimezone(new Date(date_parsed.from + '')), to: convertToTimezone(new Date(date_parsed.to + ''))}
        setDate(param);
    },[]);
    const onTeamSelect = (t:Team) =>Inertia.get(route('individual_performance_dashboard.project',{project_id:t.id}));
    const ownProject = user.team_id===project.id;
   
    const formattedTrends:Trend[] = useMemo(()=>{
        return project_trends.map(trend=>({
            metricName:trend.metric_name,
            goal:trend.goal,
            trends:trend.trends.map((t,idx)=>({
                userMetricId:idx,
                date:t.date,
                score:t.average
            }))
        }));
    },[project_trends]);

    return (
        <>
            <Head title="Project Performance Dashboard" />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container pb-2.5 overflow-y-auto'>
                    <div className='md:relative flex flex-row md:flex-col items-center'>
                        <Header logo='performance'  title={`${ownProject?"My Team's":project.name} Performance Dashboard`} />                        
                        <IPDDropdown isTeamLead={is_team_leader} isAdmin={is_admin} className='md:absolute md:right-0 md:top-[0.7rem] !ring-offset-background focus-visible:!outline-none'  />
                    </div>
                    <div className="flex-1 flex flex-col gap-y-3.5 overflow-y-auto">
                        <div className='h-auto flex flex-col gap-y-1 md:gap-y-0 md:flex-row md:items-center md:justify-between'>
                           <ModalFilter
                            date={date}
                            date_range={date_range}
                            setDate={setDate}
                            is_admin={is_admin}
                            is_team_leader={is_team_leader}
                            project={project}
                            project_histories={project_histories}
                            projects={projects}
                           />
                            
                        </div>
                        <div className='flex-1 flex flex-col overflow-y-auto gap-y-3.5'>
                            <div className='overflow-auto'>
                                {(!!date_range?.to && !!date_range?.from) && (
                                    <div className='h-auto flex flex-col gap-y-2.5'>
                                        <Accordion defaultValue={['averages','trends','tops']} type='multiple' className="w-full">                                    
                                            <AccordionItem value='averages'>
                                                <AccordionTrigger className='text-lg font-bold tracking-tight'> 
                                                    {`${!ownProject?project.name:"My Project"}'s`} Averages from {`${format(convertToTimezone(new Date(date_range.from + '')),'PP')} to ${format(convertToTimezone(new Date(date_range.to + '')),'PP')}`}
                                                </AccordionTrigger>
                                                <AccordionContent asChild>
                                                    {((breakdown || []).length > 0? 
                                                        <AverageBarChart breakdown={breakdown} />
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
                                            <AccordionItem value='trends'>
                                                <AccordionTrigger className='text-lg font-bold tracking-tight'>
                                                    {`${ownProject?"My Project":project.name}'s`} Average Daily Trends from {`${format(convertToTimezone(new Date(date_range.from + '')),'PP')} to ${format(convertToTimezone(new Date(date_range.to + '')),'PP')}`}
                                                </AccordionTrigger>
                                                <AccordionContent asChild>
                                                    {( (formattedTrends || []).length > 0? 
                                                        <TrendsPanel trends={formattedTrends} />
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
                                            <AccordionItem value='tops'>
                                                <AccordionTrigger className='text-lg font-bold tracking-tight'>
                                                    {`${ownProject?"My Team":project.name}'s`} Top Performers {`${format(convertToTimezone(new Date(date_range.from + '')),'PP')} to ${format(convertToTimezone(new Date(date_range.to + '')),'PP')}`}
                                                </AccordionTrigger>
                                                <AccordionContent asChild>
                                                    {((top_performers || []).length > 0? 
                                                        <TopPerformers topPerformers={top_performers} />
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
                            </div>
                        </div>
                    </div>                    
                </div>
            </Layout>
        </>
    );
};

export default ProjectPerformanceDashboard;

interface Filter {
    is_team_leader:boolean;
    is_admin:boolean;
    date_range?:DateRange;
    projects:Project[];
    project_histories: Project[];
    project:Project;
    date:DateRange | undefined;
    setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}
export const ModalFilter:FC<Filter> = ({is_team_leader,is_admin,date,setDate,projects,project:initial_project,project_histories}) => {
    const [project,setProject] = useState<Project>(initial_project);
    const onProjectSelect = (p:Project) => setProject(p);
    const navigate = () => {
        const new_date = parseDateRange(date);
        Inertia.get(route('individual_performance_dashboard.project',{project_id:project.id,date:new_date}));
    }
    return (
        <Dialog>
          <DialogTrigger asChild>
                <Button variant={"outline"} size={"sm"} className='min-w-[7.5rem]' >
                    <Filter className="h-4 w-4 mr-2"/>
                    Filter
                </Button>
            </DialogTrigger>
            <DialogContent>
            <DialogHeader>
                <DialogTitle className='flex items-center w-full'>
                    <Filter className="mr-2"/>
                    Filter Options
                </DialogTitle>
                <DialogDescription>
                    Use the filters to narrow down the records by <b>Agent</b>, <b>Date</b> and <b>Assigned Project</b>.
                </DialogDescription>
            </DialogHeader>
            <Separator className='border'/>
            <div className="grid w-full items-center gap-1.5">
                <Label>Project</Label>
                <ProjectSelectionComboBox className="!w-full" projects={(is_team_leader && !is_admin)? project_histories : projects} selectedProject={project} isAdmin={is_admin || is_team_leader} onSelectProject={onProjectSelect} />
            </div>
            <div className="grid w-full items-center gap-1.5">
                <Label>Date Range</Label>
                <div className='flex items-center'>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            size='sm'
                                            id="date"
                                            variant={"outline"}
                                            className={cn(
                                            "!w-full justify-start text-left font-normal rounded-r-none",
                                            !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date?.from ? (
                                                date.to ? (
                                                    <>
                                                    {format(date.from, "LLL dd, y")} -{" "}
                                                    {format(date.to, "LLL dd, y")}
                                                    </>
                                                ) : (
                                                    format(date.from, "LLL dd, y")
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
                                        defaultMonth={date?.from}
                                        selected={date}
                                        onSelect={setDate}
                                        numberOfMonths={1}
                                    />
                                    </PopoverContent>
                                </Popover>
                                <Button size='sm' onClick={navigate} variant='secondary' className='rounded-l-none'>
                                    Go
                                    <SquareArrowRightIcon className='h-5 w-5 ml-2' />
                                </Button>
                            </div>
            </div>
            
            </DialogContent>
        </Dialog>
    )
}