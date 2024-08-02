import { Button } from "@/Components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { Inertia } from "@inertiajs/inertia";
import { MoreVerticalIcon, LayoutDashboardIcon, Dot, LockKeyholeIcon, BoxesIcon, Gauge, ActivityIcon } from "lucide-react";
import { FC } from "react";
import { toast } from "sonner";

interface IPDDropdownProps {
    className?:string;
    isAdmin:boolean;
    isTeamLead:boolean;
    project_id?:number;
}

const IPDDropdown:FC<IPDDropdownProps> = ({isAdmin,className,project_id,isTeamLead}) => {
    const isRegularUser = !isAdmin && !isTeamLead;
    const handleAdminSettingsClick = () => {
        if(!isAdmin) return toast.error('Only Supervisors and Managers can access Admin Settings');
        Inertia.get(route('individual_performance_dashboard.settings'));
    }


    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild className={className}>
                <Button  variant='secondary' className='rounded-full' size='icon' >
                    <MoreVerticalIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent  className='w-60 mr-3' >
                <DropdownMenuGroup>
                    <DropdownMenuLabel  className='flex items-center'>
                        <LayoutDashboardIcon className='w-6 h-6 mr-1.5' />
                        Go To:
                    </DropdownMenuLabel>  
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={()=>Inertia.get(route('individual_performance_dashboard.index',{project_id}))}>
                        <Dot className='w-6 h-6 mr-0.5' />
                        Individual Performance
                    </DropdownMenuItem>
                    {(isAdmin || isTeamLead )&&(<DropdownMenuItem onClick={()=>Inertia.get(route('individual_performance_dashboard.project'))}>
                        <Dot className='w-6 h-6 mr-0.5' />
                        Project Performance
                    </DropdownMenuItem>)}
                    <DropdownMenuItem onClick={()=>Inertia.get(route('individual_performance_dashboard.team'))}>
                        <Dot className='w-6 h-6 mr-0.5' />
                        Team Performance
                    </DropdownMenuItem>
                </DropdownMenuGroup>  
                {!isRegularUser&&(
                    <>                                      
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup className='text-info'>
                            <DropdownMenuLabel className='flex items-center'>
                                <BoxesIcon className='w-6 h-6 mr-1.5' />
                                Team Lead Functions:
                            </DropdownMenuLabel>
                            <DropdownMenuItem  onClick={()=>Inertia.get(route('individual_performance_dashboard.agent.rating'))}>
                                <ActivityIcon className='w-4 h-4 mr-1.5' />
                                Rate Agents
                            </DropdownMenuItem>
                        </DropdownMenuGroup>                
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup className='text-success'>
                            <DropdownMenuLabel className='flex items-center'>
                                <LockKeyholeIcon className='w-6 h-6 mr-1.5' />
                                Admin Settings:
                            </DropdownMenuLabel>
                            <DropdownMenuItem disabled={route().current('individual_performance_dashboard.settings')} onClick={handleAdminSettingsClick}>
                                <Gauge className='w-4 h-4 mr-1.5' />
                                Metric Settings
                            </DropdownMenuItem>
                        </DropdownMenuGroup>                        
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default IPDDropdown;