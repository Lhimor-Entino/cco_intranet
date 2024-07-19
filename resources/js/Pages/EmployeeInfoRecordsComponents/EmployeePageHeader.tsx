import { Button } from "@/Components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { useSyncModal } from "@/Hooks/useSyncModal";
import { PageProps, User } from "@/types";
import { Page } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import { CircleFadingPlusIcon, FolderSyncIcon, SearchIcon, XIcon } from "lucide-react";
import { ChangeEvent, FC, ReactNode, useState } from "react";

type Filters ={
    position?:string;
    project_id?:string;
    site?:string;
    shift?:string;
}

interface Props {
    onInputChange:(e:ChangeEvent<HTMLInputElement>)=>void;
    onFilter:(filter:Filters)=>void;
    strFilter:string;
    positions:string[];
    filters:Filters
}

const EmployeePageHeader:FC<Props> = ({onInputChange,strFilter,positions,filters,onFilter}) => {
    
    const {shifts} = usePage<Page<PageProps>>().props;
    const hasSetFilters = Object.keys(filters).length > 0;    
    const {onOpen:openSyncModal} = useSyncModal();
    const {projects} = usePage<Page<PageProps>>().props;
    return (
        <div className="flex items-center gap-x-2">
            <div className="relative">
                <SearchIcon className="absolute top-1/2 left-2 transform -translate-y-1/2 text-primary" />
                <Input value={strFilter} onChange={onInputChange} placeholder="Filter by Company ID/Last Name" className="pl-8 w-72 h-9" />
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button size='sm' variant='outline'>
                        <CircleFadingPlusIcon className="h-5 w-5 mr-2" />
                        Set Filters     
                    </Button>
                </DialogTrigger>                
                <DialogContent >
                    <DialogHeader>
                        <DialogTitle>Set Filters</DialogTitle>
                        <DialogDescription>
                            Filter the data based on the following criteria
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-y-3.5">
                        <div className="space-y-1">
                            <Label>Position</Label>
                            <Select onValueChange={e=>onFilter({...filters,position:e})} value={filters.position}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a position" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    <SelectLabel>Position</SelectLabel>
                                        {
                                            positions.map((position) =><SelectItem key={position} value={position}>{position}</SelectItem>)
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label>Project</Label>
                            <Select onValueChange={e=>onFilter({...filters,project_id:e})} value={filters.project_id}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a project" />
                                </SelectTrigger>
                                <SelectContent className="max-h-72">
                                    <SelectGroup>
                                    <SelectLabel>Project</SelectLabel>
                                        <SelectItem value="no_project">No Project</SelectItem>
                                        {
                                            projects.map((project) =><SelectItem key={project.id} value={project.id.toString()}>{project.name}</SelectItem>)
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label>Site</Label>
                            <Select onValueChange={e=>onFilter({...filters,site:e})} value={filters.site}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a Site" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Site</SelectLabel>
                                        <SelectItem value={'Manila'}>Manila</SelectItem>
                                        <SelectItem value={'Leyte'}>Leyte</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label>Shift Schedule</Label>
                            <Select onValueChange={e=>onFilter({...filters,shift:e})} value={filters.shift}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a Shift" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Shift Schedule</SelectLabel>
                                        <SelectItem value="0">No Schedule</SelectItem>
                                        {
                                            shifts.map((shift) =><SelectItem key={shift.id} value={shift.id.toString()}>{shift.schedule}</SelectItem>)
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant='secondary' size='sm'>                                
                                Close
                            </Button>             
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {
                hasSetFilters && (
                    <Button size='sm' variant='secondary' onClick={()=>onFilter({})}>
                        <XIcon className="h-5 w-5 mr-2" />
                        Clear Filters
                    </Button>
                )
            }
            <Button onClick={openSyncModal} className="ml-auto" size='sm' variant='secondary'>
                <FolderSyncIcon className="h-5 w-5 mr-2" />
                Sync
            </Button>
        </div>
    )
}

export default EmployeePageHeader;


