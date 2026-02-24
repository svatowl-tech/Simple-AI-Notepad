import { Settings, Save, Download, Wand2, Moon, Sun, Trash2, X, FileText, Plus, Upload } from 'lucide-react';
import { exportToDocx } from '../utils/exportDocx';
import { Editor } from '@tiptap/react';
import { Document } from '../types';
import * as mammoth from 'mammoth';
import { useRef } from 'react';

interface SidebarProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  model: string;
  setModel: (model: string) => void;
  onImprove: () => void;
  isImproving: boolean;
  editor: Editor | null;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  onClose?: () => void;
  documents: Document[];
  currentDocId: string;
  onSelectDocument: (id: string) => void;
  onCreateDocument: () => void;
  onDeleteDocument: (id: string) => void;
  onImportDocument: (title: string, content: string) => void;
}

const MODELS = [
  { id: 'qwen/qwen3-30b-a3b-thinking-2507', name: 'Qwen3 30B (Main)' },
  { id: 'meta-llama/llama-4-scout', name: 'Llama 4 Scout' },
  { id: 'amazon/nova-lite-v1', name: 'Nova Lite v1' },
  { id: 'google/gemini-2.0-flash-lite-001', name: 'Gemini 2.0 Flash Lite' },
  { id: 'mistralai/devstral-2512', name: 'Mistral Devstral' },
];

export const Sidebar = ({
  apiKey,
  setApiKey,
  model,
  setModel,
  onImprove,
  isImproving,
  editor,
  isDarkMode,
  setIsDarkMode,
  onClose,
  documents,
  currentDocId,
  onSelectDocument,
  onCreateDocument,
  onDeleteDocument,
  onImportDocument,
}: SidebarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleExport = () => {
    if (editor) {
      exportToDocx(editor.getHTML(), 'Polza_Document.docx');
    }
  };

  const handleExportTxt = () => {
    if (editor) {
      const text = editor.getText();
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Polza_Document.txt';
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const title = file.name.replace(/\.[^/.]+$/, "");

    try {
      if (file.name.endsWith('.txt')) {
        const text = await file.text();
        const html = text.split('\n').map(line => `<p>${line}</p>`).join('');
        onImportDocument(title, html);
      } else if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        onImportDocument(title, result.value);
      } else {
        alert('Unsupported file format. Please upload .txt or .docx');
      }
    } catch (error) {
      console.error('Error importing document:', error);
      alert('Failed to import document.');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="w-80 max-w-[85vw] bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 h-full flex flex-col shadow-inner transition-colors">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-900 transition-colors">
        <div className="flex items-center gap-2">
          <Settings size={20} className="text-gray-600 dark:text-gray-400" />
          <h2 className="font-semibold text-gray-800 dark:text-gray-200">AI Settings</h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
              title="Close Settings"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Documents</h3>
            <div className="flex gap-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                title="Import Document (.txt, .docx)"
              >
                <Upload size={16} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImport}
                accept=".txt,.docx"
                className="hidden"
              />
              <button
                onClick={onCreateDocument}
                className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                title="New Document"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={`flex items-center justify-between group p-2 rounded-md cursor-pointer transition-colors ${
                  doc.id === currentDocId
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => onSelectDocument(doc.id)}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText size={14} className="flex-shrink-0" />
                  <span className="text-sm truncate">{doc.title}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this document?')) {
                      onDeleteDocument(doc.id);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 rounded transition-all"
                  title="Delete Document"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Polza.ai API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm bg-white dark:bg-gray-700 dark:text-white transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            AI Model
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm bg-white dark:bg-gray-700 dark:text-white transition-colors"
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
          <button
            onClick={onImprove}
            disabled={isImproving || !apiKey}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isImproving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Wand2 size={18} />
            )}
            {isImproving ? 'Improving...' : 'Improve Text (Alt+Enter)'}
          </button>
          {!apiKey && (
            <p className="text-xs text-red-500 text-center">
              Please enter an API key to use AI features.
            </p>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 space-y-3 transition-colors">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Document</h3>
        <button
          onClick={() => {
            if (editor && window.confirm('Are you sure you want to clear the document?')) {
              editor.commands.clearContent();
            }
          }}
          className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-md transition-colors text-sm shadow-sm"
        >
          <Trash2 size={16} />
          Clear Document
        </button>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mt-4">Export</h3>
        <button
          onClick={handleExport}
          className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md transition-colors text-sm shadow-sm"
        >
          <Download size={16} />
          Export as DOCX
        </button>
        <button
          onClick={handleExportTxt}
          className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md transition-colors text-sm shadow-sm"
        >
          <Save size={16} />
          Export as TXT
        </button>
      </div>
    </div>
  );
};
