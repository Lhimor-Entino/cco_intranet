import { TrainingAssessment, TrainingAssessmentQuestion } from '@/types/trainingInfo';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Editor,{ createYooptaEditor, YooptaPlugin } from '@yoopta/editor';
import Embed from '@yoopta/embed';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import Image from '@yoopta/image';
import { BulletedList, NumberedList, TodoList } from '@yoopta/lists';
import { Bold, CodeMark, Highlight, Italic, Strike, Underline } from '@yoopta/marks';
import Paragraph from '@yoopta/paragraph';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import Video from '@yoopta/video';
import axios from 'axios';
import {FC, useEffect, useMemo, useRef, useState} from 'react';
import { toast } from 'sonner';

interface Props {
    question:TrainingAssessmentQuestion;
    onChange?: (val: string) => void;
    readonly?: boolean;
}

const QuestionYooptaEditor:FC<Props> = ({question,onChange,readonly}) => {
    const [isMounted, setIsMounted] = useState(false);    
    const editor = useMemo(() => createYooptaEditor(), []);
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
    useEffect(() => {
        setIsMounted(true);
    }, []);

    
    const uploadVideoToServer = async (file:File) => {
        
        try {
            const formData = new FormData();
            formData.append('video', file);
            const response = await axios({
                method: 'post',
                url: route('assessment.questions.upload_video',{id:question.id}),
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
                url: route('assessment.questions.upload_image',{id:question.id}),
                data: formData,
            });
            return response.data;
        }catch(e){
            console.error(e);
            toast.error('Failed to upload image');
        }
    }
    useEffect(() => {
        function handleChange(value:string) {
            onChange && onChange(value);
        }
        editor.on('change', (e)=>{
            handleChange(e);
        });
        return () => {
            editor.off('change', handleChange);
        };
    }, [editor,onChange]);
    
    
    useEffect(()=>{
        if(question.question.length>10 && editor&&isMounted){
            let content = JSON.parse(JSON.stringify(question.question));
            if(typeof content === 'string') content = JSON.parse(content);
            editor.setEditorValue(content);
        }
    },[editor,question.question,isMounted]);

    useEffect(()=>setIsMounted(true),[]); //This is just a safety measure to ensure that the editor is mounted before setting the value
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
                    readOnly={readonly}
                    key={question.id}
                />
                
        </div>
    );
};

export default QuestionYooptaEditor;