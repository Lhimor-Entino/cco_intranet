import {FC} from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { usePage } from '@inertiajs/inertia-react';
import { Page } from '@inertiajs/inertia';
import { PageProps } from '@/types';
import { Button } from '../ui/button';
import UserButtonDropdown from './UserButtonDropdown';

interface Props {
    
}

const UserButton:FC<Props> = () => {
    const {user} = usePage<Page<PageProps>>().props.auth;
    return (
        <UserButtonDropdown>
            <Button className='rounded-full' size='icon'>
                <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photo} alt="Photo" />
                    <AvatarFallback>{`${user.first_name.charAt(0)+user.last_name.charAt(0)}`}</AvatarFallback>
                </Avatar>
            </Button>
        </UserButtonDropdown>
    );
};

export default UserButton;