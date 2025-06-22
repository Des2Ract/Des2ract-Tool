import { FC, useEffect, useCallback, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import FileExplorer from './FileExplorer';
import debounce from 'lodash/debounce'; // Or implement your own debounce

interface EditorProps {
  project: Project;
  files: { [key: string]: string };
  setFiles: (files: { [key: string]: string }) => void;
  activeFile: string | null;
  setActiveFile: (file: string) => void;
}

const Editor: FC<EditorProps> = ({ 
  project, 
  activeFile, 
  setActiveFile,
  files,
  setFiles
}) => {
  

  // Debounced handler to limit state updates
  const debouncedHandleEditorChange = useCallback(
    debounce(async (value: string | undefined) => {
      if (activeFile && value !== undefined) {
        const updatedFiles = { ...files, [activeFile]: value };
        setFiles(updatedFiles);
        await window.electron.saveProject(project, { [activeFile]: value });
      }
    }, 300), // Adjust delay as needed
    [activeFile, files,project, setFiles]
  );

  return (
    <div style={{ 
        display: 'flex', 
        height: 'calc(100vh - 150px)', 
      }} className='bg-sidebar rounded-md'>
      <FileExplorer files={files} setActiveFile={setActiveFile} />
      <div style={{ flex: 1 }}>
        <MonacoEditor
          width="100%"
          height="100%"
          language="javascript"
          theme="vs-light"
          value={activeFile ? files[activeFile] : ''}
          onChange={debouncedHandleEditorChange}
          options={{ automaticLayout: true }}
        />
      </div>
    </div>
  );
};

export default Editor;