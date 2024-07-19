import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Separator } from '@/Components/ui/separator';
import {Dispatch, FC,  SetStateAction} from 'react';

interface Props {
    isOpen:boolean;
    setOpen:Dispatch<SetStateAction<boolean>>;
}

const InstructionModal:FC<Props> = ({setOpen,isOpen}) => {
    return (
        <Dialog onOpenChange={setOpen} open={isOpen}>
            <DialogContent className='max-h-[98.5vh] flex flex-col overflow-y-auto min-w-[640px]'>
                <DialogHeader>
                    <DialogTitle>Apply for a Leave Instructions</DialogTitle>
                    <DialogDescription>
                        Follow the steps below to apply for a leave:
                    </DialogDescription>
                </DialogHeader>
                <div className='overflow-y-auto w-full flex flex-col gap-y-3.5'>
                    <div className='flex items-center gap-x-8'>
                        <p className='whitespace-nowrap'>
                            Step 1.
                        </p>
                        <p className='flex items-center'>
                            <span>Go To</span> 
                            <a href="https://idcsi-officesuites.com/mail" target='_blank'>
                                <Button size='sm' variant='link'>https://idcsi-officesuites.com/mail</Button>
                            </a>
                        </p>
                    </div>
                    <Separator />
                    <div className='flex items-center gap-x-8'>
                        <p className='whitespace-nowrap'>
                            Step 2.
                        </p>
                        <div className='flex flex-col gap-y-2'>
                            <p>Use your HRMS Credentials to Log In</p> 
                            <img className='h-72 object-contain hover:scale-150 hover:rounded-2xl transition-all duration-300' src={`${route('public_route')}/assets/hrms/step1.png`} alt="Board" />
                        </div>
                    </div>
                    <Separator />
                    <div className='flex items-center gap-x-8'>
                        <p className='whitespace-nowrap'>
                            Step 3.
                        </p>
                        <div className='flex flex-col gap-y-2'>
                            <p>On the left bar of the page,click <span className='italic underline'>Leave</span> to expand the options, then click <span className='italic underline'>Apply Leave</span></p> 
                            <img className='h-72 object-contain hover:scale-150 hover:rounded-2xl transition-all duration-300' src={`${route('public_route')}/assets/hrms/step2.png`} alt="Board" />
                        </div>
                    </div>
                    <Separator />
                    <div className='flex items-center gap-x-8'>
                        <p className='whitespace-nowrap'>
                            Step 4.
                        </p>
                        <div className='flex flex-col gap-y-2'>
                            <p>Select the dates, tick half-day if applicable and make sure <span className='italic underline'>Reason</span> and <span className='italic underline'>Remarks</span> are correct, then click <span className='italic underline'>Submit</span></p> 
                            <img className='h-72 object-contain hover:scale-150 hover:rounded-2xl transition-all duration-300' src={`${route('public_route')}/assets/hrms/step3.png`} alt="Board" />
                        </div>
                    </div>
                    <Separator />
                    <div className='flex items-center gap-x-8'>
                        <p className='whitespace-nowrap'>
                            Step 5.
                        </p>
                        <div className='flex flex-col gap-y-2'>
                            <p>Wait for Approval</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InstructionModal;