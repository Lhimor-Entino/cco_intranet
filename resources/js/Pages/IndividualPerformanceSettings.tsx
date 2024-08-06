import Header from '@/Components/Header';
import Layout from '@/Components/Layout/Layout';
import { Head, usePage } from '@inertiajs/inertia-react';
import React, {FC, useState} from 'react';
import IPDDropdown from './IndividualPerformance/IPDDropdown';
import { PageProps, Project } from '@/types';
import { Inertia, Page } from '@inertiajs/inertia';
import ProjectSelectionComboBox from './IndividualPerformance/ProjectSelectionComboBox';
import { IndividualPerformanceMetric } from '@/types/metric';
import { Button } from '@/Components/ui/button';
import { BetweenHorizontalStart, CircleHelp, HashIcon, Info, PackagePlusIcon, Pencil, PencilIcon, Save, Trash2Icon } from 'lucide-react';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import MetricModal from './IndividualPerformance/Settings/MetricModal';
import MetricItem from './IndividualPerformance/Settings/MetricItem';
import DeleteMetricModal from './IndividualPerformance/Settings/DeleteMetricModal';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Separator } from '@/Components/ui/separator';
import { Toggle } from '@/Components/ui/toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import { toast } from 'sonner';
interface Props {
    project?:Project;
    metrics?:IndividualPerformanceMetric[];
}

const IndividualPerformanceSettings:FC<Props> = ({metrics,project}) => {
    const {projects} = usePage<Page<PageProps>>().props;
    const navigate = (selectedProject:Project) =>Inertia.get(route('individual_performance_dashboard.settings',{project_id:selectedProject.id}));
    const [metricModal, setMetricModal] = useState({
        isOpen:false,
        metric: undefined as IndividualPerformanceMetric|undefined
    });
    const [deleteMetricModal, setDeleteMetricModal] = useState<IndividualPerformanceMetric|undefined>();

    const handleMetricModal = (metric?:IndividualPerformanceMetric) => setMetricModal({isOpen:true,metric});
    
    /*Drag and Drop Additional************************************************************************/
    const reorder = (list:(IndividualPerformanceMetric[]|undefined), startIndex:number, endIndex:number): IndividualPerformanceMetric[] => {
        if (!list) {
            throw new Error("The list is undefined.");
        }
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
      };
    
    const onDragEnd = (result: DropResult) => {
       if (!result.destination) {
        return;
      }
  
      metrics = reorder(
        metrics,
        result.source.index,
        result.destination.index
      );
  
    }
   const grid = 8;
   const axios = require('axios');
   const [editable, setEditable] = useState(false);
   const handleToggleEditable = () => {
    setEditable(!editable);
    if(!editable){ toast.message('Rows are now draggable!');}
   };
   const onSubmit = () => {
    const href = route('individual_performance_dashboard.save.order');
    axios.post(href,{metrics:metrics})
    .then((res:any) => { console.log('response: ', res);})
    .catch((e:any) => {})
    .finally(() => {})
   }
   /*************************************************************************************************/
    return (
        <>
            <Head title="Individual Performance Settings" />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container pb-2.5'>
                    <div className='md:relative flex flex-row md:flex-col items-center'>
                        <Header logo='performance'  title="Individual Performance Settings" />                        
                        <IPDDropdown isAdmin isTeamLead project_id={project?.id} className='md:absolute md:right-0 md:top-[0.7rem] !ring-offset-background focus-visible:!outline-none' />
                    </div>                
                    <div className="flex-1 flex flex-col overflow-y-auto gap-y-3.5">
                        <div className='h-auto flex flex-col gap-y-1 md:gap-y-0 md:flex-row md:items-center md:justify-between'>
                            <div className='flex items-center gap-x-2'>
                                <ProjectSelectionComboBox isAdmin projects={projects} selectedProject={project} onSelectProject={navigate} />
                                <Button onClick={()=>handleMetricModal()} variant='secondary'>
                                    <PackagePlusIcon className='h-5 w-5' />
                                    <span className='hidden md:ml-2 md:inline'>Add Metric</span>
                                </Button>
                            </div>
                            <p className='font-bold text-left md:text-right'>
                                {project?`Metrics for ${project.name}`:"Select a project to view metrics"}
                            </p>
                        </div>
                        <div className='h-auto flex flex-col gap-y-1 md:gap-y-0 md:flex-row md:items-center md:justify-between'>
                            <div className='flex-1'>
                                <Separator/>
                            </div>
                            <div className='ml-auto flex items-center gap-x-2'>
                                <Toggle variant='default' size='sm' onClick={handleToggleEditable}>
                                    <Pencil size={16}/>
                                    <small className='m-1'>{!editable? 'Enable' : 'Disable'} Reordering</small>
                                </Toggle>
                                <Button onClick={onSubmit} className={editable? 'text-left md:text-right' : 'hidden text-left md:text-right'}  size='sm' variant='ghost'>
                                  <Save />
                                  <small className='m-1'>Save Order</small>
                                </Button>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                        <CircleHelp  className='cursor-pointer float-right opacity-50'/>
                                        </TooltipTrigger>
                                        <TooltipContent className='flex items-center gap-x-2'>
                                            <Info size={16}/>
                                            <p>Enables/Disables draggable rows to set column position.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                        {!!project&&(
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Table className='flex-1'>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>#</TableHead>
                                            <TableHead>Metric Name</TableHead>
                                            <TableHead>Created By</TableHead>
                                            <TableHead>Format</TableHead>
                                            <TableHead>Unit</TableHead>
                                            <TableHead>Daily Goal</TableHead>
                                            <TableHead className='text-right'>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                        <Droppable droppableId='droppable'>
                                        {(provided, snapshot) => (
                                            <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                                                {(metrics||[]).map((metric,index) => {
                                                    metric.position = (index + 1);
                                                    return (
                                                        <Draggable key={metric.id} draggableId={metric.id + ''} index={index} isDragDisabled={!editable}>
                                                            {(provided, snapshot) => ( <MetricItem index = {index + 1} snapshot={snapshot} provided={provided} key={metric.id} metric={metric} onEdit={handleMetricModal} onDelete={m=>setDeleteMetricModal(m)} /> )}
                                                        </Draggable>
                                                    )
                                                })}
                                            </TableBody>
                                        )}
                                        </Droppable>
                                    {/* <TableBody>
                                        {(metrics||[]).map(metric=> <MetricItem key={metric.id} metric={metric} onEdit={handleMetricModal} onDelete={m=>setDeleteMetricModal(m)} />)}
                                    </TableBody> */}
                                </Table>
                            </DragDropContext>
                        )}
                        {!project&&<div className='flex-1 flex items-center justify-center text-muted-foreground'>Select a project to view metrics</div>}
                    </div>                    
                </div>
            </Layout>
            {!!project&&<MetricModal project={project} isOpen={metricModal.isOpen} onClose={()=>setMetricModal({isOpen:false,metric:undefined})} metric={metricModal.metric} />}
            {!!deleteMetricModal&&<DeleteMetricModal isOpen={!!deleteMetricModal} onClose={()=>setDeleteMetricModal(undefined)} metric={deleteMetricModal} />}
        </>
    );
};

export default IndividualPerformanceSettings;