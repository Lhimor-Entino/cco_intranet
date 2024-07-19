import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { TrainingFolder } from '@/types/trainingInfo';
import { FolderPlusIcon, PlusCircle, XIcon } from 'lucide-react';
import {FC, useMemo, useState} from 'react';
import MainFolderItem from './MainFolderItem';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { usePage } from '@inertiajs/inertia-react';
import { Page } from '@inertiajs/inertia';
import { PageProps } from '@/types';
import NewMainFolderModal from './NewMainFolderModal';
import { FolderDeleteConfirmModal } from './FolderDeleteConfirmModal';
import EditMainFolderModal from './EditMainFolderModal';

interface Props {
    main_folders: TrainingFolder[];
}

export type SortState = 'name'|'user'|'date';
export const sortStates:SortState[] = [
    'name',
    'user',
    'date'
];

const MainFolderContainer:FC<Props> = ({main_folders}) => {
    
    const {projects} = usePage<Page<PageProps>>().props;
    const [showNewFolderModal,setShowNewFolderModal] = useState(false);
    const [nameFilter, setNameFilter] = useState('');
    const [sortBy, setSortBy] = useState<SortState>('name');
    const [projectFilter, setProjectFilter] = useState<number[]>([]);
    const [deleteFolder,setDeleteFolder] = useState<TrainingFolder|undefined>(undefined);
    const [editFolder,setEditFolder] = useState<TrainingFolder|undefined>(undefined);
    const folders = main_folders
        .filter(folder=>folder.name.toLowerCase().includes(nameFilter.toLowerCase()))
        .sort((a,b)=>{
            if(sortBy === 'name') return a.name.localeCompare(b.name);
            if(sortBy === 'user') return a.user.first_name.localeCompare(b.user.first_name);
            if(sortBy === 'date') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            return 0;      
        })
        .filter(folder=>projectFilter.length===0||projectFilter.some(id=>folder.projects.map(p=>p.id).includes(id)));
    const toggleProjectFilter = (id:number) => setProjectFilter(projectFilter.includes(id)?projectFilter.filter(p=>p!==id):[...projectFilter,id]);

    const projectFilterLabel = useMemo(()=>{
        if(projectFilter.length===0) return 'Filter by Projects';
        if(projectFilter.length===1) return projects.find(p=>p.id===projectFilter[0])?.name;
        if(projectFilter.length===2) return `${projects.find(p=>p.id===projectFilter[0])?.name} and ${projects.find(p=>p.id===projectFilter[1])?.name}`;
        return `${projects.find(p=>p.id===projectFilter[0])?.name} and ${projectFilter.length-1} more`;
    },[projectFilter]);

    const allFolderNames = main_folders.map(folder=>folder.name);


    return (
        <>
            <NewMainFolderModal folderNames={allFolderNames} isOpen={showNewFolderModal} onClose={()=>setShowNewFolderModal(false)} />
            {!!deleteFolder&&<FolderDeleteConfirmModal   folder={deleteFolder} isOpen={!!deleteFolder} onClose={()=>setDeleteFolder(undefined)} />}
            {!!editFolder&&<EditMainFolderModal folder={editFolder} folderNames={allFolderNames} isOpen={!!editFolder} onClose={()=>setEditFolder(undefined)} />}
            <div className='flex-1 flex flex-col gap-y-2.5 overflow-y-auto relative'>
                <div className='flex flex-col gap-y-1.5 md:gap-y-0 md:flex-row md:gap-x-3.5 h-auto md:items-center sticky top-0 bg-background z-50'>
                    <Button onClick={()=>setShowNewFolderModal(true)} variant='secondary'>
                        <FolderPlusIcon className='h-6 w-6 mr-2' />
                        New Folder
                    </Button>
                    <Select value={sortBy} onValueChange={(state)=>setSortBy(state as SortState)}>
                        <SelectTrigger className="md:w-32 w-auto !ring-0 !ring-offset-0">
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
                        <Input value={nameFilter} onChange={e=>setNameFilter(e.target.value)} className='!ring-0 !ring-offset-0 rounded-r-none' placeholder="Filter by Folder Name" />
                        <Button disabled={!nameFilter} onClick={()=>setNameFilter('')} variant='outline' className='rounded-l-none border-l-0'>
                            <XIcon className='h-6 w-6' />
                        </Button>                    
                    </div>
                    <div className='flex flex-row items-center'>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button className='rounded-r-none w-full md:w-56' variant="outline">{projectFilterLabel}</Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto'>
                                <div className='grid grid-cols-5 gap-2 overflow-y-auto max-h-[25rem]'>
                                    {projects.map(project=><Button size='sm' key={project.id} onClick={()=>toggleProjectFilter(project.id)} variant={projectFilter.includes(project.id)?'default':'secondary'}>{project.name}</Button>)}
                                </div>
                            </PopoverContent>
                        </Popover>
                        <Button disabled={projectFilter.length===0} onClick={()=>setProjectFilter([])} variant='outline' className='rounded-l-none border-l-0'>
                            <XIcon className='h-6 w-6' />
                        </Button>   
                    </div>
                </div>
                <div className='flex-1 bg-secondary rounded'>
                    <div className='overflow-y-auto  grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-9 gap-3.5 p-3.5'>
                        {folders.map(folder=> <MainFolderItem onDelete={f=>setDeleteFolder(f)} onEdit={f=>setEditFolder(f)} key={folder.id} folder={folder}  />)}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MainFolderContainer;

