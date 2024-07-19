import { TrainingAssessmentQuestion } from '@/types/trainingInfo';
import {FC} from 'react';

interface Props {
    question:TrainingAssessmentQuestion;
}

const Essay:FC<Props> = () => {
    return (
        <div>
            Essay
        </div>
    );
};

export default Essay;