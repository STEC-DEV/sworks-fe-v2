"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const COLORS = ["#000000", "#e03131", "#2f9e44", "#1971c2", "#f08c00"];

export const TextEditor = ({ value, onChange }: TextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Link.configure({ openOnClick: false }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      // HTML 문자열로 반환 → z.string() 스키마와 호환
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* 툴바 */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`px-2 py-1 text-sm rounded ${editor?.isActive("bold") ? "bg-gray-200 font-bold" : "hover:bg-gray-100"}`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 text-sm rounded italic ${editor?.isActive("italic") ? "bg-gray-200" : "hover:bg-gray-100"}`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 text-sm rounded underline ${editor?.isActive("underline") ? "bg-gray-200" : "hover:bg-gray-100"}`}
        >
          U
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 text-sm rounded ${editor?.isActive("bulletList") ? "bg-gray-200" : "hover:bg-gray-100"}`}
        >
          • 목록
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 text-sm rounded ${editor?.isActive("orderedList") ? "bg-gray-200" : "hover:bg-gray-100"}`}
        >
          1. 목록
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        {/* 색상 선택 */}
        {COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => editor?.chain().focus().setColor(color).run()}
            className="w-6 h-6 rounded-full border border-gray-300"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* 에디터 본문 */}
      <EditorContent
        editor={editor}
        className="prose max-w-none p-3 min-h-[240px] focus-within:outline-none"
      />
    </div>
  );
};
