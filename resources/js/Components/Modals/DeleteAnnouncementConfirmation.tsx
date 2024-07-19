import { FC, useState } from "react"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { useDeleteAnnouncementModal } from "@/Hooks/useDeleteAnnouncementModal";
import { Inertia } from "@inertiajs/inertia";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const DeleteAnnouncementConfirmation:FC = () => {
    const {id,isOpen,onClose} = useDeleteAnnouncementModal();
    const [loading,setLoading] = useState(false);

    const onConfirm = () =>{
        if(id===0 || !id) return toast.error('Internal Error. Please refresh the page and try again.');
        Inertia.post(route('settings.destroy',id),{},{
            onStart:()=>setLoading(true),
            onFinish:()=>setLoading(false),
            onError:()=>toast.error('Something Went Wrong. Please try again.'),
            onSuccess:()=>{
                toast.success('Announcement deleted successfully');
                onClose();
            }
        });
        
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the Announcement from the database.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <Button onClick={onConfirm} disabled={loading}>
                        {
                            loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        }
                        Continue
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
export default DeleteAnnouncementConfirmation