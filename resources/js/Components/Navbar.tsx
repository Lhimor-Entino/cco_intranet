import {FC, ReactNode, useEffect, useMemo, useState} from 'react';
import { NavItems } from '@/Pages/Welcome';
import { Button } from './ui/button';
import { CircleUserRound,  ClockIcon,  KeyRound,  MenuIcon, MoreVerticalIcon, SettingsIcon, ShieldAlertIcon, Users2Icon } from 'lucide-react';
import MenuSheet from './MenuSheet';
import { useAuthModal } from '@/Hooks/useAuthModal';
import { Link, usePage } from '@inertiajs/inertia-react';
import { Inertia, Page } from '@inertiajs/inertia';
import { PageProps } from '@/types';
import UserButton from './NavbarComponents/UserButton';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from './ui/command';
import { useProjectSettingsModal } from '@/Hooks/useProjectSettingsModal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useShiftSettingsModal } from '@/Hooks/useShiftSettingsModal';
import DebugLoginModal from './ProgrammerSettings/DebugLoginModal';
import { isAdmin, isTeamLead } from '@/lib/utils';

interface Props {
    title?:string;
}

const Navbar:FC<Props> = ({title}) => {
    const {onOpen} = useAuthModal();
    
    const {user} = usePage<Page<PageProps>>().props.auth;
    const [showDebugLoginModal,setShowDebugLoginModal] = useState(false);
    useEffect(() => {
        const handleKeyDown = (e:KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                setShowDebugLoginModal(true)
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);
    return (
        <>
            <nav className='z-50 py-2.5 backdrop-blur-lg border-b border-b-muted-foreground/50 px-3.5 h-auto'>
                <div className='container px-3.5 mx-auto relative text-sm flex items-center justify-between'>
                    {/* <Button onClick={()=>setShowDebugLoginModal(true)} size='sm'>
                        Login Debug
                    </Button> */}
                    <div className='flex justify-center items-center gap-x-2'>
                        <MenuSheet>
                            <Button variant='ghost' className='rounded-full' size='icon'>
                                <MenuIcon />
                            </Button>
                        </MenuSheet>
                        <Link href={route('welcome')}>
                            <div className='flex items-center flex-shrink-0'>
                                <img className='h-10 w-16 mr-2' src={`${route('public_route')}/logo/fpo.png`} alt="FPO" />
                                <p className='text-xl tracking-tight font-semibold '>
                                    <span>CCO Intranet&nbsp;</span>
                                    {
                                        title&&<span className='text-base text-muted-foreground/80'>{` - ${title}`}</span>
                                    }
                                </p>
                            </div>
                        </Link>
                    </div>
                    <div className='flex  gap-x-2.5 items-center justify-center'>
                        {user&&user.has_settings_access&&(
                            <Settings onShowDebugLoginModal={()=>setShowDebugLoginModal(true)}>
                                <Button className='rounded-full' variant='ghost' size='icon'>
                                    <SettingsIcon />
                                </Button>
                            </Settings>
                        )}
                        <QuickLinks>
                            <Button className='rounded-full' variant='ghost' size='icon'>
                                <MoreVerticalIcon />
                            </Button>
                        </QuickLinks>
                        {
                            !user?(
                                <Button onClick={onOpen} variant='outline' size='sm'>
                                    <CircleUserRound className='h-4 w-4 mr-2' />
                                    <span>Sign In</span>
                                </Button>
                            ):<UserButton />
                        }
                    </div>
                    
                    
                </div>
            </nav>
            <DebugLoginModal isOpen={showDebugLoginModal} onClose={()=>setShowDebugLoginModal(false)} />
        </>
    );
};

export default Navbar;

interface QuickLinksProps{
    children: ReactNode;
}

const QuickLinks:FC<QuickLinksProps> = ({children}) =>{
    const isAdminRef = isAdmin();
    const isTeamRef = isTeamLead();
    const quickLinks = useMemo(()=>NavItems(isAdminRef,isTeamRef).map(navItem=>navItem.items.filter(i=>i.quick===true)).flat(),[NavItems]);
    
    return (
        <Popover >
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent className=" p-0">
                <Command>
                    <CommandList>
                        <CommandInput className='text-base' placeholder="Search Link..." />
                        <CommandEmpty>No link found.</CommandEmpty>
                        <CommandGroup  heading='Quick Links'>
                            {quickLinks.map((link) => (                                
                                <CommandItem disabled={link.href==='#'} key={link.name} onSelect={() => link.href!=="#" && Inertia.get(link.href)} className="text-xs" >
                                    {link.name}
                                </CommandItem>                                
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                </Command>
            </PopoverContent>
        </Popover>
    );
}

interface SettingsProps{
    children: ReactNode;
    onShowDebugLoginModal: ()=>void;
}

const Settings:FC<SettingsProps> = ({children,onShowDebugLoginModal}) =>{
    
    const {onOpen:OpenProjectSettings} = useProjectSettingsModal();
    const {onOpen:openShiftSettings} = useShiftSettingsModal();
    const {user} = usePage<Page<PageProps>>().props.auth;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={OpenProjectSettings}>
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        <span>Project Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>Inertia.get(route('team.index'))}>
                        <Users2Icon className="mr-2 h-4 w-4" />
                        <span>Team Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>openShiftSettings(user.position)}>
                        <ClockIcon className="mr-2 h-4 w-4" />
                        <span>Shift Settings</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>         
            </DropdownMenuContent>
        </DropdownMenu>
    );
}