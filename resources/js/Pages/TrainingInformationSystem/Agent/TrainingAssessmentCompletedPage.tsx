import Layout from '@/Components/Layout/Layout';
import { Head } from '@inertiajs/inertia-react';
import { BookOpenCheckIcon } from 'lucide-react';
import {FC} from 'react';

interface Props {
    assessment_title:string;
}

const TrainingAssessmentCompletedPage:FC<Props> = ({assessment_title}) => {
    return (
        <>
            <Head title={assessment_title} />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container pb-2.5 items-center justify-center'>
                    <BookOpenCheckIcon className='h-20 w-20 ' />
                    <h3 className='text-2xl font-semibold text-center'>{assessment_title}</h3>
                    <p className='text-center text-muted-foreground'>
                        You have successfully completed the assessment - You can now close this page
                    </p>
                </div>
            </Layout>
        </>
    );
};

export default TrainingAssessmentCompletedPage;