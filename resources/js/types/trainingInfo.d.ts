import { YooptaContentValue } from "@yoopta/editor";
import { Project, TimeStamp, User } from ".";

export interface TrainingTopic extends TimeStamp {
    id: number;
    user_id: number;
    title: string;
    description?:string;
    is_active: 1|0;
    version_names:string[];
    training_sub_folder_id:number;
    sub_folder:TrainingSubFolder;

    user:User;
    versions:TrainingTopicVersion[];
    current_version?:TrainingTopicVersion;
}

export interface TrainingTopicVersion extends TimeStamp {
    id: number;
    training_topic_id: number;
    user_id: number;
    content?:string;
    version?:string;
    is_active: 1|0;

    user:User;
    training_topic:TrainingTopic;
}

export interface TrainingFolder extends TimeStamp {
    id:number;
    user_id:number;
    name:string;
    user:User;
    projects:Project[];
    sub_folders:TrainingSubFolder[];
    sub_folder_count:number;
}

export interface TrainingSubFolder extends TimeStamp {
    id:number;
    training_folder_id?:number; //relation to the model above
    training_sub_folder_id?:number; //relation to self for recursive sub folders
    user_id:number;
    name:string;

    user:User;
    children:TrainingSubFolder[];
    parent?:TrainingSubFolder;
    topics:TrainingTopic[];
    assessments:TrainingAssessment[];
    topic_titles:string[];
    assessment_titles:string[];
}

export interface TrainingAssessment extends TimeStamp {
    id:number;
    user_id:number;
    training_sub_folder_id:number;
    title:string;
    max_score:number;
    pass_score:number;
    user:User;
    sub_folder:TrainingSubFolder;
    questions?:TrainingAssessmentQuestion[];
    links?:TrainingAssessmentLink[];
    total_points:number;
}

export interface TrainingAssessmentQuestion extends TimeStamp {
    id:number;
    training_assessment_id:number;
    question:string;
    points:number;
    answer:string;
    question_type:1|2|3|4|5;
    /*
    1- Multiple Choice
    2- Multiple Answers
    3- Type the Answer
    4- Enumeration
    5- Essay
    More will be probably added in the future..
    */
    question_type_description:{
        type:1|2|3|4|5;
        description:string;
    };
    choices?:TrainingAssessmentQuestionChoice[]; //can be undefined if question is Essay,Type the Answer, or Enumeration
    enum_items?:TrainingAssessmentEnumItem[]; //can be undefined if question is not Enumeration
    formatted_answer:string;
    enum_item_count:number;
}

export interface TrainingAssessmentQuestionChoice extends TimeStamp {
    id:number;
    training_assessment_question_id:number;
    choice:string;
}

export interface TrainingAssessmentEnumItem extends TimeStamp {
    id:number;
    training_assessment_question_id:number;
    item:string;
}

export interface TrainingAssessmentLink extends TimeStamp {
    id:number;
    user_id:number;
    training_assessment_id:number;
    uuid:string;
    valid_until:string
    status:string;
    link:string;
    user:User;
}

export interface TrainingAssessmentResult extends TimeStamp {
    id:number;
    training_assessment_id?:number;
    user_id:number;
    checked_by_id?:number;
    max_score:number;
    user_score:number;
    passing_score:number;
    date_checked?:string;
    user:User;
    checked_by:User;
    assessment?:TrainingAssessment;
    answers:TrainingAssessmentResultAnswer[];
}

export interface TrainingAssessmentResultAnswer extends TimeStamp {
    id:number;
    training_assessment_result_id:number;
    question:string;
    correct_answer:string;
    user_answer:string;
    score:number;
    points:number;
    needs_manual_check:0|1;    
    question_type:1|2|3|4|5;
}