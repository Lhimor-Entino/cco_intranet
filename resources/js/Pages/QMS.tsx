import Layout from "@/Components/Layout/Layout";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/Components/ui/dialog";
import { Project, QMS, Team } from "@/types";
import { Head } from "@inertiajs/inertia-react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { BarChart, CalendarIcon, Filter, Home, ListChecks, SquareArrowRightIcon } from "lucide-react";
import { FC, useMemo, useState } from "react";
import QMSBarchartX from "./QMSComponents/QMSBarchartX";
import QMSBarchartY from "./QMSComponents/QMSBarchartY";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { QMSDataTable } from "./QMSComponents/QMSDataTable";
import { QMSColumns } from "./QMSComponents/QMSColumns";
import { DateRange } from "react-day-picker";
import { Separator } from "@/Components/ui/separator";
import { Label } from "@/Components/ui/label";
import TeamsComboBox from "@/Components/TeamsComboBox";
import { cn, convertToTimezone, parseDateRange } from "@/lib/utils";
import { Inertia } from "@inertiajs/inertia";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";

import { Calendar } from "@/Components/ui/calendar";
import { format } from "date-fns";
import ProjectSelectionComboBox from "./IndividualPerformance/ProjectSelectionComboBox";

interface Props {
    is_team_leader:boolean;
    is_admin:boolean;
    date_range?:DateRange;
    teams:Team[];
    team:Team;
    projects: Project[];
    team_projects: Project[];
    project : Project;
}

const QMS:FC<Props> = ({is_team_leader,is_admin,date_range,teams,team,projects,team_projects,project}) => {
    const sample_data: QMS[] = [];
    const [toggle,setToggle] = useState(true);
    const [date, setDate] = useState<DateRange | undefined>(date_range);
    useMemo(() => {
        const date_parsed = parseDateRange(date_range);
        const param = {from: convertToTimezone(new Date(date_parsed.from + '')), to: convertToTimezone(new Date(date_parsed.to + ''))}
        setDate(param);
    },[]);
    return (
      <>
          <Head title="Quality Management System" />
            <Layout title={`Quality Management System`}>
                <div className=' h-full flex flex-col gap-y-3.5 px-[1.75rem] container py-2.5'>
                    <div className="w-full flex justify-end">
                        <Button variant={'outline'} size={'sm'} className="mr-2"
                            onClick={() => setToggle(!toggle)}>
                            {toggle? 'Go to Audit Board' : 'Go to Homepage'}
                            {toggle? (<ListChecks className="ml-2" />) : (<Home className="ml-2" />)}
                        </Button>
                        <FilterDialog 
                        date={date}
                        project={project}
                        setDate={setDate}
                        team={team}
                        team_projects={team_projects}
                        teams={teams}/>
                    </div>
                    <Card className="border-primary/50 border-2 shadow-xl w-full">
                        <CardContent className="p-0 border grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 border">
                                <div className="flex justify-center">
                                <div>
                                    <small className="text-primary/70">Completion Rate</small>
                                    <h1 className="text-5xl">60%</h1>
                                    <small className="text-primary/70">60 out of 100</small>
                                </div>
                                </div>
                                <div className="flex items-center p-2  p-0">
                                <div className="flex-grow  p-0 m-0">
                                        <small className="text-primary/70">AVG. Audit Time</small>
                                            <h1 className="text-2xl">10 hr 10 min 52 sec</h1>
                                        <small className="text-primary/70">Goal: 10min 0 sec</small>
                                </div>
                                </div>
                                <div className="flex items-center p-2  p-0">
                                <div className="flex-grow  p-0 m-0">
                                        <small className="text-primary/70">AVG. Audit Score </small>
                                            <h1 className="text-2xl">-4.09</h1>
                                        <small className="text-primary/70">Goal: -5 to +5</small>
                                </div>
                                </div>
                                <div className="flex items-center p-2  p-0">
                                <div className="flex-grow  p-0 m-0">
                                        <small className="text-primary/70">AVG. Audit Time</small>
                                            <h1 className="text-2xl">89.97%%</h1>
                                        <small className="text-primary/70">Goal: 90.00%</small>
                                </div>
                                </div>
                        </CardContent>
                    </Card>
                    <div className="grid grid-cols-2 gap-4 h-full">
                        <div className=" text-white p-0">
                            <Card className="h-full border-primary/50 border-2 shadow-xl w-full">
                                <QMSDataTable data={sample_data}  columns={QMSColumns}/>
                            </Card>
                        </div>
                        <div className=" text-white p-0">
                            <Card className="h-full border-primary/50 border-2 shadow-xl w-full">
                                <CardContent className="p-5">
                                <ScrollArea className="h-46">
                                    <QMSBarchartX/>
                                    <QMSBarchartY/>
                                </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </Layout>
      </>
    );
}

interface Filter {
    className?:string;
    date_range?:DateRange;
    teams:Team[];
    team:Team;
    team_projects: Project[];
    project : Project;
    date:DateRange | undefined;
    setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}
const FilterDialog:FC<Filter> = ({className,date_range,teams,team,team_projects,project:initial_project,date,setDate}) => {
    const queryParams = new URLSearchParams(window.location.search);
    const isOpen:boolean =  queryParams.get('open') === "true" ??false;
    const [project, setProject] = useState<Project>(initial_project);
    const navigate = () => {
        const new_date = parseDateRange(date);
        Inertia.get(route('quality_management_system.index',{team_id:team.id,project_id: project.id,date:new_date}));
    }
    const onTeamSelect = (t:Team) => {
        const new_date = parseDateRange(date);
        Inertia.get(route('quality_management_system.index',{team_id:t.id,date:new_date,open:'true'}));
    }
    const onProjectSelect = (p:Project) => setProject(p); //Inertia.get(route('individual_performance_dashboard.team',{team_id:team.id, project_id:p.id}));
    
    return (
        <Dialog defaultOpen={isOpen}>
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
              <Label>Date Range</Label>
              <div className='flex w-full items-center'>
                  <Popover>
                      <PopoverTrigger asChild>
                          <Button
                              size='sm'
                              id="date"
                              variant={"outline"}
                              className={cn(
                              "!w-full ml-2 w-60 justify-start text-left font-normal rounded-r-none",
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
          <div className="grid w-full items-center gap-1.5">
              <Label>Team</Label>
              <TeamsComboBox className ='!w-full' teams={teams} onTeamSelect={onTeamSelect} selectedTeam={team} size='sm' />          
          </div>
          <div className="grid w-full items-center gap-1.5">
              <Label>Project</Label>
              <ProjectSelectionComboBox className="!w-full" projects={team_projects} selectedProject={project}  onSelectProject={onProjectSelect} isAdmin/>
          </div>
          </DialogContent>
      </Dialog>
    );
}
export default QMS;