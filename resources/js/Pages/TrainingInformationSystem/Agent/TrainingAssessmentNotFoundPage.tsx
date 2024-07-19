import Layout from '@/Components/Layout/Layout';
import { Head } from '@inertiajs/inertia-react';
import { ServerCrashIcon } from 'lucide-react';
import {FC} from 'react';

interface Props {
    
}

const TrainingAssessmentNotFoundPage:FC<Props> = () => {
    return (
        <>
            <Head title={'Not Found'} />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container pb-2.5 items-center justify-center'>
                    <ServerCrashIcon className='h-20 w-20 ' />
                    <h3 className='text-2xl font-semibold text-center'>Assessment Not Found</h3>
                    <p className='text-center text-muted-foreground'>The assessment you are looking for does not exist or has expired</p>
                    <p className='text-center text-muted-foreground'>Please contact your administrator for more information</p>
                </div>
            </Layout>
        </>
    );
};

export default TrainingAssessmentNotFoundPage;