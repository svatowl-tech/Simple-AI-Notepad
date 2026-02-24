import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  List,
  ListOrdered,
  Table as TableIcon,
  Trash2,
  Plus,
  Minus,
  Menu,
} from 'lucide-react';

interface ToolbarProps {
  editor: Editor | null;
  onToggleSidebar: () => void;
}

export const Toolbar = ({ editor, onToggleSidebar }: ToolbarProps) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] md:pb-2 bg-white dark:bg-gray-900 border-t md:border-t-0 md:border-b border-gray-200 dark:border-gray-700 shadow-[0_-1px_3px_rgba(0,0,0,0.05)] md:shadow-sm transition-colors overflow-x-auto whitespace-nowrap">
      <button
        onClick={onToggleSidebar}
        className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors flex-shrink-0"
        title="Menu"
      >
        <Menu size={18} />
      </button>
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 transition-colors md:hidden flex-shrink-0" />
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0 ${
          editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-800 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
        }`}
        title="Bold"
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0 ${
          editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-800 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
        }`}
        title="Italic"
      >
        <Italic size={18} />
      </button>
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 transition-colors flex-shrink-0" />
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0 ${
          editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-800 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
        }`}
        title="Heading 1"
      >
        <Heading1 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0 ${
          editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-800 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
        }`}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0 ${
          editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 dark:bg-gray-800 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
        }`}
        title="Heading 3"
      >
        <Heading3 size={18} />
      </button>
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 transition-colors flex-shrink-0" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0 ${
          editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-800 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
        }`}
        title="Bullet List"
      >
        <List size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0 ${
          editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-800 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
        }`}
        title="Ordered List"
      >
        <ListOrdered size={18} />
      </button>
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 transition-colors flex-shrink-0" />
      <button
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors flex-shrink-0"
        title="Insert Table"
      >
        <TableIcon size={18} />
      </button>
      {editor.can().deleteTable() && (
        <>
          <button
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors flex-shrink-0"
            title="Add Column After"
          >
            <Plus size={14} className="inline" /> Col
          </button>
          <button
            onClick={() => editor.chain().focus().deleteColumn().run()}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors flex-shrink-0"
            title="Delete Column"
          >
            <Minus size={14} className="inline" /> Col
          </button>
          <button
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors flex-shrink-0"
            title="Add Row After"
          >
            <Plus size={14} className="inline" /> Row
          </button>
          <button
            onClick={() => editor.chain().focus().deleteRow().run()}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors flex-shrink-0"
            title="Delete Row"
          >
            <Minus size={14} className="inline" /> Row
          </button>
          <button
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600 dark:text-red-400 transition-colors flex-shrink-0"
            title="Delete Table"
          >
            <Trash2 size={18} />
          </button>
        </>
      )}
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 transition-colors flex-shrink-0" />
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 transition-colors flex-shrink-0"
        title="Undo"
      >
        <Undo size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 transition-colors flex-shrink-0"
        title="Redo"
      >
        <Redo size={18} />
      </button>
      <div className="w-2 flex-shrink-0 md:hidden" />
    </div>
  );
};
