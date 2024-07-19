import { useAssignToTeamModal } from "@/Pages/EmployeeInfoRecordsComponents/EmployeeInfoHooks/useAssignToTeamModal"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { usePage } from "@inertiajs/inertia-react";
import { Inertia, Page } from "@inertiajs/inertia";
import { PageProps, Team } from "@/types";
import { Label } from "../ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const AssignToTeamModal = () => {
    const {isOpen,onClose,user} = useAssignToTeamModal();
    const {teams} = usePage<Page<PageProps>>().props;
    const [team,setTeam] = useState<Team>();
    const [loading,setLoading] = useState(false);
    
    const onSubmit = () =>{ 
        if(!team) return;
        if(!user) return;
        Inertia.post(route('team.transfer',{team_id:team.id}),{
            //@ts-ignore
            user
        },{
            onStart:()=>setLoading(true),
            onSuccess:()=>{
                toast.success('Agent Transferred')
                onClose();
            },
            onError:e=>{
                console.error(e);
                toast.error('Error. Please try again')
            },
            onFinish:()=>setLoading(false)
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {user?.first_name} {user?.last_name}
                    </DialogTitle>
                    <DialogDescription>
                        Assign To Team
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-y-3.5">
                    <div className="flex flex-col space-y-1">
                        <Label>Teams</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger disabled={loading}>
                                {!team?'Select Team':team.name}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="max-h-[150px] overflow-y-auto relative">
                                <DropdownMenuLabel className="fixed inset-x-0 top-0 z-50 bg-background">Teams</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {teams.map(team=>(
                                    <DropdownMenuItem onSelect={()=>setTeam(team)} key={team.id}>{team.name}</DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <Button onClick={onSubmit} disabled={loading}>
                        {loading && <Loader2 size={24} className="animate-spin" />}
                        Confirm
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
export default AssignToTeamModal