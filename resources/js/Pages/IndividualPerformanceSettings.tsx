import Header from '@/Components/Header';
import Layout from '@/Components/Layout/Layout';
import { Head, usePage } from '@inertiajs/inertia-react';
import {FC, useState} from 'react';
import IPDDropdown from './IndividualPerformance/IPDDropdown';
import { PageProps, Project } from '@/types';
import { Inertia, Page } from '@inertiajs/inertia';
import ProjectSelectionComboBox from './IndividualPerformance/ProjectSelectionComboBox';
import { IndividualPerformanceMetric } from '@/types/metric';
import { Button } from '@/Components/ui/button';
import { PackagePlusIcon, Pencil, PencilIcon, Trash2Icon } from 'lucide-react';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import MetricModal from './IndividualPerformance/Settings/MetricModal';
import MetricItem from './IndividualPerformance/Settings/MetricItem';
import DeleteMetricModal from './IndividualPerformance/Settings/DeleteMetricModal';

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
                        {!!project&&(
                            <Table className='flex-1'>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Metric Name</TableHead>
                                        <TableHead>Created By</TableHead>
                                        <TableHead>Format</TableHead>
                                        <TableHead>Unit</TableHead>
                                        <TableHead>Daily Goal</TableHead>
                                        <TableHead className='text-right'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(metrics||[]).map(metric=> <MetricItem key={metric.id} metric={metric} onEdit={handleMetricModal} onDelete={m=>setDeleteMetricModal(m)} />)}
                                </TableBody>
                            </Table>
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