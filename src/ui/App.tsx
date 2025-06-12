import { FC, useState } from 'react';
import Dashboard from './pages/Dashboard';
import AddProject from './pages/AddProject';
import JsonEditor from './pages/JsonEditor';
import ProjectView from './pages/ProjectView';
import axios from 'axios';

interface Project {
  id: string;
  name: string;
  figmaLink: string;
  files: { [key: string]: string };
}

const App: FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'addProject' | 'jsonEditor1' | 'jsonEditor2' | 'jsonEditor3' | 'projectView'>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectData, setProjectData] = useState<{ figmaLink?: string; json1?: any; json2?: any; json3?: any; files?: { [key: string]: string } }>({});
  const [currentFiles, setCurrentFiles] = useState<{ [key: string]: string }>({});
  const [currentActiveFile, setCurrentActiveFile] = useState<string | null>(null);

  const handleAddProject = () => {
    setCurrentView('addProject');
    setProjectData({});
  };

  const handleProjectSelect = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentFiles(project.files);
      setCurrentActiveFile(Object.keys(project.files)[0] || null);
      setCurrentView('projectView');
    }
  };

  const handleContinueFromAddProject = (figmaLink: string) => {
    setProjectData({ figmaLink });
    setCurrentView('jsonEditor1');
  };

  const handleContinueFromJsonEditor1 = async (json1: any) => {
    setProjectData(prev => ({ ...prev, json1 }));
    setCurrentView('jsonEditor2');
  };

  const handleContinueFromJsonEditor2 = async (json2: any) => {
    setProjectData(prev => ({ ...prev, json2 }));
    setCurrentView('jsonEditor3');
  };

  const handleContinueFromJsonEditor3 = async (json3: any) => {
    try {
      // const response = await axios.post('/api/finalStep', { json3 });
      // const files = response.data.files; // Assuming API returns { files: { [key: string]: string } }
      // Mocking API response for final files
      const files = {
        'index.html': '<html><body><h1>Mock Project</h1></body></html>',
        'style.css': 'body { font-family: Arial; }',
        'script.js': 'console.log("Mock project loaded");',
      };
      const newProject = {
        id: `project-${Date.now()}`,
        name: `Project from ${projectData.figmaLink}`,
        figmaLink: projectData.figmaLink || '',
        files,
      };
      setProjects(prev => [...prev, newProject]);
      setCurrentFiles(files);
      setCurrentActiveFile(Object.keys(files)[0] || null);
      setCurrentView('projectView');
    } catch (error) {
      console.error('Error getting final files:', error);
    }
  };

  return (
    <>
      {currentView === 'dashboard' && (
        <Dashboard projects={projects} onAddProject={handleAddProject} onProjectSelect={handleProjectSelect} />
      )}
      {currentView === 'addProject' && (
        <AddProject onContinue={handleContinueFromAddProject} />
      )}
      {currentView === 'jsonEditor1' && (
        <JsonEditor step={1} onContinue={handleContinueFromJsonEditor1} projectData={projectData} />
      )}
      {currentView === 'jsonEditor2' && (
        <JsonEditor step={2} onContinue={handleContinueFromJsonEditor2} projectData={projectData} />
      )}
      {currentView === 'jsonEditor3' && (
        <JsonEditor step={3} onContinue={handleContinueFromJsonEditor3} projectData={projectData} />
      )}
      {currentView === 'projectView' && (
        <ProjectView
          files={currentFiles}
          activeFile={currentActiveFile}
          setActiveFile={setCurrentActiveFile}
          setFiles={setCurrentFiles}
        />
      )}
    </>
  );
};

export default App;