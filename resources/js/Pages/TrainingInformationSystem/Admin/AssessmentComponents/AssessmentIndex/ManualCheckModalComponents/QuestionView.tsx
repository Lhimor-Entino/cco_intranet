import { FC, useMemo, useRef } from "react";

import Editor,{ createYooptaEditor, YooptaPlugin } from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import { BulletedList, NumberedList, TodoList } from '@yoopta/lists';
import Embed from '@yoopta/embed';
import Image from '@yoopta/image';
import Video from '@yoopta/video';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import { Bold ,Italic, CodeMark, Underline, Strike, Highlight} from '@yoopta/marks';

const QuestionView:FC<{question:string|object,id:number}> = ({question,id}) => {
    const plugins = [
        Paragraph,
        HeadingOne,
        HeadingTwo,
        HeadingThree,
        NumberedList,
        BulletedList,
        TodoList,
        Embed,
        Image,
        Video
    ] as YooptaPlugin[];
    
    const selectionRef = useRef(null);
    
    const editor = useMemo(() => createYooptaEditor(), []);
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
    return (
        <Editor
            plugins={plugins}
            className='mx-auto w-full'
            editor={editor}
            //@ts-ignore
            value={typeof question === 'string'?JSON.parse(question):question}
            //autoFocus
            //placeholder='Start writing here...'
            readOnly
            key={id}                            
            selectionBoxRoot={selectionRef}
            tools={TOOLS}
            marks={MARKS}
        /> 
    )
}

export default QuestionView;