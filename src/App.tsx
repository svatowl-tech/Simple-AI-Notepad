import { useState, useEffect } from 'react';
import { Editor } from './components/Editor';
import { Sidebar } from './components/Sidebar';
import { Editor as TiptapEditor } from '@tiptap/react';
import { Document } from './types';

const DEFAULT_DOC: Document = {
  id: 'default',
  title: 'Untitled Document',
  content: '<p>Start typing here...</p>',
  updatedAt: Date.now(),
};

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('polza-api-key') || '');
  const [model, setModel] = useState(() => localStorage.getItem('polza-model') || 'qwen/qwen3-30b-a3b-thinking-2507');
  const [isImproving, setIsImproving] = useState(false);
  const [editor, setEditor] = useState<TiptapEditor | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('polza-dark-mode') === 'true');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Document Management
  const [documents, setDocuments] = useState<Document[]>(() => {
    const saved = localStorage.getItem('polza-documents');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse documents', e);
      }
    }
    // Migrate old content if exists
    const oldContent = localStorage.getItem('polza-docs-content');
    if (oldContent) {
      return [{ ...DEFAULT_DOC, content: oldContent }];
    }
    return [DEFAULT_DOC];
  });

  const [currentDocId, setCurrentDocId] = useState<string>(() => {
    const saved = localStorage.getItem('polza-current-doc-id');
    return saved || documents[0]?.id || 'default';
  });

  useEffect(() => {
    localStorage.setItem('polza-documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('polza-current-doc-id', currentDocId);
  }, [currentDocId]);

  useEffect(() => {
    localStorage.setItem('polza-api-key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('polza-model', model);
  }, [model]);

  useEffect(() => {
    localStorage.setItem('polza-dark-mode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleImprove = () => {
    window.dispatchEvent(new Event('trigger-improve'));
  };

  const currentDoc = documents.find((d) => d.id === currentDocId) || documents[0];

  const handleContentChange = (content: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === currentDocId ? { ...doc, content, updatedAt: Date.now() } : doc
      )
    );
  };

  const handleTitleChange = (title: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === currentDocId ? { ...doc, title, updatedAt: Date.now() } : doc
      )
    );
  };

  const createDocument = () => {
    const newDoc: Document = {
      id: crypto.randomUUID(),
      title: 'New Document',
      content: '<p>Start typing here...</p>',
      updatedAt: Date.now(),
    };
    setDocuments((prev) => [newDoc, ...prev]);
    setCurrentDocId(newDoc.id);
    setIsSidebarOpen(false);
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => {
      const filtered = prev.filter((d) => d.id !== id);
      if (filtered.length === 0) {
        const newDoc = { ...DEFAULT_DOC, id: crypto.randomUUID() };
        setCurrentDocId(newDoc.id);
        return [newDoc];
      }
      if (id === currentDocId) {
        setCurrentDocId(filtered[0].id);
      }
      return filtered;
    });
  };

  const importDocument = (title: string, content: string) => {
    const newDoc: Document = {
      id: crypto.randomUUID(),
      title,
      content,
      updatedAt: Date.now(),
    };
    setDocuments((prev) => [newDoc, ...prev]);
    setCurrentDocId(newDoc.id);
    setIsSidebarOpen(false);
  };

  return (
    <div className={`flex h-[100dvh] w-full font-sans overflow-hidden transition-colors relative ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Editor
        apiKey={apiKey}
        model={model}
        isImproving={isImproving}
        setIsImproving={setIsImproving}
        onEditorReady={setEditor}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        currentDoc={currentDoc}
        onContentChange={handleContentChange}
        onTitleChange={handleTitleChange}
      />

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <Sidebar
          apiKey={apiKey}
          setApiKey={setApiKey}
          model={model}
          setModel={setModel}
          onImprove={handleImprove}
          isImproving={isImproving}
          editor={editor}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onClose={() => setIsSidebarOpen(false)}
          documents={documents}
          currentDocId={currentDocId}
          onSelectDocument={(id) => {
            setCurrentDocId(id);
            setIsSidebarOpen(false);
          }}
          onCreateDocument={createDocument}
          onDeleteDocument={deleteDocument}
          onImportDocument={importDocument}
        />
      </div>
    </div>
  );
}
