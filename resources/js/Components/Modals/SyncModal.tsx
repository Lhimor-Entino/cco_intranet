import { FC, useState } from "react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";
import { useSyncModal } from "@/Hooks/useSyncModal";
import { Inertia } from "@inertiajs/inertia";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SyncModal:FC = () => {
    const {isOpen,onClose} = useSyncModal();
    const [loading,setLoading] = useState(false);
    const onSync = () =>{
        Inertia.post(route('hrms.sync'),{},{
            preserveState:false,
            onSuccess:()=>{
                toast.success('Sync Successful');
                onClose();
            },
            onError:e=>{
                toast.error('An error occured while syncing. Please try again later');
                console.error(e);
            },
            onStart:()=>setLoading(true),
            onFinish:()=>setLoading(false)
        });
    }
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>            
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Sync CCO employees with the HRMS Server?</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="space-y-2.5">
                            <p>This may take a while, it is recommended that you do this on a Sunday or a PH Holiday</p>
                            <p>This will add new CCO employees from the HRMS server to the CCO Intranet, and update existing CCO Employee details on the intranet Server.</p>
                            <p>Syncing will also remove employees that are no longer in CCO</p>
                            <p>NOTE: This will only overwrite basic HMRS columns:</p>
                            <p> - Employee Name</p>
                            <p> - Employee ID</p>
                            <p> - Date of birth</p>
                            <p> - Position</p>
                            <p> - Department</p>
                            <p> - Date Hired</p>
                            <p> - Site</p>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <Button onClick={onSync} disabled={loading}>
                        <RefreshCcw className={cn('h-5 w-5 mr-2',loading&&'animate-spin')} />
                        {!loading?'Continue Sync':'Syncing... Please wait'}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
export default SyncModal