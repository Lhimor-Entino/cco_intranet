import { Project, User } from ".";

export interface QAElement{
    id:number;
    project_id: number;
    user_id:number;
    qa_element:string;
    goal:number;
    position:number;
    user: User;
    project:Project;

}

export interface QAElementScore{
    id:number;
    qa_element_id:number;
    user_id:number;
    score:number;
    is_applicable:number;
    date:string;

    qa_element: QAElement;
    user:User;
}

// export interface Setting{
//     id:number;
//     individual_performance_metric_id:number;
//     name:string;
//     value:string;
//     tag:string;
// }