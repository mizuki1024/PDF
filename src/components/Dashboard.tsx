import React from 'react';
import { PDFList } from './PDFList';
import { PDFViewer } from './PDFViewer';
import { Summary } from './Summary';
import { Notes } from './Notes';
import { useAuth } from '../context/AuthContext';
import type { PDFDocument } from '../types';

export const Dashboard: React.FC = () => {
  const { driveService } = useAuth();
  const [documents, setDocuments] = React.useState<PDFDocument[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [pdfText, setPdfText] = React.useState<string>('');
  const [hasAPIKey, setHasAPIKey] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);

  const selectedDocument = documents.find((doc) => doc.id === selectedId);

  const syncWithDrive = React.useCallback(async () => {
    if (!driveService) return;

    try {
      setIsSyncing(true);
      const files = await driveService.listPDFs();
      const newDocs: PDFDocument[] = files.map((file: any) => ({
        id: file.id,
        name: file.name,
        url: file.webViewLink,
        summary: '',
        notes: [],
      }));
      setDocuments(newDocs);
    } catch (error) {
      console.error('Failed to sync with Drive:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [driveService]);

  React.useEffect(() => {
    syncWithDrive();
  }, [syncWithDrive]);

  const handleFileUpload = async (file: File) => {
    if (!driveService) return;

    try {
      setIsSyncing(true);
      const uploadedFile = await driveService.uploadPDF(file);
      const newDoc: PDFDocument = {
        id: uploadedFile.id,
        name: uploadedFile.name,
        url: uploadedFile.webViewLink,
        summary: '',
        notes: [],
      };
      setDocuments(prev => [...prev, newDoc]);
      setSelectedId(newDoc.id);
      setPdfText('');
    } catch (error) {
      console.error('Failed to upload file:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSummaryChange = (summary: string) => {
    if (!selectedId) return;
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === selectedId ? { ...doc, summary } : doc
      )
    );
  };

  const handleAddNote = (content: string) => {
    if (!selectedId) return;
    const newNote = {
      id: crypto.randomUUID(),
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === selectedId
          ? { ...doc, notes: [...doc.notes, newNote] }
          : doc
      )
    );
  };

  const handleDeleteNote = (noteId: string) => {
    if (!selectedId) return;
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === selectedId
          ? { ...doc, notes: doc.notes.filter((note) => note.id !== noteId) }
          : doc
      )
    );
  };

  const handleTextExtracted = (text: string) => {
    setPdfText(text);
  };

  const handleSetAPIKey = (apiKey: string) => {
    localStorage.setItem('openai_api_key', apiKey);
    setHasAPIKey(true);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <PDFList
        documents={documents}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onUpload={handleFileUpload}
        isSyncing={isSyncing}
        onRefresh={syncWithDrive}
      />
      
      {selectedDocument ? (
        <div className="flex-1 p-6 overflow-hidden">
          <div className="grid grid-cols-2 gap-6 h-full">
            <div className="space-y-6">
              <Summary
                document={selectedDocument}
                onSummaryChange={handleSummaryChange}
                pdfText={pdfText}
                onSetAPIKey={handleSetAPIKey}
                hasAPIKey={hasAPIKey}
              />
              <Notes
                notes={selectedDocument.notes}
                onAddNote={handleAddNote}
                onDeleteNote={handleDeleteNote}
              />
            </div>
            <PDFViewer 
              url={selectedDocument.url}
              onTextExtracted={handleTextExtracted}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <p>PDFファイルを選択またはアップロードしてください</p>
        </div>
      )}
    </div>
  );
};