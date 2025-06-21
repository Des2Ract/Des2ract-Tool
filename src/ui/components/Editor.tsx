import { FC, useEffect, useCallback } from 'react';
import MonacoEditor from 'react-monaco-editor';
import FileExplorer from './FileExplorer';
import debounce from 'lodash/debounce'; // Or implement your own debounce

interface EditorProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  currentProjectId: string;
  files: { [key: string]: string };
  activeFile: string | null;
  setActiveFile: (file: string) => void;
  setFiles: (files: { [key: string]: string }) => void;
}

const Editor: FC<EditorProps> = ({ projects, setProjects, currentProjectId, files, activeFile, setActiveFile, setFiles }) => {
  const project = projects.find(p => p.id === currentProjectId) as Project;

  // Debounced handler to limit state updates
  const debouncedHandleEditorChange = useCallback(
    debounce(async (value: string | undefined) => {
      if (activeFile && value !== undefined) {
        const updatedFiles = { ...files, [activeFile]: value };
        setProjects(projects.map(p => p.id === currentProjectId ? { ...p, files: updatedFiles } : p));
        setFiles(updatedFiles);
        await window.electron.saveProject(project, { [activeFile]: value });
      }
    }, 300), // Adjust delay as needed
    [activeFile, files, projects, currentProjectId, project, setFiles, setProjects]
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