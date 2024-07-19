import { cn } from '@/lib/utils';
import { Announcement } from '@/types';
import { format } from 'date-fns';
import {FC} from 'react';
import Editor from './Editor';

interface Props {
    announcement:Announcement;
    even?:boolean;
}

const AnnouncementCard:FC<Props> = ({announcement,even}) => {
    return (
        <div className={cn("grid items-center gap-x-6  xl:gap-x-12 pb-3.5 border-b",!!announcement.image&&'md:grid-cols-2')}>
            {!!announcement.image&&(<div className={cn("mb-6 md:mb-0",even&&'md:order-2 ')}>
                <div className="relative mb-6 overflow-hidden rounded-lg bg-cover bg-no-repeat shadow-lg "
                    data-te-ripple-init data-te-ripple-color="light">
                    <img src={announcement.image} className="w-full object-cover" alt="Louvre" />                    
                    <div
                        className="absolute top-0 right-0 bottom-0 left-0 h-full w-full overflow-hidden bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100 bg-[hsla(0,0%,98.4%,.15)]">
                    </div>
                    
                </div>
            </div>)}

            <div className={cn(even&&"md:order-1")}>
                <h3 className="mb-3 text-2xl font-bold">{announcement.title}</h3>
                
                
                <p className="mb-6 text-primary">
                    <small>Published on <u>{format(new Date(announcement.created_at),'PPpp')}</u> by <a href="#!">{`${announcement.user.first_name} ${announcement.user.last_name}`}</a></small>
                </p>
                <div>
                    <Editor editable={false} announcement={announcement} onChange={()=>{}} />
                </div>
                {
                    announcement.edited_by&&(
                        <p className="mt-3 text-primary">
                            <small>Edited on <u>{format(new Date(announcement.updated_at),'PPpp')}</u> by {`${announcement.edited_by.first_name} ${announcement.edited_by.last_name}`}</small>
                        </p>
                    )
                }
            </div>
        </div>
    );
};

export default AnnouncementCard;