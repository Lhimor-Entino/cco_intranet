import { Button } from '@/Components/ui/button';
import { TrainingAssessment, TrainingFolder, TrainingSubFolder, TrainingTopic } from '@/types/trainingInfo';
import { SortingState } from '@tanstack/react-table';
import { BookPlus, FilePlus2, FolderPlusIcon, Loader2, SlashIcon, XIcon } from 'lucide-react';
import {FC, useEffect, useMemo, useState} from 'react';
import { SortState, sortStates } from './MainFolderContainer';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Input } from '@/Components/ui/input';
import SubFolderItem from './SubFolderItem';
import NewSubFolderModal from './NewSubFolderModal';
import EditSubFolderModal from './EditSubFolderModal';
import SubFolderDeleteConfirmModal from './SubFolderDeleteConfirmModal';
import { useForm } from '@inertiajs/inertia-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/Components/ui/alert-dialog';
import AssessmentItem from './AssessmentComponents/AssessmentItem';
import AssessmentDeleteConfirmModal from './AssessmentComponents/AssessmentDeleteConfirmModal';
import { Inertia } from '@inertiajs/inertia';
import AssessmentShareModal from './AssessmentComponents/AssessmentShareModal';
import AssessmentLinksSheet from './AssessmentComponents/AssessmentLinksSheet';


interface Props {
    subFolders:TrainingSubFolder[];
    mainFolder:TrainingFolder;
    currentFolder?:TrainingSubFolder;
}

