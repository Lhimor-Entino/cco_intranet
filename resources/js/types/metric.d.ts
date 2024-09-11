

import { Project, Setting, TimeStamp, User } from ".";

export type MetricFormat ='number'|'percentage'|'duration'|'rate'

export interface IndividualPerformanceMetric extends TimeStamp {
    id:number;
    project_id:number;
    user_id:number;
    metric_name:string;
    goal:number;
    daily_goal:string;
    format:MetricFormat;
    unit?: 'seconds'|'minutes'|'hours'|string;
    rate_unit?:string;
    user:User;
    project:Project;
    user_metrics:IndividualPerformanceUserMetric[];
    position:number;
    setting: Setting;
}


export interface IndividualPerformanceUserMetric extends TimeStamp {
    id:number;
    individual_performance_metric_id:number;
    user_id:number;
    value:number;
    date:string;
    is_applicable:number;

    metric:IndividualPerformanceMetric;
    user:User;
}


export type TeamTrend = {
    individual_performance_metric_id:number;
    metric_name:string;
    goal:number;
    trends:{
        date:string;
        total:number;
        average:number;
    }[]
}


export type BreakDown = {
    individual_performance_metric_id:number,
    Metric:string,
    team_id:number,
    Days:number,
    Total:number,
    Average:number,
    Goal:number,
    Unit:string

};


export type TopFivePerformer = {
    company_id:string;
    first_name:string;
    last_name:string;
    average:number;
    total_score:number;
}


export type TopPerformer = {
    metric_name:string;
    metric_id:number;
    goal:number;
    setting:string;
    top_five_performers:TopFivePerformer[];
}