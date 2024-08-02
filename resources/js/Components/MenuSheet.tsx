import {FC, ReactNode} from 'react';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { NavItems } from '@/Pages/Welcome';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { ScrollArea } from './ui/scroll-area';
import { ActivityIcon, BadgeInfoIcon, Dot, GaugeIcon, Globe2Icon, LucideIcon } from 'lucide-react';
import { Inertia, Page } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import { PageProps, User } from '@/types';



interface Props {
    children: ReactNode;
}

const MenuSheet:FC<Props> = ({children}) => { 
    const {user} = usePage<Page<PageProps>>().props.auth;
    const isTeamLead = (user:User) => {
        if(user=== null) {return false;}
        return user.position == 'TEAM LEADER' ||
        user.position == 'TEAM LEADER 1' ||
        user.position == 'TEAM LEADER 2' ||
        user.position == 'TEAM LEADER 3' ||
        user.position == 'TEAM LEADER 4' ||
        user.position == 'TEAM LEADER 5' ||
        user.position == 'TEAM LEADER 6' ||
        user.position == 'TEAM LEAD' ||
        user.position == 'TEAM LEAD 1' ||
        user.position == 'TEAM LEAD 2' ||
        user.position == 'TEAM LEAD 3' ||
        user.position == 'TEAM LEAD 4' ||
        user.position == 'TEAM LEAD 5' ||
        user.position == 'TEAM LEAD 6' 
    };
    const hasTeam = (user:User) => {
        if(user=== null) {return false;}
        return !!user.team && !!user?.team_id;
    }
    
    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side='left' className='h-full flex flex-col min-w-[100vw] lg:min-w-[41rem] '>
                <SheetHeader className='h-auto'>
                    <SheetTitle>Welcome to CCO Intranet</SheetTitle>
                    <SheetDescription>
                        Choose a site below to begin exploring.
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className='flex-1 pr-8'>
                    <Accordion type="single" collapsible >
                        {
                            NavItems.map(({Icon,...navItem}) => (
                                <AccordionItem key={navItem.id} value={navItem.id.toString()}>
                                    <AccordionTrigger>
                                        <div className='flex items-center gap-x-2'>
                                            <Icon className='h-5 w-5' />
                                            {navItem.label}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className='flex flex-col gap-y-2.5'>
                                            {
                                                navItem.items.map((item) => {
                                                    /**MODIFICATION: Change default page list if teamleader (From Individual Into Team Performance Dashboard)**/
                                                       if(isTeamLead(user) && hasTeam(user) && item.href === route('individual_performance_dashboard.index') && item.name === 'Individual Performance Dashboard'){
                                                            item.href = route('individual_performance_dashboard.team');
                                                            item.name = "Team Performance Dashboard";
                                                       }
                                                       
                                                    /**END**/

                                                    return (
                                                        <Button onClick={() => item.href !== "#" && Inertia.get(item.href)} disabled={item.href==='#'} variant='outline' key={item.name} className='flex items-center justify-start'>
                                                            <Dot className='h-7 w-7 mr-1.5' />
                                                            <span className='truncate'>{item.name}</span>
                                                        </Button>
                                                    )
                                                })
                                            }
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))
                        }                        
                    </Accordion>
                </ScrollArea>
                <SheetFooter className='h-auto'>
                    <SheetClose asChild>
                        <Button>Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default MenuSheet;



