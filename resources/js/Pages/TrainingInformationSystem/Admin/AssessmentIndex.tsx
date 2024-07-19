import Layout from '@/Components/Layout/Layout';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { TrainingAssessment, TrainingAssessmentResult } from '@/types/trainingInfo';
import { Head } from '@inertiajs/inertia-react';
import {ChangeEventHandler, FC, FormEventHandler, useEffect, useState} from 'react';
import AssessmentIndexItem from './AssessmentComponents/AssessmentIndex/AssessmentIndexItem';
import ManualCheckModal from './AssessmentComponents/AssessmentIndex/ManualCheckModal';
import { Pagination, User } from '@/types';
import { DateRange } from 'react-day-picker';
import { Input } from '@/Components/ui/input';
import { useDebounceValue } from 'usehooks-ts';
import { Inertia } from '@inertiajs/inertia';
import { Label } from '@/Components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { Button } from '@/Components/ui/button';
import { ExportToExcel, cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRight, FileSpreadsheet, ListFilter } from 'lucide-react';
import { Calendar } from '@/Components/ui/calendar';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/Components/ui/select';



type PaginatedResults= Pagination &{ data:TrainingAssessmentResult[]}


interface Props {
    results:PaginatedResults;
    remarks?:'needs_manual_check'|'passed'|'failed'|'all';
    dateRange?:DateRange;
    user_filter?:string;
    per_page?:string;
}

