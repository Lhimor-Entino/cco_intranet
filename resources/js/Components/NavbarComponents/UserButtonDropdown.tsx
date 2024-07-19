import {FC, MouseEventHandler, ReactNode} from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { LogOut, MoonStarIcon, PinIcon, Plus } from 'lucide-react';
import { Switch } from '../ui/switch';
import { usePage } from '@inertiajs/inertia-react';
import { Inertia, Page } from '@inertiajs/inertia';
import { PageProps } from '@/types';
import { useTheme } from '@/Providers/ThemeProvider';
import { useAnnouncementModal } from '@/Hooks/useAnnouncementModal';

interface Props {
    children:ReactNode;
}

const UserButtonDropdown:FC<Props> = ({children}) => {
    const {user} = usePage<Page<PageProps>>().props.auth;
    const {setTheme,theme} = useTheme();

    const isDark = theme === 'dark';
    const toggle = () => setTheme(isDark?'light':'dark');
    const {onOpen} = useAnnouncementModal();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-72' side='bottom'>
                <DropdownMenuLabel className='flex items-center justify-between'>
                    <div className='flex flex-col gap-y-1 text-sm'>
                        <p>{`${user.first_name} ${user.last_name}`}</p>
                        <p>{`${user.company_id}`}</p>
                    </div>
                    <div>
                        {user.position}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={()=>onOpen()}>
                        <Plus className="mr-2 h-4 w-4" />
                        <span>New Announcement</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>Inertia.get(route('settings.index'))}>
                        <PinIcon className="mr-2 h-4 w-4" />
                        <span>Announcement Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='flex items-center justify-between'>
                        <div className='flex items-center gap-x-2'>
                            <MoonStarIcon className="h-4 w-4" />
                            <span>Toggle Dark Mode</span>
                        </div>
                        <Switch checked={isDark} onCheckedChange={toggle} />
                    </DropdownMenuItem>
                </DropdownMenuGroup>             
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={()=>Inertia.post(route('logout'))}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserButtonDropdown;