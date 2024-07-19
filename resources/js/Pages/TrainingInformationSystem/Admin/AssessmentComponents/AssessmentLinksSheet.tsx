import Hint from '@/Components/Hint';
import { Button } from '@/Components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/Components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { TrainingAssessment, TrainingAssessmentLink } from '@/types/trainingInfo';
import { format } from 'date-fns';
import { CopyIcon, Recycle } from 'lucide-react';
import {FC, useState} from 'react';
import { toast } from 'sonner';

interface Props {
    assessment:TrainingAssessment;
    isOpen:boolean;
    onClose:()=>void;
}

const AssessmentLinksSheet:FC<Props> = ({assessment,isOpen,onClose}) => {
    const {links} = assessment;
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className='h-full max-h-screen flex flex-col lg:min-w-[50vw] min-w-[100vw]'>
                <SheetHeader className='h-auto'>
                    <SheetTitle>{assessment.title} Link</SheetTitle>
                    <SheetDescription>
                        Manage the links for the assessment
                    </SheetDescription>
                </SheetHeader>
                <div className='flex-1'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Created By</TableHead>
                                <TableHead>Valid Until</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(links||[]).map((link) => <LinkItem key={link.id} link={link}/>)}
                        </TableBody>
                    </Table>
                </div>
                <SheetFooter className='h-auto'>
                    <SheetClose asChild>
                        <Button variant='secondary'>Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default AssessmentLinksSheet;

const LinkItem:FC<{link:TrainingAssessmentLink}> = ({link}) => {
    
    const [copied,setCopied] = useState(false);
    const onCopy = (link:string)=> {
        navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success('URL Copied',{duration:1000});
        setTimeout(()=>setCopied(false),1000);
    }
    return(
        <TableRow>
            <TableCell>
                <div className='space-y-1'>
                    <p className="font-medium">{`${link.user.first_name} ${link.user.last_name}`}</p>
                    <p className='text-xs'>on: {format(new Date(link.created_at),'Pp')}</p>
                </div>
                
            </TableCell>
            <TableCell>
                <div className='space-y-1'>
                    <p className='text-xs'>{format(new Date(link.valid_until),'PPPP')}</p>
                    <p className='text-xs'>{format(new Date(link.valid_until),'pppp')}</p>
                </div>
            </TableCell>
            <TableCell>{link.status}</TableCell>
            <TableCell>
                <div className='flex flex-row gap-x-1'>
                    <Hint label='Copy Link'>
                        <Button onClick={()=>onCopy(link.link)} disabled={copied} size='icon'>
                            <CopyIcon className='h-5 w-5' />
                        </Button>
                    </Hint>
                    <Hint label='Archive'>
                        <Button size='icon'>
                            <Recycle className='h-5 w-5' />
                        </Button>
                    </Hint>
                </div>
            </TableCell>
        </TableRow>
    );
}