import { Project, TimeStamp, User } from ".";

export interface QAElement extends TimeStamp{
    id:number;
    project_id: number;
    user_id:number;
    qa_element:string;
    goal:number;
    position:number;
    user: User;
    project:Project;

}

export interface QAElementScore extends TimeStamp{
    id:number;
    qa_element_id:number;
    user_id:number;
    score:number;
    is_applicable:number;
    date:string;
    qa_element: QAElement;
    user:User;
}

export interface QAGroup extends TimeStamp{
    id:number;
    name:string;
    user_id: number;
    user: User;
    users: User[];
    elements:QAElement[];
}
export interface QAGroupHistory extends TimeStamp {
    id: number;
    user_id: number;
    qa_group_id:number;
    start_date:Date;
    qa_group: QAGroup;
}
// export interface Setting{
//     id:number;
//     individual_performance_metric_id:number;
//     name:string;
//     value:string;
//     tag:string;
// }