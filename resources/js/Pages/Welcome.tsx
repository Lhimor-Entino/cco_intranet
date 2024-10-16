

import AnnouncementCard from '@/Components/AnnouncementCard';
import AnnouncementPagination from '@/Components/AnnouncementPagination';
import Header from '@/Components/Header';
import Layout from '@/Components/Layout/Layout';
import Navbar from '@/Components/Navbar';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/Components/ui/pagination';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Announcement, Pagination as PaginationInterface } from '@/types';
import { Head } from '@inertiajs/inertia-react';
import { ActivityIcon, GaugeIcon, GlobeIcon, InfoIcon, LucideIcon } from 'lucide-react';
import {FC, useMemo} from 'react';


interface PaginatedAnnouncements extends PaginationInterface{
    data:Announcement[];
}

interface Props{
    announcements:PaginatedAnnouncements;
}
const Welcome:FC<Props> = ({announcements}) => {
    //console.log(announcements);
    const {prev_page_url,next_page_url,links,current_page,data} = announcements;

    const linkItems = useMemo(()=>{
        if(links.length<4) return [];
        if(links.length===4) return [links[1]];
        return links.filter(link=>parseInt(link.label)<current_page+2 && parseInt(link.label)>current_page-2);
    },[links,current_page]);

    

    return (
        <>
            <Head title="Welcome" />
            <Layout>
                <div className='h-full flex flex-col gap-y-3.5 px-[1.75rem] container pb-2.5'>
                    {/* <Header /> */}
                    
                    <ScrollArea className='flex-1 border rounded-lg p-6'>
                        <div className='flex flex-col gap-y-12'>
                            {
                                !data||data.length<1&&(
                                    //NO ANNOUNCEMENTS
                                    <div className='flex-1 flex items-center justify-center'>
                                        <p className='text-lg text-center'>No announcements found</p>
                                    </div>
                                )
                            }
                            {
                                data.map((announcement,index)=><AnnouncementCard key={announcement.id} announcement={announcement} even={index%2===0} />)
                            }
                        </div>
                    </ScrollArea>
                    
                    <AnnouncementPagination prev_page_url={prev_page_url} data={data} linkItems={linkItems} next_page_url={next_page_url} />
                </div>
            </Layout>
        </>
    )
}

export default Welcome;


export type NavLink = {
    id:number;
    Icon:LucideIcon;
    label:string;
    items: {
        name:string;
        href:string;
        quick?:boolean;
        accessible:boolean
    }[];
}


export const NavItems = (isAdmin = false, isTeamLead = false): NavLink[]  => [
    {
        id: 1,
        Icon: GaugeIcon,
        label: 'CCO Performance Management',
        items:[
            {
                name: "Project Knowledge Base",
                href: "#",
                quick:true,
                accessible: true,
            },
            {
                name: "Performance Dashboard",
                href: (isAdmin || isTeamLead) ?  route('individual_performance_dashboard.team') : route('individual_performance_dashboard.index') ,
                quick:true,
                accessible: true,
            },
            {
                name: "Client and Internal Escalation Records",
                href: "#",
                accessible: true,
            },
            {
                name: "Attendance Management System",
                href: route('attendance.index'),
                quick:true,
                accessible: true,
            },
            {
                name: "Leave planner",
                href: route('hrms.leave_planner'),
                quick:true,
                accessible: true,
            },
            {
                name: "Quality Management System",
                href: route('quality_management_system.index'),
                quick:true,
                accessible: true,
            },
            {
                name: "Reliability Management System",
                href: "#",
                accessible: true,
            },
            {
                name: "Connect: Coaching Tool",
                href: "#",
                accessible: true,
            },
            {
                name: "Key Performance Indicators Records per Project and Trending Report",
                href: "#",
                accessible: true,
            }
        ]
    },
    {
        id: 2,
        Icon: InfoIcon,
        label: 'CCO Information System',
        items:[
            {
                name: "Training Information System",
                href: route('training_info_system.index'),
                quick:true,
                accessible: true,
            },
            {
                name: "CCO Manhour/Billing Report",
                href: "#",
                accessible: true,
            },
            {
                name: "CCO Code of Descipline",
                href: "#",
                accessible: true,
            },
            {
                name: "Employee Information Records",
                href: route('employee.index'),
                quick:true,
                accessible: true,
            },
            {
                name: "Incentive Reports",
                href: "#",
                accessible: true,
            },
            {
                name: "Memorandum/Code of Descipline Infractions record",
                href: "#",
                accessible: true,
            },
            {
                name: "Coaching logs/Performance Evaluations",
                href: "#",
                accessible: true,
            },
            {
                name: "CCO Attrition Report",
                href: "#",
                accessible: true,
            },
            {
                name: "Shrink Tracker (VLs, SLs, OOO)",
                href: "#",
                accessible: true,
            }
        ]
    },
    {
        id: 3,
        Icon: ActivityIcon,
        label: 'CCO Site Monitoring',
        items: [
            {
                name: "Company Information",
                href: "#",
                quick:true,
                accessible: true,
            },
            {
                name: "Hardware and Capacity Monitoring",
                href: "#",
                accessible: true,
            },
            {
                name: "Company perks (DDC Mart, DDC Care, etc.)",
                href: "#",
                accessible: true,
            },
            {
                name: "BCP protocols",
                href: "#",
                accessible: true,
            }
        ]
    },
    {
        id:4,
        Icon:GlobeIcon,
        label:'General Updates',
        items: [
            {
                name: "CCO and other departments job postings",
                href: "#",
                quick:true,
                accessible: true,
            },
            {
                name: "CCO reminders and announcements",
                href: "#",
                accessible: true,
            },
            {
                name: "CCO Employee engagement records and documentation",
                href: "#",
                accessible: true,
            }
        ]
    }
];
