import Header from '@/Components/Header';
import Layout from '@/Components/Layout/Layout';
import { Head, usePage } from '@inertiajs/inertia-react';
import React, {FC, useEffect, useState} from 'react';
import IPDDropdown from './IndividualPerformance/IPDDropdown';
import { PageProps, Project } from '@/types';
import { Inertia, Page } from '@inertiajs/inertia';
import ProjectSelectionComboBox from './IndividualPerformance/ProjectSelectionComboBox';
import { Button } from '@/Components/ui/button';
import { BetweenHorizontalStart, CircleCheckBig, CircleHelp, HashIcon, Heading1, Info, Loader2, PackagePlusIcon, Pencil, PencilIcon, Save, Trash2Icon } from 'lucide-react';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import MetricModal from './IndividualPerformance/Settings/MetricModal';
import MetricItem from './IndividualPerformance/Settings/MetricItem';
import DeleteMetricModal from './IndividualPerformance/Settings/DeleteMetricModal';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Separator } from '@/Components/ui/separator';
import { Toggle } from '@/Components/ui/toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { QAElement } from '@/types/QAElement';
import ElementItem from './QMSComponents/QAElementSettings/ElementItem';
import ElementModal from './QMSComponents/QAElementSettings/ElementModal';
import DeleteElementModal from './QMSComponents/QAElementSettings/DeleteElementModal';
interface Props {
    project?:Project;
    elements?:QAElement[];
}

const QMSSettings:FC<Props> = ({elements,project}) => {
    const {projects} = usePage<Page<PageProps>>().props;
    const [elementState , setElementState] = useState(elements);
    useEffect(() => {setElementState(elements); }, [elements]);
    const navigate = (selectedProject:Project) =>Inertia.get(route('quality_management_system.settings',{project_id:selectedProject.id}));
    const [elementModal, setElementModal] = useState({
        isOpen:false,
        element: undefined as QAElement|undefined
    });
    const [deleteElementModal, setDeleteElementModal] = useState<QAElement|undefined>();
    const handleMetricModal = (element?:QAElement) => setElementModal({isOpen:true,element});
    
    /*Drag and Drop Additional************************************************************************/
    const reorder = (list:(QAElement[]|undefined), startIndex:number, endIndex:number) => {
        if (!list) {
            throw new Error("The list is undefined.");
        }
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        setElementState(result);
        // return result;
      };
    
    const onDragEnd = (result: DropResult) => {
       if (!result.destination) {
        return;
      }
  
     reorder(
        elementState,
        result.source.index,
        result.destination.index
      );
    }
   const grid = 8;
   const [loading,setLoading] = useState(false);
   const Icon = loading?Loader2:CircleCheckBig;
   const axios = require('axios');
   const [editable, setEditable] = useState(false);
   const handleToggleEditable = () => {
    setEditable(!editable);
    if(!editable){ toast.message('Rows are now draggable!');}
   };
   const onSubmit = () => {

 
    setLoading(true);
    const href = route('quality_management_system.order');
    axios.post(href,{elements:elements})
    .then((res:any) => { toast.success("Columns reordered successfully")})
    .catch((e:any) => {toast.error("Error! Something went wrong.")})
    .finally(() => {setEditable(!editable);  setLoading(false);})
   }

   /*************************************************************************************************/
    return (
        <>
            <Head title="QA Settings " />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container pb-2.5'>
                    <div className='md:relative flex flex-row md:flex-col items-center'>
                        <Header logo='performance'  title="QA Settings" />                        
                        <IPDDropdown isAdmin isTeamLead project_id={project?.id} className='md:absolute md:right-0 md:top-[0.7rem] !ring-offset-background focus-visible:!outline-none' />
                    </div>
                    <div className="flex-1 flex flex-col overflow-y-auto gap-y-3.5">
                        <div className='h-auto flex flex-col gap-y-1 md:gap-y-0 md:flex-row md:items-center md:justify-between'>
                            <div className='flex items-center gap-x-2'>
                                <ProjectSelectionComboBox isAdmin projects={projects} selectedProject={project} onSelectProject={navigate} />
                                <Button onClick={()=>handleMetricModal()} variant='secondary'>
                                    <PackagePlusIcon className='h-5 w-5' />
                                    <span className='hidden md:ml-2 md:inline'>Add Element</span>
                                </Button>
                            </div>
                            <p className='font-bold text-left md:text-right'>
                                {project?`QA Elements for ${project.name}`:"Select a project to view QA Elements"}
                            </p>
                        </div>
                        
                        {!!project&&(
                            <>
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
                                        <Icon className={cn(loading&&'animate-spin')} />
                                        <small className='m-1'>Save Order</small>
                                    </Button>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                            <CircleHelp  className='cursor-pointer float-right opacity-50'/>
                                            </TooltipTrigger>
                                            <TooltipContent className='flex items-center gap-x-2'>
                                                <Info size={16}/>
                                                <p>Enables draggable rows to set column position.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Table className='flex-1'>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>#</TableHead>
                                            <TableHead>Element</TableHead>
                                            <TableHead>Created By</TableHead>
                                            <TableHead>Max Score</TableHead>
                                            <TableHead className='text-right'>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                        <Droppable droppableId='droppable'>
                                        {(provided, snapshot) => (
                                            <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                                                {(elementState||[]).map((element,index) => {
                                                    element.position = (index + 1);
                                                    return (
                                                        <Draggable key={element.id} draggableId={element.id + ''} index={index} isDragDisabled={!editable}>
                                                            {(provided, snapshot) => ( <ElementItem  snapshot={snapshot} provided={provided} key={element.id} element={element} onEdit={handleMetricModal} onDelete={m=>setDeleteElementModal(m)} /> )}
                                                        </Draggable>
                                                    )
                                                })}
                                                {!(elementState?.length) && (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className='text-center text-2xl'>No Data Assigned.</TableCell>
                                                    </TableRow>   
                                                )}
                                            </TableBody>
                                        )}
                                        </Droppable>
                                </Table>
                            </DragDropContext>
                            </>
                        )}
                        {!project&&<div className='flex-1 flex items-center justify-center text-muted-foreground'>Select a project to view QA Elements</div>}
                    </div>                    
                </div>
            </Layout>
            {!!project&&<ElementModal project={project} isOpen={elementModal.isOpen} onClose={()=>setElementModal({isOpen:false,element:undefined})} element={elementModal.element} />}
            {!!deleteElementModal&&<DeleteElementModal isOpen={!!deleteElementModal} onClose={()=>setDeleteElementModal(undefined)} element={deleteElementModal} />}
        </>
    );
};

export default QMSSettings;