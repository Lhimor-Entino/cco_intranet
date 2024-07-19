import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { TrainingFolder, TrainingSubFolder } from '@/types/trainingInfo';
import { useForm } from '@inertiajs/inertia-react';
import { Loader2 } from 'lucide-react';
import {FC, FormEventHandler, useEffect} from 'react';
import { toast } from 'sonner';

interface Props {
    isOpen:boolean;
    onClose:()=>void;
    folderNames:string[];
    currentFolder?:TrainingSubFolder;
    mainFolder:TrainingFolder;   
}

const NewSubFolderModal:FC<Props> = ({isOpen,onClose,folderNames,currentFolder,mainFolder}) => {
    
    const {reset,data,setData,processing,post} = useForm<{name:string,training_folder_id:number,training_sub_folder_id:number|undefined}>({name:'',training_folder_id:mainFolder.id,training_sub_folder_id:currentFolder?.id}); 
    const onSubmit:FormEventHandler<HTMLFormElement> = (e)=>{
        e.preventDefault();
        if(data.name.trim()==='') return toast.error('Please enter a valid folder name');
        //return a toast notification if data.name exists in folderNames
        if(folderNames.includes(data.name)) return toast.error('Folder name already exists');
        post(route('training_folder.sub.store'),{
            onSuccess: ()=>{
                toast.success('Sub folder created successfully.');
                onClose();
            },
            onError:()=>toast.error('An error occurred. Please try again later.')
        });
    }
    
    useEffect(()=>{
        if(isOpen){
            reset();
        }
    },[isOpen]);
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Sub Folder</DialogTitle>
                    <DialogDescription>
                        Create a sub main folder under {currentFolder?.name||mainFolder.name}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className='flex flex-col gap-2.5' id='main_folder'>
                    <div className='space-y-1'>
                        <Label>Folder Name</Label>
                        <Input value={data.name} onChange={({target})=>setData('name',target.value)} required disabled={processing} />
                    </div>
                </form>
                <DialogFooter>
                    <Button disabled={processing} form='main_folder' size='sm' type="submit">
                        {processing && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default NewSubFolderModal;