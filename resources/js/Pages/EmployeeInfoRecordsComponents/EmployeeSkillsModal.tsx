import { Button } from "@/Components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog"
import { FC, FormEventHandler, ReactNode, useEffect, useState } from "react";
import { UserSkill,User } from '../../types/index';
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { useForm } from "@inertiajs/inertia-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Inertia } from "@inertiajs/inertia";

interface Props{
    user:User;
    children:ReactNode;
}

const EmployeeSkillsModal:FC<Props> = ({user,children}) => {
    const {data,setData,processing,post} = useForm<{skill:string;user_id:number|undefined}>({skill:'',user_id:user.id});
    const [deleting,setDeleting] = useState<number|undefined>(undefined);

    const onSubmit:FormEventHandler<HTMLFormElement> = e =>{
        e.preventDefault();
        post(route('skills.store'),{
            onSuccess:()=>setData('skill',''),
            onError:()=>toast.error('Failed to add skill. Please try again later.'),
            
        });
    }

    const onDelete = (id:number) =>{
        Inertia.post(route('skills.destroy',{id}),{},{
            onStart:()=>setDeleting(id),
            onFinish:()=>setDeleting(undefined),
            onError:()=>toast.error('Failed to delete skill. Please try again later.')  ,
            
        })
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                {user && (
                    <>
                        <DialogHeader>
                            <DialogTitle>{`Archive ${user.first_name} ${user.last_name}, ${user.company_id}`}</DialogTitle>
                            <DialogDescription>
                                Add or Delete Skills for {user.first_name} {user.last_name}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-y-3.5">
                            <form onSubmit={onSubmit} className="flex items-center gap-x-2">
                                <Input className="h-9" disabled={processing} id='skills' autoFocus required value={data.skill} onChange={({target})=>setData('skill',target.value)} placeholder="Add Skill" />
                                <Button size='sm' variant='outline' disabled={processing} type='submit'>
                                    <Plus className="h-4 w-4" />
                                    Add
                                </Button>
                            </form>
                            <div className="flex flex-wrap gap-2">
                                {user.user_skills.map(skill=>(
                                    <SkillItem key={skill.id} skill={skill} onDelete={onDelete} deleting={deleting===skill.id} />
                                ))}
                            </div>
                        </div>
                    </>
                )}
                <DialogFooter>
                    <DialogClose>Close</DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
export default EmployeeSkillsModal;

interface SkillItemProps{
    skill:UserSkill;
    onDelete:(id:number)=>void;
    deleting:boolean
}

const SkillItem:FC<SkillItemProps> = ({skill,onDelete,deleting}) =>{
    const Icon = !deleting ? Trash2 : Loader2;
    return (
        <div className='flex items-center gap-x-2 justify-between px-2 py-0.5 border rounded-lg'>
            <p className="font-bold tracking-wide">{skill.skill}</p>
            <Button disabled={deleting} size='sm' variant='ghost' onClick={()=>onDelete(skill.id)}>
                <Icon className={cn("h-5 w-5",deleting&&'animate-spin')} />
            </Button>
        </div>
    );
}