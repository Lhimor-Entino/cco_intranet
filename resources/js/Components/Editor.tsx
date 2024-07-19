import { useTheme } from '@/Providers/ThemeProvider';
import { Announcement } from '@/types';
import { BlockNoteEditor, PartialBlock } from '@blocknote/core';
import {  
    useCreateBlockNote,
    BasicTextStyleButton,
    BlockNoteView,
    BlockTypeSelect,
    ColorStyleButton,
    CreateLinkButton,
    FormattingToolbar,
    FormattingToolbarController,
    NestBlockButton,
    TextAlignButton,
    UnnestBlockButton,
    } from '@blocknote/react';
import {FC} from 'react';
import "@blocknote/react/style.css";
import { cn } from '@/lib/utils';


interface Props {
    onChange:(val:string)=>void;
    announcement?:Announcement;
    editable:boolean;
}

const Editor:FC<Props> = ({onChange,announcement,editable}) => {
    const { theme } = useTheme();
    const editor: BlockNoteEditor = useCreateBlockNote({
        initialContent:announcement?JSON.parse(announcement.content) as PartialBlock[]:undefined,
    });
    
    
    return (
        <div className={cn(editable&&'p-5 border rounded')}>
            <BlockNoteView onChange={()=>onChange(JSON.stringify(editor.document,null,2))} editable={editable} editor={editor} theme={theme==='system'||theme==='dark'? 'dark':'light'} >
            <FormattingToolbarController
                formattingToolbar={() => (
                <FormattingToolbar>
                    <BlockTypeSelect key={"blockTypeSelect"} />
        
                    
        
                    <BasicTextStyleButton
                    basicTextStyle={"bold"}
                    key={"boldStyleButton"}
                    />
                    <BasicTextStyleButton
                    basicTextStyle={"italic"}
                    key={"italicStyleButton"}
                    />
                    <BasicTextStyleButton
                    basicTextStyle={"underline"}
                    key={"underlineStyleButton"}
                    />
                    <BasicTextStyleButton
                    basicTextStyle={"strike"}
                    key={"strikeStyleButton"}
                    />
                    {/* Extra button to toggle code styles */}
                    <BasicTextStyleButton
                    key={"codeStyleButton"}
                    basicTextStyle={"code"}
                    />
        
                    <TextAlignButton
                    textAlignment={"left"}
                    key={"textAlignLeftButton"}
                    />
                    <TextAlignButton
                    textAlignment={"center"}
                    key={"textAlignCenterButton"}
                    />
                    <TextAlignButton
                    textAlignment={"right"}
                    key={"textAlignRightButton"}
                    />
        
                    <ColorStyleButton key={"colorStyleButton"} />
        
                    <NestBlockButton key={"nestBlockButton"} />
                    <UnnestBlockButton key={"unnestBlockButton"} />
        
                    <CreateLinkButton key={"createLinkButton"} />
                </FormattingToolbar>
                )}
            />
            </BlockNoteView>
        </div>
    )
};

export default Editor;