import { useAuthModal } from "@/Hooks/useAuthModal"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useForm } from "@inertiajs/inertia-react"
import { FormEventHandler, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"

const AuthModal = () => {
    const {isOpen,onClose} = useAuthModal();

    const {data,setData,post,errors,reset,processing} = useForm({company_id:'',password:''});

    useEffect(reset,[isOpen]);

    const onSubmit:FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();
        post(route('hrms.login'),{
            onSuccess:()=>{
                toast.success('Logged in successfully');
                onClose();
            },
        });
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Log In</AlertDialogTitle>
                    <AlertDialogDescription>
                        Enter your HRMS Credentials.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <form onSubmit={onSubmit} id='auth' className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="company_id" className="text-right">
                            Company ID
                        </Label>
                        <Input required autoComplete="off" autoFocus id="company_id" className="col-span-3" value={data.company_id} onChange={({target})=>setData('company_id',target.value)} disabled={processing}  />
                    </div>
                    {errors.company_id && <p className='text-destructive text-xs w-full text-right'>{removeHTMLTags(errors.company_id)}</p> }
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Password
                        </Label>
                        <Input value={data.password} onChange={({target})=>setData('password',target.value)} disabled={processing}  type="password" required autoComplete="off" id="company_id" className="col-span-3" />
                    </div>
                </form>
                <AlertDialogFooter>
                    <Button disabled={processing} onClick={onClose}>
                        Close
                    </Button>
                    <Button form='auth' disabled={processing} type='submit' >
                        { processing && <Loader2 className='h-5 w-5 mr-2 animate-spin' />}
                        {
                            processing ? "Logging in... Please Wait" : "Login"
                        }
                    </Button>                    
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
export default AuthModal;



export const removeHTMLTags = (str:string):string =>{
    if(str==="") return str;
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, "text/html");
    return doc.body.textContent || "";
}