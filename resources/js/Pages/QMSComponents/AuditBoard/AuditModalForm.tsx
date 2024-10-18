import { AlertDialogHeader } from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";
import { TriangleAlert, X, XCircle, XSquare } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";

interface Props{

}
const AuditModalForm:FC<Props> =  () => {
    const [seconds, setSeconds] = useState(0);
    const [confirmation,setConfirmation] = useState(false);
    const intervalRef = useRef<any>();
    useEffect(() => {
          return () => clearInterval(intervalRef.current);
    },[]);
    const startTime = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds + 1);
          }, 1000);
    }
    const stop = () => {
        clearInterval(intervalRef.current);
        setSeconds(0);
    }
    const captureTime = () => {
        clearInterval(intervalRef.current);
    }
    const formatTime = () => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      };
    return ( 
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-64" variant={'default'} size={'sm'}>Audit ({formatTime()})</Button>
            </DialogTrigger>
            <DialogContent hideClose={true}  onOpenAutoFocus={startTime} onCloseAutoFocus={stop} onInteractOutside={(e) => {e.preventDefault();}}>
                <DialogHeader className="items-end p-0 m-0 h-1">
                    <Button onClick={() => {setConfirmation(true)}} size={'icon_sm'} variant={"ghost"}>
                        <XCircle/>
                    </Button>
                </DialogHeader>
                {confirmation && (
                    <>
                        <DialogHeader>
                        <DialogTitle className="flex justify-start">
                            <TriangleAlert className="mr-2 text-yellow-500" />
                            Warning
                        </DialogTitle>
                        <DialogDescription>
                                Are you sure you want to exit? 
                                This action cannot be undone. Your entries will not be saved.
                        </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button onClick={() => {setConfirmation(false)}} variant={"ghost"}>Cancel</Button>
                            <DialogClose>
                                <Button variant={"destructive"}>Exit</Button>
                            </DialogClose>
                        </DialogFooter>
                    </>
                    )

                }
                {!confirmation && (
                    <DialogHeader>
                        <DialogTitle>({formatTime()})</DialogTitle>
                        <DialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                        </DialogDescription>
                    </DialogHeader>)

                }
            </DialogContent>
        </Dialog>

    );
}

export default AuditModalForm;