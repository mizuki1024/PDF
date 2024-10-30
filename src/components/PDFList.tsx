import React from 'react';
import { FileText, Plus, RefreshCw, Loader2 } from 'lucide-react';
import type { PDFDocument } from '../types';

interface PDFListProps {
  documents: PDFDocument[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onUpload: (file: File) => void;
  isSyncing: boolean;
  onRefresh: () => void;
}

export const PDFList: React.FC<PDFListProps> = ({
  documents,
  selectedId,
  onSelect,
  onUpload,
  isSyncing,
  onRefresh,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onUpload(file);
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Documents</h2>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            disabled={isSyncing}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            title="Sync with Google Drive"
          >
            {isSyncing ? (
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5 text-blue-600" />
            )}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isSyncing}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            title="Upload PDF"
          >
            <Plus className="w-5 h-5 text-blue-600" />
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="application/pdf"
          className="hidden"
        />
      </div>
      <div className="space-y-2">
        {documents.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onSelect(doc.id)}
            className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors ${
              selectedId === doc.id
                ? 'bg-blue-50 text-blue-600'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <FileText className="w-5 h-5 flex-shrink-0" />
            <span className="truncate text-sm text-left">{doc.name}</span>
          </button>
        ))}
        {documents.length === 0 && !isSyncing && (
          <p className="text-sm text-gray-500 text-center py-4">
            No documents found in Drive
          </p>
        )}
      </div>
    </div>
  );
};