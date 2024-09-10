import { PaginationLink } from '@/Components/ui/pagination';

import ziggy from 'ziggy-js'
import { IndividualPerformanceMetric, IndividualPerformanceUserMetric, MetricFormat } from './metric';

export interface User {
    id: number;
    first_name: string;
    company_id:string;
    last_name: string;
    middle_name: string;
    position: string;
    email?:string;
    photo?:string;
    department:string;
    //project:string;
    site:string;
    schedule:string;
    date_hired:string;
    date_resigned:string|null;    
    shift_id:number|null;
    shift:Shift|null;
    date_of_birth:string;
    project_id:number|null;
    project:Project|null;
    user_skills:UserSkill[];
    attendances:UserAttendance[];
    violations:UserViolation[];
    is_archived:1|0;
    user_id:number|null;
    supervisor:User|null;
    has_settings_access:boolean;
    team_id?:number;
    team?:Team;
    team_join_date?:string;
    user_metrics:IndividualPerformanceUserMetric[];
}

export interface TimeStamp{
    created_at:string;
    updated_at:string;
}
interface Announcement extends TimeStamp{
    id: number;
    user_id: number;
    edited_by_id?:number;
    title:string;
    content:string;
    image?:string;
    status:number;
    status_str:'active'|'inactive';
    user:User;
    edit
    edited_by?:User;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    shifts:Shift[];
    projects:Project[];
    teams:Team[];
    flash:{
        newLink?:string;
    }
    metric_formats:MetricFormat[];
};


export declare global {
    function route(routeName?: string, parameters?: any[] | any, absolute? = true): Function[string]

}



export interface Pagination{
    current_page:number;
    first_page_url:string;
    from:number;
    last_page:number;
    last_page_url:string;
    next_page_url:string;
    path:string;
    per_page:number;
    prev_page_url:string|null;
    to:number;
    total:number
    links:PaginationLink[]
}

export interface PaginationLink  {
    url: string;
    label: string;
    active: boolean;
}

export interface Shift  {
    id: number;
    start_time: string;
    end_time: string;
    schedule: string;
    is_swing: 1|0;
}

export interface UserAttendance {    
    id: number;
    date:string;
    time_in?:string;
    time_out?:string;
    is_tardy:string;
    shift_id?:string;
    shift?:Shift;
    edited_time_in:1|0;
    edited_time_out:1|0;
    edited_time_in_by_id?:number;
    edited_time_out_by_id?:number;
    edited_time_in_by?:User;
    edited_time_out_by?:User;
    edited_time_in_date?:string;
    edited_time_out_date?:string;
}

export interface Project extends TimeStamp{
    id: number;
    name: string;
    metrics:IndividualPerformanceMetric[];
}

export interface ProjectHistory {
    id: number;
    project_id: number;
    user_id: number;
    start_date: string;
    project: Project;
    user: User;
}

export interface TeamHistory {
    id: number;
    team_id?: number;
    user_id: number;
    start_date: string;
    team?: Team;
    user: User;
}

export interface UserSkill extends TimeStamp{
    id: number;
    user_id: number;
    skill: string;
}


export interface UserViolation extends TimeStamp{
    id: number;
    user_id: number;
    violation: string;
    description?:string;
    date:string;
    images:UserViolationImage[];
    user:User;
}

export interface UserViolationImage {
    id: number;
    user_violation_id: number;
    image: string;
}


export interface Pagination{
    current_page:number;
    first_page_url:string;
    from:number;
    last_page:number;
    last_page_url:string;
    next_page_url:string;
    path:string;
    per_page:number;
    prev_page_url:string|null;
    to:number;
    total:number
    links:{
        url:string|null;
        label:string;
        active:boolean;
    }[]
}

export interface Team{
    id:number;
    name:string;
    user_id:number;
    user:User;
    users:User[];    
}

export interface Setting{
    id:number;
    individual_performance_metric_id:number;
    name:string;
    value:string;
    tag:string;
}