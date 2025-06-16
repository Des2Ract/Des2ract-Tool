import { FC, useState,useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import AddProject from './pages/AddProject';
import JsonEditor from './pages/JsonEditor';
import ProjectView from './pages/ProjectView';
import axios from 'axios';

const formatFigmaName = (url:string) => {
  if (!url) return "Untitled Project";

  try {
    // Use the URL API to safely parse the link
    const path = new URL(url).pathname;

    // Split the path and get the last part, which is the file name
    const fileName = path.substring(path.lastIndexOf('/') + 1);

    // Decode characters like '%20', replace dashes, and return
    return decodeURIComponent(fileName).replace(/-/g, ' ');

  } catch (error) {
    // If the URL is invalid, return a fallback
    console.error("Invalid URL for Figma link:", url);
    return "Untitled Project";
  }
};

const App: FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'addProject' | 'TreeBuilder' | 'SemanticAssigner' | 'SemanticGrouper' | 'projectView'>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectData, setProjectData] = useState<{ figmaLink?: string; json1?: any; json2?: any; json3?: any; files?: { [key: string]: string } }>({});
  const [currentFiles, setCurrentFiles] = useState<{ [key: string]: string }>({});
  const [currentActiveFile, setCurrentActiveFile] = useState<string | null>(null);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  const handleAddProject = () => {
    setCurrentView('addProject');
    setProjectData({});
  };

  const handleProjectSelect = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProjectId(project.id);
      setCurrentFiles(project.files);
      setCurrentActiveFile(Object.keys(project.files)[0] || null);
      setCurrentView('projectView');
    }
  };

  const handleReturnSelect = () => {
      setCurrentView('dashboard');
  };

  const handleContinueFromAddProject = (figmaLink: string) => {
    setProjectData({ figmaLink });
    setCurrentView('TreeBuilder');
  };

  const handleContinueFromTreeBuilder = async (json1: any) => {
    setProjectData(prev => ({ ...prev, json1 }));
    setCurrentView('SemanticAssigner');
  };

  const handleContinueFromSemanticAssigner = async (json2: any) => {
    setProjectData(prev => ({ ...prev, json2 }));
    setCurrentView('SemanticGrouper');
  };

  useEffect(() => {
  const loadProjects = async () => {
    const projects = await window.electron.getProjects();
    setProjects(projects);
  };
  loadProjects();
}, []);

  const handleContinueFromSemanticGrouper = async (json3: any) => {
    try {
      // Call API to get zip file
      const response = await axios.post('http://localhost:5000/download', { json3 }, {
        responseType: 'arraybuffer'
      });
      
      // Create project
      const projectId = `project-${Date.now()}`;
      const projectName = formatFigmaName(projectData.figmaLink as string);
      
      // Unzip the project
      const unzipResult = await window.electron.unzipProject(projectId, response.data);

      const files = unzipResult.files;
      const projectPath = unzipResult.path;

      // Save project metadata
      const project : Project= {
        id: projectId,
        name: projectName,
        files: files as any,
        figmaLink: projectData.figmaLink || '',
        path: projectPath
      };
      
      await window.electron.saveProject(project, {});

      // Update state
      setProjects(prev => [...prev, project]);
      
      setCurrentProjectId(project.id);
      
      setCurrentFiles(project.files);
      
      setCurrentActiveFile(Object.keys(project.files)[0] || null);
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
        <AddProject onContinue={handleContinueFromAddProject} onReturnSelect={handleReturnSelect} />
      )}
      {currentView === 'TreeBuilder' && (
        <JsonEditor step={1} onContinue={handleContinueFromTreeBuilder} projectData={projectData} onReturnSelect={handleReturnSelect} />
      )}
      {currentView === 'SemanticAssigner' && (
        <JsonEditor step={2} onContinue={handleContinueFromSemanticAssigner} projectData={projectData} onReturnSelect={handleReturnSelect}/>
      )}
      {currentView === 'SemanticGrouper' && (
        <JsonEditor step={3} onContinue={handleContinueFromSemanticGrouper} projectData={projectData} onReturnSelect={handleReturnSelect}/>
      )}
      {currentView === 'projectView' && (
        <ProjectView
          projects={projects}
          setProjects={setProjects}
          currentProjectId={currentProjectId || ''}
          files={currentFiles}
          activeFile={currentActiveFile}
          setActiveFile={setCurrentActiveFile}
          setFiles={setCurrentFiles}
          onReturnSelect={handleReturnSelect}
        />
      )}
    </>
  );
};

export default App;