const AssessmentIndex:FC<Props> = ({results,remarks='all',dateRange,user_filter,per_page='10'}) => {
    const [manualCheck,setManualCheck] = useState<TrainingAssessmentResult|undefined>();
    const [userFilter,setUserFilter] = useState(user_filter||"");
    const [dateFilters,setDateFilters] = useState<DateRange|undefined>(dateRange);
    const [remarkFilters,setRemarkFilters] = useState<typeof remarks>(remarks);
    const [perPage,setPerPage] = useState(per_page);

    
    const onSubmit:FormEventHandler<HTMLFormElement> = e =>{
        e.preventDefault();
        Inertia.get(route('assessment.index'),{
            per_page:perPage,
            remarks:remarkFilters||null,
            params:userFilter,
            //@ts-ignore
            dateRange:dateFilters
        });
    }

    const onValueChange = (e:string) => setRemarkFilters(e as typeof remarks);


    const handleGenerateReport = async()=>{
        const fileName = 'AssessmentReport.xlsx';
        const data = await formatReport(results.data);        
        await ExportToExcel(data,fileName);
    };

    const showPerPage = ['10','20','50','100','No Limit'];

    const onShowPerPageChange = (num:string) =>{
        //setPerPage(num);
        Inertia.get(route('assessment.index'),{
            per_page:num,
            remarks:remarkFilters||null,
            params:userFilter,
            //@ts-ignore
            dateRange:dateFilters
        });
    };
    

    return (
        <>
            <Head title='Assessments' />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container py-2.5 items-center justify-center '>
                    
                    <form className='h-auto flex items-center gap-x-2' onSubmit={onSubmit}>
                        <div className='space-y-1'>
                            <Label>Filter By Employee:</Label>
                            <Input value={userFilter} onChange={({target})=>setUserFilter(target.value)} className='h-9 placeholder:text-xs' placeholder='ID No./First Name/Last Name' />
                        </div>
                        <div className='flex flex-col gap-y-3'>
                            <Label>Filter By Date Range:</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    size='sm'
                                    variant='secondary'
                                    className={cn(
                                    "w-60 justify-start text-left font-normal",
                                    !dateFilters && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateFilters?.from ? (
                                    dateFilters.to ? (
                                        <>
                                        {format(dateFilters.from, "LLL dd, y")} -{" "}
                                        {format(dateFilters.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(dateFilters.from, "LLL dd, y")
                                    )
                                    ) : (
                                    <span>Pick a date range</span>
                                    )}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={dateFilters?.from}
                                    selected={dateFilters}
                                    onSelect={setDateFilters}
                                    numberOfMonths={1}                                    
                                />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className='space-y-1'>
                            <Label>Filter By Remakrs:</Label>
                            <Select value={remarkFilters} onValueChange={onValueChange}>
                                <SelectTrigger className="w-44 h-9 border border-primary">
                                    <SelectValue placeholder="Select a remark " />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Remarks</SelectLabel>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="passed">Passed</SelectItem>
                                        <SelectItem value="needs_manual_check">Needs Manual Check</SelectItem>
                                        <SelectItem value="failed">Failed</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type='submit' size='sm' className='mt-auto' >
                            <ListFilter className='h-5 w-5 mr-2' />
                            Filter
                        </Button>
                        <Button onClick={handleGenerateReport} type='button' variant='secondary' size='sm' className='mt-auto' >
                            <FileSpreadsheet className='h-5 w-5 mr-2' />
                            Export to Excel
                        </Button>
                    </form>
                    
                    <div className='flex flex-1 overflow-y-auto relative w-full'>
                        <Table className=''>
                            <TableHeader className='sticky top-0 z-50 bg-background'>
                                <TableRow className='text-sm'>
                                    <TableHead>Agent</TableHead>                                    
                                    <TableHead>Assessment Title</TableHead>
                                    <TableHead>Max Score</TableHead>
                                    <TableHead>Passing Score</TableHead>
                                    <TableHead>Agent Score</TableHead>
                                    <TableHead>Manual Checked By</TableHead>
                                    <TableHead>Date Taken</TableHead>
                                    <TableHead>Remarks</TableHead>
                                    <TableHead> Actions </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className='z-40'>
                                {
                                    results.data.map((r)=><AssessmentIndexItem onManualCheck={()=>setManualCheck(r)} key={r.id} result={r} />)
                                }
                            </TableBody>
                        </Table>
                    </div>
                    <div className='h-auto w-full flex items-center justify-between'>
                        <div className='flex gap-x-1.5 items-center'>
                            <Label>Show:</Label>
                            <Select value={perPage} onValueChange={onShowPerPageChange}>
                                <SelectTrigger className="h-9 w-44 border border-primary">
                                    <SelectValue placeholder="Select a remark " />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Show:</SelectLabel>
                                        {showPerPage.map((item,index)=><SelectItem key={index} value={item}>{item}</SelectItem>)}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <span className='text-sm'>Showing {results.from} to {results.to} of {results.total} results</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => Inertia.get(results.first_page_url)} disabled={results.current_page===1} >
                                <span className="sr-only">Go to first page</span>
                                <ChevronsLeftIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" className="h-8 w-8 p-0" onClick={()=>results.prev_page_url&&Inertia.get(results.prev_page_url)} disabled={!results?.prev_page_url}>
                                <span className="sr-only">Go to previous page</span>
                                <ChevronLeftIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" className="h-8 w-8 p-0" onClick={()=>results.next_page_url&&Inertia.get(results.next_page_url)} disabled={!results?.next_page_url}>
                                <span className="sr-only">Go to next page</span>
                                <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => Inertia.get(results.last_page_url)} disabled={results.current_page===results.last_page} >
                                <span className="sr-only">Go to last page</span>
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </Layout>
            {!!manualCheck && <ManualCheckModal result={manualCheck} isOpen={!!manualCheck} onClose={()=>setManualCheck(undefined)} />}
        </>
    );
};

export default AssessmentIndex;


const formatReport:(data:TrainingAssessmentResult[])=>Promise<any[]>= async(data) =>{
    
    /*
    arrange in the format below:
    Agent	Company ID	Assessment Title	Max Score	Passing Score	Agent Score	Manual Checked By	Date Taken  Remarks
    AgentName    IDNUMBER	AssessmentTitle	30	20	21	ManualCheckerName	2021-09-01 22:00	Passed
    */
    const header = ['Agent','Company ID','Assessment Title','Max Score','Passing Score','Agent Score','Manual Checked By','Date Taken','Remarks'];
    const rows = data.map(r=>[
        `${r.user.first_name} ${r.user.last_name}`,
        r.user.company_id,
        r.assessment?.title||'N/A or Deleted',
        r.max_score,
        r.passing_score,
        r.user_score,
        !r.checked_by_id?'N/A':`${r.checked_by.first_name} ${r.checked_by.last_name} - ${format(new Date(r.date_checked!),'yyyy-MM-dd HH:mm')}`,
        format(new Date(r.created_at),'yyyy-MM-dd HH:mm'),
        !!r.checked_by_id?
            r.user_score >= r.passing_score?'Passed':'Failed'
            :
            'Needs manual checking'
    ]);
    return [header,...rows];
}