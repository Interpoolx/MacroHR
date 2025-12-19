import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { useState, useEffect } from 'react'
import { FileCode, Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Code, Minus, Undo, Redo } from 'lucide-react'

const MenuBar = ({ editor, isSourceMode, toggleSource }: { editor: any, isSourceMode: boolean, toggleSource: () => void }) => {
    if (!editor) return null

    // Helper to render button
    const Btn = ({ icon: Icon, onClick, isActive, title }: any) => (
        <button
            onClick={(e) => { e.preventDefault(); onClick() }}
            className={`p-1.5 rounded-md transition-colors ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
            title={title}
            disabled={isSourceMode && title !== 'Source Code'} // Disable formatting in source mode
        >
            <Icon size={18} />
        </button>
    )

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-white rounded-t-lg sticky top-0 z-10">
            <Btn icon={Bold} title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} />
            <Btn icon={Italic} title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} />
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <Btn icon={Heading1} title="H1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} />
            <Btn icon={Heading2} title="H2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} />
            <Btn icon={Heading3} title="H3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} />
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <Btn icon={List} title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} />
            <Btn icon={ListOrdered} title="Ordered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} />
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <Btn icon={Quote} title="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} />
            <Btn icon={Code} title="Code" onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} />
            <Btn icon={Minus} title="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()} isActive={false} />
            <div className="flex-1" />
            <Btn icon={Undo} title="Undo" onClick={() => editor.chain().focus().undo().run()} isActive={false} />
            <Btn icon={Redo} title="Redo" onClick={() => editor.chain().focus().redo().run()} isActive={false} />
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <button
                onClick={(e) => { e.preventDefault(); toggleSource() }}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-bold transition-colors ${isSourceMode ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
                <FileCode size={14} />
                {isSourceMode ? 'Visual' : 'Source'}
            </button>
        </div>
    )
}

export default function TiptapEditor({ content, onChange, minHeight = '300px' }: { content: string, onChange: (html: string) => void, minHeight?: string }) {
    const [isSourceMode, setIsSourceMode] = useState(false)
    const [sourceContent, setSourceContent] = useState(content)

    // Sync content updates when swapping modes is handled by logic below, 
    // but we need to keep local sourceContent state in sync for the textarea.
    useEffect(() => {
        setSourceContent(content)
    }, [content])

    const editor = useEditor({
        extensions: [
            StarterKit.configure(),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline cursor-pointer',
                },
            }),
        ],
        content: content,
        editorProps: {
            attributes: {
                class: `tiptap-editor prose max-w-none p-4 focus:outline-none`,
                style: `min-height: ${minHeight}`
            }
        },
        onUpdate: ({ editor }) => {
            // Only fire onChange if we NOT in source mode (visual edits)
            if (!isSourceMode) {
                const html = editor.getHTML()
                onChange(html)
                setSourceContent(html)
            }
        },
    })

    const toggleSource = () => {
        if (isSourceMode) {
            // Switching FROM Source TO Visual
            // Update editor with the text area content
            editor?.commands.setContent(sourceContent)
            onChange(sourceContent) // Sync up parent
        } else {
            // Switching FROM Visual TO Source
            // Get latest visual content (already wrapped in onUpdate usually, but ensure fresh)
            const html = editor?.getHTML() || ''
            setSourceContent(html)
        }
        setIsSourceMode(!isSourceMode)
    }

    const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value
        setSourceContent(val)
        onChange(val) // Sync parent immediately so saving works in source mode
    }

    return (
        <div className="border border-gray-200 rounded-lg bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all flex flex-col overflow-hidden">
            <MenuBar editor={editor} isSourceMode={isSourceMode} toggleSource={toggleSource} />

            {isSourceMode ? (
                <textarea
                    value={sourceContent}
                    onChange={handleSourceChange}
                    className="w-full p-4 font-mono text-sm bg-gray-50 text-gray-800 outline-none resize-none"
                    style={{ minHeight }}
                    spellCheck={false}
                />
            ) : (
                <div className="h-full cursor-text" style={{ minHeight }} onClick={() => editor?.chain().focus().run()}>
                    <EditorContent editor={editor} />
                </div>
            )}
        </div>
    )
}
