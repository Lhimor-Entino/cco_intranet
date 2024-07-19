import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { TrainingSubFolder } from '@/types/trainingInfo';
import { useForm } from '@inertiajs/inertia-react';
import { Loader2 } from 'lucide-react';
import {FC, FormEventHandler} from 'react';
import { toast } from 'sonner';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    folder: TrainingSubFolder;    
    folderNames:string[];
}

const EditSubFolderModal:FC<Props> = ({isOpen,onClose,folder,folderNames}) => {
    const {reset,data,setData,processing,post} = useForm<{name:string}>({name:folder.name}); 
    const onSubmit:FormEventHandler<HTMLFormElement> = (e)=>{
        e.preventDefault();
        if(data.name.trim()==='') return toast.error('Please enter a valid folder name');
        //return a toast notification if data.name exists in folderNames
        if(folderNames.filter(f=>f!==folder.name).includes(data.name)) return toast.error('Folder name already exists');
        post(route('training_folder.sub.update',{id:folder.id}),{
            onSuccess: ()=>{
                toast.success('Sub folder created successfully.');
                onClose();
            },
            onError:()=>toast.error('An error occurred. Please try again later.')
        });
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Sub Folder</DialogTitle>
                    <DialogDescription>
                        Edit Sub Folder {folder.name} details
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className='flex flex-col gap-2.5' id='sub_folder'>
                    <div className='space-y-1'>
                        <Label>Folder Name</Label>
                        <Input value={data.name} onChange={({target})=>setData('name',target.value)} required disabled={processing} />
                    </div>
                </form>
                <DialogFooter>
                    <Button disabled={processing} form='sub_folder' size='sm' type="submit">
                        {processing && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditSubFolderModal;