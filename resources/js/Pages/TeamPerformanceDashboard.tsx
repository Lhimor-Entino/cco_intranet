import Header from '@/Components/Header';
import Layout from '@/Components/Layout/Layout';
import { Head, usePage } from '@inertiajs/inertia-react';
import {FC, useMemo, useState} from 'react';
import IPDDropdown from './IndividualPerformance/IPDDropdown';
import { PageProps, Project, Team, User } from '@/types';
import ProjectSelectionComboBox from './IndividualPerformance/ProjectSelectionComboBox';
import { Inertia, Page } from '@inertiajs/inertia';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { CalendarIcon, SquareArrowRightIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/Components/ui/calendar';
import TeamsComboBox from '@/Components/TeamsComboBox';
import { Trend, UserMetricAverage } from './IndividualPerformanceDashboard';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion';
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { BreakDown, IndividualPerformanceUserMetric, TeamTrend, TopPerformer } from '@/types/metric';
import TrendsPanel from './IndividualPerformance/Dashboard/TrendsPanel';
import TopPerformers from './IndividualPerformance/Dashboard/TopPerformers';
import AverageBarChart from './IndividualPerformance/Dashboard/AverageBarChart';


interface Props {
    is_team_leader:boolean;
    is_admin:boolean;
    date_range?:DateRange;
    teams:Team[];
    team:Team;
    breakdown:BreakDown[];
    user_metrics :IndividualPerformanceUserMetric[];
    team_trends:TeamTrend[];
    top_performers: TopPerformer[];
}

const TeamPerformanceDashboard:FC<Props> = ({is_team_leader,is_admin,date_range,teams,team, breakdown,team_trends,top_performers}) => {

    const {user} = usePage<Page<PageProps>>().props.auth;
    const [date, setDate] = useState<DateRange | undefined>(date_range);
    const onTeamSelect = (t:Team) =>Inertia.get(route('individual_performance_dashboard.team',{team_id:t.id}));
    const ownTeam = user.team_id===team.id;
    const navigate = () =>Inertia.get(route('individual_performance_dashboard.team',{team_id:team.id,date}));
    
    const formattedTrends:Trend[] = useMemo(()=>{
        return team_trends.map(trend=>({
            metricName:trend.metric_name,
            goal:trend.goal,
            trends:trend.trends.map((t,idx)=>({
                userMetricId:idx,
                date:t.date,
                score:t.average
            }))
        }));
    },[team_trends]);
    
    return (
        <>
            <Head title="Team Performance Dashboard" />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container pb-2.5 overflow-y-auto'>
                    <div className='md:relative flex flex-row md:flex-col items-center'>
                        <Header logo='performance'  title={`${ownTeam?"My Team's":team.name} Performance Dashboard`} />                        
                        <IPDDropdown isTeamLead={is_team_leader} isAdmin={is_admin} className='md:absolute md:right-0 md:top-[0.7rem] !ring-offset-background focus-visible:!outline-none'  />
                    </div>
                    <div className="flex-1 flex flex-col gap-y-3.5 overflow-y-auto">
                        <div className='h-auto flex flex-col gap-y-1 md:gap-y-0 md:flex-row md:items-center md:justify-between'>
                            <TeamsComboBox teams={teams} onTeamSelect={onTeamSelect} selectedTeam={team} size='sm' />
                            <div className='flex items-center'>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            size='sm'
                                            id="date"
                                            variant={"outline"}
                                            className={cn(
                                            "w-60 justify-start text-left font-normal rounded-r-none",
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
                        <div className='flex-1 flex flex-col overflow-y-auto gap-y-3.5'>
                            <div className='overflow-auto'>
                                {(!!date_range?.to && !!date_range?.from) && (
                                    <div className='h-auto flex flex-col gap-y-2.5'>
                                        <Accordion defaultValue={['averages']} type='multiple' className="w-full">                                    
                                            <AccordionItem value='averages'>
                                                <AccordionTrigger className='text-lg font-bold tracking-tight'>
                                                    {`${!ownTeam?team.name:"My Team"}'s`} Averages from {`${format(date_range.from,'PP')} to ${format(date_range.to,'PP')}`}
                                                </AccordionTrigger>
                                                <AccordionContent asChild>
                                                    <AverageBarChart breakdown={breakdown} />
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value='trends'>
                                                <AccordionTrigger className='text-lg font-bold tracking-tight'>
                                                    {`${ownTeam?"My Team":team.name}'s`} Average Daily Trends from {`${format(date_range.from,'PP')} to ${format(date_range.to,'PP')}`}
                                                </AccordionTrigger>
                                                <AccordionContent asChild>
                                                    <TrendsPanel trends={formattedTrends} />
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value='tops'>
                                                <AccordionTrigger className='text-lg font-bold tracking-tight'>
                                                    {`${ownTeam?"My Team":team.name}'s`} Top Performers {`${format(date_range.from,'PP')} to ${format(date_range.to,'PP')}`}
                                                </AccordionTrigger>
                                                <AccordionContent asChild>
                                                    <TopPerformers topPerformers={top_performers} />
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

export default TeamPerformanceDashboard;