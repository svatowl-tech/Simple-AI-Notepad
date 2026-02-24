import { useEditor, EditorContent, Editor as TiptapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { useEffect, useCallback, useState } from 'react';
import { Toolbar } from './Toolbar';
import { improveText } from '../services/polzaService';
import { Document } from '../types';

interface EditorProps {
  apiKey: string;
  model: string;
  setIsImproving: (isImproving: boolean) => void;
  isImproving: boolean;
  onEditorReady: (editor: TiptapEditor | null) => void;
  onToggleSidebar: () => void;
  currentDoc: Document;
  onContentChange: (content: string) => void;
  onTitleChange: (title: string) => void;
}

export const Editor = ({ 
  apiKey, 
  model, 
  setIsImproving, 
  isImproving, 
  onEditorReady, 
  onToggleSidebar,
  currentDoc,
  onContentChange,
  onTitleChange
}: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: currentDoc.content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl dark:prose-invert mx-auto focus:outline-none min-h-[800px] p-8 bg-white dark:bg-gray-800 shadow-lg rounded-sm border border-gray-200 dark:border-gray-700 transition-colors',
      },
    },
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
  });

  // Update editor content when switching documents
  useEffect(() => {
    if (editor && editor.getHTML() !== currentDoc.content) {
      editor.commands.setContent(currentDoc.content);
    }
  }, [currentDoc.id, editor]); // Only run when doc ID changes

  useEffect(() => {
    onEditorReady(editor);
  }, [editor, onEditorReady]);

  const handleImprove = useCallback(async () => {
    if (!editor || !apiKey || isImproving) return;

    setIsImproving(true);
    try {
      const { state } = editor;
      const { selection } = state;
      const { from, to, empty } = selection;

      const marker = '[[POLZA_MARKER]]';
      let textToImprove = '';
      let mode: 'selection' | 'marker' | 'whole' = 'whole';
      let markerPos = -1;

      // Find marker
      state.doc.descendants((node, pos) => {
        if (node.isText && node.text?.includes(marker)) {
          markerPos = pos + node.text.indexOf(marker);
          return false; // stop searching
        }
      });

      if (!empty) {
        mode = 'selection';
        textToImprove = state.doc.textBetween(from, to, '\\n');
      } else if (markerPos !== -1) {
        mode = 'marker';
        const markerEndPos = markerPos + marker.length;
        textToImprove = state.doc.textBetween(markerEndPos, state.doc.content.size, '\\n');
      } else {
        mode = 'whole';
        textToImprove = state.doc.textBetween(0, state.doc.content.size, '\\n');
      }

      if (!textToImprove.trim()) {
        setIsImproving(false);
        return;
      }

      const improvedText = await improveText(textToImprove, model, apiKey);

      editor.chain().focus().command(({ tr }) => {
        if (mode === 'selection') {
          tr.insertText(improvedText, from, to);
        } else if (mode === 'marker') {
          // Delete everything from marker start to end of doc
          tr.delete(markerPos, tr.doc.content.size);
          // Insert improved text
          tr.insertText(improvedText, markerPos);
          // Insert marker at the very end
          tr.insertText('\\n\\n' + marker, tr.doc.content.size);
        } else {
          // Replace whole doc
          tr.delete(0, tr.doc.content.size);
          tr.insertText(improvedText, 0);
        }
        return true;
      }).run();

    } catch (error: any) {
      alert(`Error improving text: ${error.message}`);
    } finally {
      setIsImproving(false);
    }
  }, [editor, apiKey, model, isImproving, setIsImproving]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'Enter') {
        e.preventDefault();
        handleImprove();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleImprove]);

  useEffect(() => {
    const handleCustomImprove = () => handleImprove();
    window.addEventListener('trigger-improve', handleCustomImprove);
    return () => window.removeEventListener('trigger-improve', handleCustomImprove);
  }, [handleImprove]);

  return (
    <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900 overflow-hidden transition-colors">
      <div className="order-2 md:order-1 z-10">
        <Toolbar editor={editor} onToggleSidebar={onToggleSidebar} />
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-8 order-1 md:order-2">
        <div className="max-w-4xl mx-auto mb-4">
          <input
            type="text"
            value={currentDoc.title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full text-3xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 mb-4"
            placeholder="Document Title"
          />
        </div>
        <div className="max-w-4xl mx-auto">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};
