import { FC, useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';
import FileExplorer from './FileExplorer';
import axios, { AxiosResponse } from 'axios';

interface EditorProps {
  files: { [key: string]: string };
  activeFile: string | null;
  setActiveFile: (file: string) => void;
  setFiles: (files: { [key: string]: string }) => void;
}

const Editor: FC<EditorProps> = ({ files, activeFile, setActiveFile, setFiles }) => {
  const handleEditorChange = async (value: string | undefined) => {
    if (activeFile && value !== undefined) {
      const updatedFiles = { ...files, [activeFile]: value };
      setFiles(updatedFiles);
      try {
        await axios.post<unknown, AxiosResponse>('/api/update', { files: updatedFiles });
      } catch (error) {
        console.error('Error updating file:', error);
      }
    }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 150px)' }}>
      <FileExplorer files={files} setActiveFile={setActiveFile} />
      <MonacoEditor
        width="calc(100% - 250px)"
        height="100%"
        language="javascript"
        theme="vs-dark"
        value={activeFile ? files[activeFile] : ''}
        onChange={handleEditorChange}
        options={{ automaticLayout: true }}
      />
    </div>
  );
};

export default Editor;