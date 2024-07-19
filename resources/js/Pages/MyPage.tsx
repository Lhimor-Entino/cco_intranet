import Header from '@/Components/Header';
import Layout from '@/Components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { PageProps } from '@/types';
import { Page } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import { Clock2, MessageCircleMore, UserMinus } from 'lucide-react';
import {FC} from 'react';

interface Props {
    
}

const MyPage:FC<Props> = () => {
    
    const {user} = usePage<Page<PageProps>>().props.auth;
    return (
        <>
            <Head title="My Page" />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container pb-2.5'>
                    <Header hidePicture title='My Page' />
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8'>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">My Leave Credits</CardTitle>
                                <UserMinus className="h-6 w-6 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">0</div>
                                {/* <p className="text-xs text-muted-foreground">+180.1% from last month</p> */}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">My Tardy Minutes</CardTitle>
                                <Clock2 className="h-6 w-6 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">00:00:00</div>
                                <p className="text-xs text-muted-foreground">Total Tardy Minutes past 7 work days</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Leave Requests</CardTitle>
                                <MessageCircleMore className="h-6 w-6 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">0</div>
                                <p className="text-xs text-muted-foreground">Days</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Hours (Current Cut-Off)</CardTitle>
                                <MessageCircleMore className="h-6 w-6 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">00:00:00</div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className='flex flex-col '>
                        <div>
                            <h3 className='text-2xl font-semibold text-muted-foreground'>
                                Agent Info:
                            </h3>
                            <p>
                                <span className='font-semibold'>Name:</span> {user.first_name} {user.last_name}
                            </p>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default MyPage;