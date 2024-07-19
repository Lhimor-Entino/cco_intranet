import { FC } from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination"
import { Announcement, PaginationLink as PaginationLinkInterface ,  } from "@/types";

interface Props{
    prev_page_url:string|null;
    data:Announcement[];
    linkItems:PaginationLinkInterface[];
    next_page_url:string|null;
}

const AnnouncementPagination:FC<Props> = ({prev_page_url,data,linkItems,next_page_url}) => {
    return (
        <div className='h-auto'>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious disabled={!prev_page_url} href={prev_page_url||'#'} />
                    </PaginationItem>
                    {
                        data.length>0&&linkItems.map(link=>(
                            <PaginationItem key={link.label}>
                                <PaginationLink isActive={link.active} href={link.url||'#'}>{link.label}</PaginationLink>
                            </PaginationItem>
                        ))
                    }                                
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext disabled={!next_page_url} href={next_page_url||'#'} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export default AnnouncementPagination