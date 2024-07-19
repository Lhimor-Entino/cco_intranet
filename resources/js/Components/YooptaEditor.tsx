import {FC, useEffect, useMemo, useRef, useState} from 'react';
import Editor, { YooptaContentValue, YooptaPlugin, createYooptaEditor } from '@yoopta/editor';

import Paragraph from '@yoopta/paragraph';
import Embed from '@yoopta/embed';
import Image from '@yoopta/image';
import Video from '@yoopta/video';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import axios from 'axios';
import { TrainingTopic, TrainingTopicVersion } from '@/types/trainingInfo';
import { toast } from 'sonner';
import { useMutation, useQuery } from 'react-query';





interface Props {
    topic: TrainingTopic;
    onChange?: (val: string) => void;
    value?: string ;
    version: string;
    readonly?: boolean;
}

const YooptaEditor:FC<Props> = ({topic,onChange,value,version}) => {
    
    

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    const editor = useMemo(() => createYooptaEditor(), []);
    // const editorRef = useRef(createYooptaEditor())
    // const editor = editorRef.current
    const saveDraft = async (id:number,version:string,content:string|YooptaContentValue|undefined) => {
        if(!isMounted) return;
        if(!editor) return;
        if(!content) return;
        if(content === '[]') return;
        if(JSON.stringify(content).length<10) return;
        const updatedContent = JSON.stringify(content).replace(/null/g,'""');
        return axios.post(route('training_info_system.save_draft',{id,version}),{content:JSON.parse(updatedContent)});
    };
    const selectionRef = useRef(null);
    const plugins = [
        Paragraph,
        HeadingOne,
        HeadingTwo,
        HeadingThree,
        NumberedList,
        BulletedList,
        TodoList,
        Embed,
        Image.extend({
            options: {
                onUpload: async (file) => {
                    const data = await uploadImageToServer(file);
                    return {
                        src: data,
                        alt: 'iamge',
                        sizes: {
                            width: 320,
                            height: 240,
                        },
                    };
                },
            },
        }),
        Video.extend({
            options: {
                onUpload: async (file) => {
                    const data = await uploadVideoToServer(file);
                    return {
                        src: data,
                        alt: 'video',
                        sizes: {
                            width: 320,
                            height: 240,
                        },
                    };
                },
            },
        }),
        // File.extend({
        //     // options: {
        //     //     onUpload: async (file) => {
        //     //     const response = await uploadToCloudinary(file, 'auto');
        //     //     return { src: response.url };
        //     //     },
        //     // },
        // }),
    ] as YooptaPlugin[];



    const TOOLS = {
        ActionMenu: {
            render: DefaultActionMenuRender,
            tool: ActionMenuList,
        },
        Toolbar: {
            render: DefaultToolbarRender,
            tool: Toolbar,
        },
    };

    const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];
    
    const uploadVideoToServer = async (file:File) => {
        try {
            const formData = new FormData();
            formData.append('video', file);
            const response = await axios({
                method: 'post',
                url: route('training_info_system.upload_video',{id:topic.id}),
                data: formData,
            });
            return response.data;
        }catch(e){
            console.error(e);
            toast.error('Failed to upload video');
        }
    }

    const uploadImageToServer = async (file:File) => {
        try {
            const formData = new FormData();
            formData.append('image', file);
            const response = await axios({
                method: 'post',
                url: route('training_info_system.upload_image',{id:topic.id}),
                data: formData,
            });
            return response.data;
        }catch(e){
            console.error(e);
            toast.error('Failed to upload image');
        }
    }
    const { isLoading, isError, error, mutate } =useMutation(['save_draft',topic.id,version], ()=>saveDraft(topic.id,version!,editor.getEditorValue()));
    useEffect(() => {
        function handleChange(value:string) {
            onChange && onChange(value);
        }
        editor.on('change', (e)=>{
            handleChange(e);
            !isLoading&&mutate();
        });
        return () => {
            editor.off('change', handleChange);
        };
    }, [editor,onChange]);
    
    
    useEffect(()=>{
        if(value && editor && isMounted){
            editor.setEditorValue(JSON.parse(JSON.stringify(value)));
        }
    },[editor,value,isMounted])

    return (
        <div
            className="flex justify-center py-2.5 px-12 container"
            ref={selectionRef}
            >                
                <Editor
                    className='mx-auto w-full'
                    editor={editor}
                    //@ts-ignore
                    value={undefined}
                    plugins={plugins}
                    tools={TOOLS}
                    marks={MARKS}
                    selectionBoxRoot={selectionRef}
                    autoFocus
                    //placeholder='Start writing here...'
                    
                />
                
        </div>
    );
};

export default YooptaEditor;

