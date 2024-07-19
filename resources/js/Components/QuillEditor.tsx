import { FC, useState } from 'react'

import ReactQuill,{Quill} from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import 'react-quill/dist/quill.bubble.css';
import { ImageIcon, VideoIcon } from 'lucide-react';
import InsertImageModel from './QuillEditorComponents/InsertImageModal';
import InsertImageModal from './QuillEditorComponents/InsertImageModal';
import InsertVideoModal from './QuillEditorComponents/InsertVideoModal';

export type QuillMedia = {
    url:string;
    width:number;
    height:number;
}

interface Props{
    placeholder?:string;
    readonly?:boolean;
    onChange?:(val:string)=>void;
    value:string;
    id?:string;
    onImageInsert?:(img:QuillMedia)=>void;
    onVideoInsert?:(vid:QuillMedia)=>void;
}

const modules= {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
        // ['link', 'image', 'video', 'formula'],
        ['video'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
    ],
}

const QuillEditor:FC<Props> = ({onChange,value,readonly,placeholder,id,onImageInsert,onVideoInsert}) => {
    const [showInsertImageModal,setShowInsertImageModal] = useState(false);
    const [showInsertVideoModal,setShowInsertVideoModal] = useState(false);
    return(
        <>
            <div className='relative'>
                <div className='z-50 group absolute top-0.5 right-0.5 p-2.5 flex flex-row items-center gap-x-2.5'>
                    <button onClick={()=>setShowInsertImageModal(true)} className='opacity-50 hover:opacity-100 duration-300 transition'>
                        <ImageIcon className='h-5 w-5' />
                    </button>
                    <button onClick={()=>setShowInsertVideoModal(true)} className='opacity-50 hover:opacity-100 duration-300 transition'>
                        <VideoIcon className='h-5 w-5' />
                    </button>
                </div>
                <ReactQuill  modules={modules} id={id} placeholder={placeholder} readOnly={readonly} theme={readonly?'bubble':'snow'} value={value} 
                    onChange={(e,delta,source,editor)=>console.log(source)}
                    //onChange={onChange} 
                    />
            </div>
            {(!!onImageInsert && !readonly) && <InsertImageModal isOpen={showInsertImageModal} onClose={()=>setShowInsertImageModal(false)} onInsert={onImageInsert} />}
            {(!!onVideoInsert && !readonly) && <InsertVideoModal isOpen={showInsertVideoModal} onClose={()=>setShowInsertVideoModal(false)} onInsert={onVideoInsert} />}

        </>
)} 


export default QuillEditor;