const SubFolderContainer:FC<Props> = ({subFolders,mainFolder,currentFolder}) => {
    const {data,setData,processing,post} = useForm<{training_sub_folder_id:number|undefined}>({training_sub_folder_id:undefined});
    const [nameFilter, setNameFilter] = useState('');
    const [sortBy, setSortBy] = useState<SortState>('name');
    const [showNewFolderModal,setShowNewFolderModal] = useState(false);
    const [showEditFolderModal,setShowEditFolderModal] = useState<TrainingSubFolder|undefined>(undefined);
    const [showDeleteFolderModal,setShowDeleteFolderModal] = useState<TrainingSubFolder|undefined>(undefined);
    const [showDeleteTopicModal,setShowDeleteTopicModal] = useState<TrainingTopic|undefined>(undefined);
    const [deleteAssessment,setDeleteAssessment] = useState<TrainingAssessment|undefined>();
    const [shareAssessment,setShareAssessment] = useState<TrainingAssessment|undefined>();
    const [showAssessmentLinks,setShowAssessmentLinks] = useState<TrainingAssessment|undefined>();
    const [creating,setCreating] = useState<'topic'|'assessment'|undefined>();
    

    useEffect(()=>setData('training_sub_folder_id',currentFolder?.id),[currentFolder]);
    const TopicIcon = (processing&&creating==='topic')?Loader2:FilePlus2;
    const AssessmentIcon = (processing&&creating==='assessment')?Loader2:BookPlus;

    const folders = subFolders
        .filter(folder=>folder.name.toLowerCase().includes(nameFilter.toLowerCase()))
        .sort((a,b)=>{
            if(sortBy === 'name') return a.name.localeCompare(b.name);
            if(sortBy === 'user') return a.user.first_name.localeCompare(b.user.first_name);
            if(sortBy === 'date') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            return 0;      
        });
    
    const filteredTopics = !currentFolder?[]: currentFolder.topics
        .filter(t=>t.title.toLowerCase().includes(nameFilter.toLowerCase()))
        .sort((a,b)=>{
            if(sortBy === 'name') return a.title.localeCompare(b.title);
            if(sortBy === 'user') return a.user.first_name.localeCompare(b.user.first_name);
            if(sortBy === 'date') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            return 0;      
        }
    );

    const filteredAssessments = !currentFolder?[]: currentFolder.assessments
        .filter(t=>t.title.toLowerCase().includes(nameFilter.toLowerCase()))
        .sort((a,b)=>{
            if(sortBy === 'name') return a.title.localeCompare(b.title);
            if(sortBy === 'user') return a.user.first_name.localeCompare(b.user.first_name);
            if(sortBy === 'date') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            return 0;      
        }
    );

    const handleCreateTopic = () =>{
        if(!data.training_sub_folder_id) return toast.error('Internal Error. Please refresh the page and try again');
        post(route('training_info_system.store'),{
            onStart:()=>setCreating('topic'),
            onSuccess:()=>toast.success('Topic created successfully.'),
            onError:()=>toast.error('An error occurred. Please try again.'),
            onFinish:()=>setCreating(undefined)
        });
    
    }

    const handleCreateAssessment = () =>{
        if(!data.training_sub_folder_id) return toast.error('Internal Error. Please refresh the page and try again');
        post(route('assessment.store'),{
            onStart:()=>setCreating('assessment'),
            onSuccess:()=>toast.success('Assessment created successfully.'),
            onError:()=>toast.error('An error occurred. Please try again.'),
            onFinish:()=>setCreating(undefined)
        });
    };
    
    return (
        <>
            <NewSubFolderModal mainFolder={mainFolder} currentFolder={currentFolder} isOpen={showNewFolderModal} onClose={()=>setShowNewFolderModal(false)} folderNames={subFolders.map(f=>f.name)} />
            {showEditFolderModal && <EditSubFolderModal folder={showEditFolderModal} isOpen={!!showEditFolderModal} onClose={()=>setShowEditFolderModal(undefined)} folderNames={subFolders.map(f=>f.name)} />}            
            {!!showDeleteFolderModal&&<SubFolderDeleteConfirmModal folder={showDeleteFolderModal} isOpen={!!showDeleteFolderModal} onClose={()=>setShowDeleteFolderModal(undefined)} />}
            {!!showDeleteTopicModal&&<TopicDeleteModal topic={showDeleteTopicModal} isOpen={!!showDeleteTopicModal} onClose={()=>setShowDeleteTopicModal(undefined)} />}
            <div className='flex-1 flex flex-col gap-y-2.5 overflow-y-auto relative'>
                <div className='flex flex-col gap-y-1.5 md:gap-y-0 md:flex-row md:gap-x-3.5 h-auto md:items-center sticky top-0 bg-background z-50'>
                    <Button onClick={()=>setShowNewFolderModal(true)} variant='secondary'>
                        <FolderPlusIcon className='h-6 w-6 mr-2' />
                        New Folder
                    </Button>
                    {!!currentFolder&&(
                        <>
                            <Button disabled={processing} onClick={handleCreateTopic}>
                                <TopicIcon className={cn('h-6 w-6 mr-2',(processing&&creating==='topic')&&'animate-spin')} />
                                New Topic
                            </Button>
                            <Button disabled={processing} variant='outline' onClick={handleCreateAssessment}>
                                <AssessmentIcon className={cn('h-6 w-6 mr-2',(processing&&creating==='assessment')&&'animate-spin')} />
                                New Assessment
                            </Button>
                        </>
                    )}
                    <Select value={sortBy} onValueChange={(state)=>setSortBy(state as SortState)}>
                        <SelectTrigger disabled={processing} className="md:w-32 w-auto !ring-0 !ring-offset-0">
                            <SelectValue placeholder="Sort By:" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Sort By:</SelectLabel>
                                {sortStates.map(state=><SelectItem value={state} key={state} > <span className='capitalize'>{`${ state==='user'?'Created By':state==='date'?'Create Date':'Name'}`}</span></SelectItem>)}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <div className='flex flex-row items-center'>
                        <Input disabled={processing} value={nameFilter} onChange={e=>setNameFilter(e.target.value)} className='!ring-0 !ring-offset-0 rounded-r-none' placeholder="Filter by Folder/Topic Name" />
                        <Button disabled={!nameFilter} onClick={()=>setNameFilter('')} variant='outline' className='rounded-l-none border-l-0'>
                            <XIcon className='h-6 w-6' />
                        </Button>                    
                    </div>
                </div>
                <div className='flex-1 bg-secondary/20 rounded'>
                    <div className='overflow-y-auto  grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-9 gap-3.5 p-3.5'>
                        {folders.map(folder=> <SubFolderItem mainFolder={mainFolder} onFolderDelete={f=>setShowDeleteFolderModal(f)} onFolderEdit={f=>setShowEditFolderModal(f)} onTopicDelete={t=>{}} key={folder.id} folder={folder}  />)}
                        {(filteredTopics||[]).map(topic=> <SubFolderItem mainFolder={mainFolder} onFolderDelete={f=>{}} onFolderEdit={f=>{}} onTopicDelete={t=>setShowDeleteTopicModal(t)}  key={topic.id} topic={topic}  />)}
                        {(filteredAssessments||[]).map(assessment=> <AssessmentItem onOpenLinks={()=>setShowAssessmentLinks(assessment)} onShare={()=>setShareAssessment(assessment)} onArchive={()=>setDeleteAssessment(assessment)} mainFolder={mainFolder} onEdit={()=>Inertia.get(route('assessment.edit',{main_folder_id:mainFolder.id,id:assessment.id}))} key={assessment.id} data={assessment}  />)}
                    </div>
                </div>
            </div>
            {deleteAssessment&&<AssessmentDeleteConfirmModal isOpen={!!deleteAssessment} data={deleteAssessment} onClose={()=>setDeleteAssessment(undefined)} />}
            {shareAssessment&&<AssessmentShareModal isOpen={!!shareAssessment} assessment={shareAssessment} onClose={()=>setShareAssessment(undefined)} />}
            {showAssessmentLinks&&<AssessmentLinksSheet isOpen={!!showAssessmentLinks} assessment={showAssessmentLinks} onClose={()=>setShowAssessmentLinks(undefined)} />}
        </>
    );
};

export default SubFolderContainer;

interface TopicDeleteModalProps{
    isOpen:boolean;
    onClose:()=>void;
    topic:TrainingTopic;
}

const TopicDeleteModal:FC<TopicDeleteModalProps> = ({isOpen,onClose,topic}) =>{
    const {processing,post} = useForm();
    const onDelete = () =>{
        if(!topic.id) return toast.error('Internal Error. Please refresh the page and try again.');
        const href = route('training_info_system.destroy',{id:topic.id});
        post(href,{
            onSuccess:()=>{
                toast.success('Topic deleted successfully.');
                onClose();
            },
            onError:()=>toast.error('An error occurred. Please try again.')
        });
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete topic {topic.title}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will delete this topic and of its versions.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
                    <Button onClick={onDelete} disabled={processing}>
                        {processing && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
                        Continue
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}