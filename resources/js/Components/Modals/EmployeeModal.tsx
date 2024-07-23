import { useEmployeeModal } from "@/Hooks/useEmployeeModal"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { ScrollArea } from "../ui/scroll-area"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Separator } from "../ui/separator"
import { format } from "date-fns"
import { useEffect } from "react"

const EmployeeModal = () => {
    const {isOpen,data,onClose} = useEmployeeModal();
    if(!data) return null;
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-screen flex flex-col " >
                <DialogHeader className="h-auto">
                    <DialogTitle>Employee Info</DialogTitle>
                    <Separator />
                </DialogHeader>
                <ScrollArea className="flex-1 px-6">
                    <div className="grid grid-cols-2 gap-y-3.5 gap-x-9">
                        <div>
                            <Label className='text-base'>{`${data.last_name}, ${data.first_name} ${data.last_name}`}</Label>
                            <Separator />
                            <p className="italic text-muted-foreground text-xs font-light">Employee Name</p>
                        </div>
                        <div>
                            <Label className='text-base'>{`${data.company_id}`}</Label>
                            <Separator />
                            <p className="italic text-muted-foreground text-xs font-light">Company ID</p>
                        </div>                        
                        <div>
                            <Label className='text-base'>{`${format(data.date_hired,'PP')}`}</Label>
                                <Separator />
                                <p className="italic text-muted-foreground text-xs font-light">Date Hired</p>
                        </div>                        
                        <div>
                            <Label className='text-base'>{`${!data.date_resigned?'Active':format(data.date_resigned,'PP')}`}</Label>
                            <Separator />
                            <p className="italic text-muted-foreground text-xs font-light">Date Resigned</p>
                        </div>                                             
                        <div>
                            <Label className='text-base'>{`${data.project?.name||'Not Set'}`}</Label>
                            <Separator />
                            <p className="italic text-muted-foreground text-xs font-light">Project</p>
                        </div>                                             
                        <div>
                            <Label className='text-base'>{data.site}</Label>
                            <Separator />
                            <p className="italic text-muted-foreground text-xs font-light">Site</p>
                        </div>                                           
                        <div>
                            <Label className='text-base'>{`${data.date_of_birth}`}</Label>
                            <Separator />
                            <p className="italic text-muted-foreground text-xs font-light">DOB</p>
                        </div>                                             
                        <div>
                            <Label className='text-base'>{`${!data.shift?'Shift Not Set':data.shift.schedule}`}</Label>
                            <Separator />
                            <p className="italic text-muted-foreground text-xs font-light">Shift Schedule</p>
                        </div>                                           
                        <div className="col-span-2">
                            <Label className='text-base'>{data.position}</Label>
                            <Separator />
                            <p className="italic text-muted-foreground text-xs font-light">Designation</p>
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter className="h-auto">
                    <DialogClose asChild>
                        <Button size='sm' variant='outline'>Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
export default EmployeeModal