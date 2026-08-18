import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import ParagraphIndent from "./editor/ParagraphIndent";

function RichTextEditor({ content, onChange }) {
    const editor = useEditor({
        extensions: [StarterKit, ParagraphIndent],
        content,

        editorProps: {
            attributes: {
                class: "min-h-40 focus:outline-none",
            },
        },

        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content || "");
        }
    }, [content, editor]);

    return (
        <div className="border rounded-lg overflow-hidden bg-white">
            <div className="flex gap-2 border-b bg-gray-100 p-2">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className="rounded px-3 py-1 hover:bg-gray-200"
                >
                    <strong>B</strong>
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className="rounded px-3 py-1 hover:bg-gray-200"
                >
                    <em>I</em>
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className="rounded px-3 py-1 hover:bg-gray-200"
                >
                    H2
                </button>
            </div>

            <div className="min-h-48 p-3">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}

export default RichTextEditor;