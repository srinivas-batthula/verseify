"use client";

import {
    List, Heading1, Heading2, Heading3, Code, Bold, Italic, Strikethrough, AlignCenter, AlignLeft,
    AlignRight, Highlighter, ListOrdered, Undo, Redo, Underline
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import UnderlineExtension from "@tiptap/extension-underline";
import EmojiPicker from "emoji-picker-react";
import * as React from 'react'
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva } from "class-variance-authority";
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { useState, useEffect } from "react";
import '../styles/editor.css'
import useThemeStore from "@/stores/useThemeStore";



function cn(...inputs) {
    return twMerge(clsx(inputs))
}

const toggleVariants = cva(
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-primary   data-[state=on]:text-primary-foreground",
    {
        variants: {
            variant: {
                default: "bg-transparent",
                outline:
                    "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
            },
            size: {
                default: "h-9 px-3",
                sm: "h-8 px-2",
                lg: "h-10 px-3",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const Toggle = React.forwardRef(
    ({ className, variant, size, ...props }, ref) => (
        <TogglePrimitive.Root
            ref={ref}
            className={cn(toggleVariants({ variant, size, className }))}
            {...props}
        />
    )
);


// Toolbar Component
function ToolBar({ editor, onEmojiSelect, isSaving }) {
    if (!editor) return null;

    const Options = [
        { icon: <Heading1 />, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive("heading", { level: 1 }) },
        { icon: <Heading2 />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
        { icon: <Heading3 />, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
        { icon: <Bold />, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
        { icon: <Italic />, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
        { icon: <Strikethrough />, action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive("strike") },
        { icon: <Underline />, action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive("underline") },
        { icon: <AlignLeft />, action: () => editor.chain().focus().setTextAlign("left").run(), active: editor.isActive({ textAlign: "left" }) },
        { icon: <AlignCenter />, action: () => editor.chain().focus().setTextAlign("center").run(), active: editor.isActive({ textAlign: "center" }) },
        { icon: <AlignRight />, action: () => editor.chain().focus().setTextAlign("right").run(), active: editor.isActive({ textAlign: "right" }) },
        { icon: <List />, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
        { icon: <ListOrdered />, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
        { icon: <Code />, action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive("code") },
        { icon: <Highlighter />, action: () => editor.chain().focus().toggleHighlight().run(), active: editor.isActive("highlight") },
        { icon: <Undo />, action: () => editor.chain().focus().undo().run(), active: false },
        { icon: <Redo />, action: () => editor.chain().focus().redo().run(), active: false },
    ];

    return (
        <div className="border rounded-md p-2 bg-white text-black flex gap-2 flex-wrap shadow-md">
            {Options.map((option, i) => (
                <Toggle
                    key={i}
                    size="sm"
                    pressed={option.active}
                    onPressedChange={option.action}
                    className={`p-2 rounded-md transition-all duration-300 
                        ${option.active ? "bg-gray-300" : "bg-white"} 
                        hover:bg-gray-400`}
                >
                    {option.icon}
                </Toggle>
            ))}
            {/* Emoji Picker Button */}
            <button
                onClick={onEmojiSelect}
                className="p-2 rounded-md transition-all duration-300 bg-white text-black hover:bg-black hover:text-white"
                title="emoji's"
            >
                😀
            </button>
            {/* Auto Save Indicator */}
            <i title="Auto Save" className={`fa-solid fa-cloud-arrow-down ml-auto w-6 h-6 fs-4 mr-1 transition-all duration-300 ${
                    isSaving ? "text-green-400 shadow-green-500" : "text-gray-500"
                }`}>
            </i>
        </div>
    );
}


// CustomEditor Component
export default function Post() {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [title, setTitle] = useState(typeof window !== 'undefined' ? () => localStorage.getItem("blogTitle") : "");
    const [tags, setTags] = useState(typeof window !== 'undefined' ? () => localStorage.getItem("blogTags") : "");
    const [file, setFile] = useState(null);
    const [content, setContent] = useState(typeof window !== 'undefined' ? () => localStorage.getItem("blogContent") : "");
    const {theme} = useThemeStore()


    // Auto-save effect
    useEffect(() => {
        if (content !== typeof window !== 'undefined' ? localStorage.getItem("blogContent") : '') {
            setIsSaving(true);
            typeof window !== 'undefined' ? localStorage.setItem("blogContent", content) : null;
            setTimeout(() => setIsSaving(false), 500); // Delay save icon change
        }
    }, [content]);
    useEffect(() => {
        if (title !== typeof window !== 'undefined' ? localStorage.getItem("blogTitle") : '') {
            setIsSaving(true);
            typeof window !== 'undefined' ? localStorage.setItem("blogTitle", title) : null;
            setTimeout(() => setIsSaving(false), 500); // Delay save icon change
        }
    }, [title]);
    useEffect(() => {
        if (tags !== typeof window !== 'undefined' ? localStorage.getItem("blogTags") : '') {
            setIsSaving(true);
            typeof window !== 'undefined' ? localStorage.setItem("blogTags", tags) : null;
            setTimeout(() => setIsSaving(false), 500); // Delay save icon change
        }
    }, [tags]);


    const editor = useEditor({
        extensions: [
            StarterKit.configure(),
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Heading.configure({ levels: [1, 2, 3] }),
            OrderedList.configure({ HTMLAttributes: { class: "list-decimal ml-3" } }),
            BulletList.configure({ HTMLAttributes: { class: "list-disc ml-3" } }),
            Highlight,
            UnderlineExtension,
        ],
        content,
        editorProps: {
            attributes: { class: "h-72 border rounded-lg bg-white text-black py-3 px-3 shadow" },
        },
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        },
    });

    // Set editor content from localStorage after it initializes
    useEffect(() => {
        if (editor && !editor.isDestroyed) {
            editor.commands.setContent(content);
        }
    }, [editor]);

    // Add Emoji Function
    const addEmoji = (emojiObject) => {
        if (editor) {
            editor.chain().focus().insertContent(emojiObject.emoji).run();
        }
        setShowEmojiPicker(false);
    };


    return (
        <div className="main relative flex flex-column justify-content-center align-content-center justify-items-center top-1">

            <div className="head">Create Post</div>

            {/* Title Input */}
            <input
                type="text"
                className="title-input"
                placeholder="Enter post title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{color: 'black'}}
                title="post title"
            />

            {/* Tags Input */}
            <input
                type="text"
                className="tags-input"
                placeholder="#tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                style={{color: 'black'}}
                title="post tags"
            />

            <div style={{ width: '90px', height: '100px', margin: '0.5rem', left: '5%' }}>
                {
                    file && (
                        file.type.startsWith("image/") ? (<div><img width='300' src={URL.createObjectURL(file)} alt="Uploaded" /></div>) : file.type.startsWith("video/") ? (<div ><video controls src={URL.createObjectURL(file)}></video></div>) : file.type === "application/pdf" ? (<div ><a href={URL.createObjectURL(file)} target="_blank">📄 View PDF</a></div>) : (<div ></div>)
                    )
                }
            </div>

            {/* Media Input */}
            <div className="input-group mb-4 mt-2 media" title="post media upload" style={{ marginLeft: '0', left: '0' }}>
                <label className="input-group-text" htmlFor="inputGroupFile01">Upload</label>
                <input onChange={(e) => setFile(e.target.files[0])} type="file" className="form-control" id="inputGroupFile01" />
            </div>

            <div className="editor" title="markdown post editor" style={{color: 'black'}}>
                <ToolBar
                    editor={editor}
                    onEmojiSelect={() => setShowEmojiPicker(!showEmojiPicker)}
                    isSaving={isSaving}
                />
                {showEmojiPicker && (
                    <div className="absolute top-12 left-0 z-10 bg-white shadow-md rounded-md p-2">
                        <EmojiPicker onEmojiClick={addEmoji} />
                    </div>
                )}

                <div title="post preview content">
                    <EditorContent editor={editor} className="mt-1 h-72 overflow-y-auto overflow-x-hidden" />
                </div>
            </div>

            <button className="btn" title="create post">Create</button>
        </div>
    )
}
