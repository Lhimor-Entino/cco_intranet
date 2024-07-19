import Layout from '@/Components/Layout/Layout';
import { Button } from '@/Components/ui/button';
import { Head, Link } from '@inertiajs/inertia-react';
import { ChevronRight, Ellipsis, EllipsisIcon, LockOpenIcon, SlashIcon } from 'lucide-react';
import {FC} from 'react';
import TraningInfoHeader from './TrainingInformationSystem/TraningInfoHeader';
import { TrainingAssessment, TrainingFolder, TrainingSubFolder, TrainingTopic } from '@/types/trainingInfo';
import MainFolderContainer from './TrainingInformationSystem/Admin/MainFolderContainer';
import SubFolderContainer from './TrainingInformationSystem/Admin/SubFolderContainer';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/Components/ui/breadcrumb';
import AssessmentEdit from './TrainingInformationSystem/Admin/AssessmentComponents/AssessmentEdit';
import { cn } from '../lib/utils';

interface Props {
    main_folders?: TrainingFolder[];
    sub_folders?: TrainingSubFolder[];
    main_folder?: TrainingFolder;
    current_folder?: TrainingSubFolder;
    assessment?:TrainingAssessment;
}

const TrainingInformationSystemAdmin:FC<Props> = ({main_folders,sub_folders,main_folder,current_folder,assessment}) => {
    
    return (
        <>
            <Head title="Training Info System Admin" />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container p-2.5'>
                    <TraningInfoHeader />
                    {((!!sub_folders||!!assessment)&&!!main_folder)&&(
                        <Breadcrumb >
                            <BreadcrumbList >
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href={route('training_info_system.admin')}>
                                            <span className='text-xs md:text-sm'>Home</span>
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href={route('training_info_system.admin',{id:main_folder.id})}>
                                            <span className='hidden md:inline'>{main_folder.name}</span>
                                            <EllipsisIcon className='md:hidden h-4 w-4' />
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                {!!current_folder?.parent&&<ParentBreadcrumb folder={current_folder.parent} main_folder={main_folder} />}
                                {!!current_folder&&(
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>
                                            <span className='text-xs md:text-sm'>{current_folder.name}</span>
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                )}
                                {!!assessment?.sub_folder&&<ParentBreadcrumb folder={assessment.sub_folder} main_folder={main_folder} />}
                                {!!assessment&&(
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>
                                            <span className='text-xs md:text-sm'>{assessment.title}</span>
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                )}
                            </BreadcrumbList>
                        </Breadcrumb>
                    )}
                    {!!main_folders&&<MainFolderContainer main_folders={main_folders} />}
                    {(!!sub_folders&&!!main_folder)&&<SubFolderContainer currentFolder={current_folder} mainFolder={main_folder} subFolders={sub_folders} />}
                    {(!!main_folder && !!assessment) && <AssessmentEdit assessment={assessment} main_folder={main_folder} />}
                </div>
            </Layout>
            
            
        </>
    );
};

export default TrainingInformationSystemAdmin;

interface ParentBreadcrumb {
    folder:TrainingSubFolder;
    main_folder:TrainingFolder;
    className?:string;
}
//recursive component 
const ParentBreadcrumb:FC<ParentBreadcrumb> = ({folder,main_folder,className}) => {    
    return (
        <>
            {!!folder.parent&&<ParentBreadcrumb className='hidden md:inline-flex' folder={folder.parent} main_folder={main_folder} />}
            <BreadcrumbItem className={className}>
                <EllipsisIcon className='md:hidden h-4 w-4' />
                <ChevronRight  className='size-2.5 md:size-3.5 md:hidden' />
                <BreadcrumbLink asChild>
                    <Link href={route('training_info_system.admin',{id:main_folder.id,sub_folder_id:folder.id})}>
                        <span className='text-xs md:text-sm'>{folder.name}</span>
                    </Link>
                </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator  className={cn('size-2.5 md:size-3.5',className)} />
        </>
    );
}