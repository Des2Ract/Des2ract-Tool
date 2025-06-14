import { FC, useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';
import FileExplorer from './FileExplorer';

interface EditorProps {
  projects: Project[];
  currentProjectId: string;
  files: { [key: string]: string };
  activeFile: string | null;
  setActiveFile: (file: string) => void;
  setFiles: (files: { [key: string]: string }) => void;
}

const Editor: FC<EditorProps> = ({ projects,currentProjectId, files, activeFile, setActiveFile, setFiles }) => {
  const project = projects.find(p => p.id === currentProjectId) as Project;
  const handleEditorChange = async (value: string | undefined) => {
    if (activeFile && value !== undefined) {
      const updatedFiles = { ...files, [activeFile]: value };
      setFiles(updatedFiles);
      console.log('Saving changes to file:', activeFile); // Debugging line
      console.log('Project:', project); // Debugging line
      await window.electron.saveProject(project, { [activeFile]: value });
    }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 150px)', background: '#1e1e1e' }}>
      <FileExplorer files={files} setActiveFile={setActiveFile} />
      <div style={{ flex: 1 }}>
        <MonacoEditor
          width="100%"
          height="100%"
          language="javascript"
          theme="vs-dark"
          value={activeFile ? files[activeFile] : ''}
          onChange={handleEditorChange}
          options={{ automaticLayout: true }}
        />
      </div>
    </div>
  );
};

export default Editor;
