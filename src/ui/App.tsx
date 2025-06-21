import { FC, useState,useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import AddProject from './pages/AddProject';
import axios from 'axios';
import './index.css';
import './App.css'
import RedundantGroupsView from './pages/PreBuilder';
import { GroupItem } from '@/lib/types';
import TreebuilderResultsView from './pages/TreeBuilder';
import SemanticAssignerView from './pages/SematicAssigner';
import SemanticGrouperView from './pages/SemanticGrouper';
import ProjectView from './pages/ProjectView';

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

const screenNames = [
  'Dashboard',
  'Add Project',
  'Pre Tree Builder',
  'Tree Builder',
  'Semantic Assigner',
  'Semantic Grouper',
  'Project View'
]

const App: FC = () => {
  const [currentView, setCurrentView] = useState<number>(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectUrl, setProjectUrl] = useState<string>('');
  
  const [keepGroups, setKeepGroups] = useState<GroupItem[]>([]); 
  const [designSvg, setDesignSvg] = useState<string>('');
  const [designTree, setDesignTree] = useState<any>(null);
  const [semanticTree, setSemanticTree] = useState<any>(null);
  const [groupedTree, setGroupedTree] = useState<any>(null);
  
  const [currentFiles, setCurrentFiles] = useState<{ [key: string]: string }>({});
  const [currentActiveFile, setCurrentActiveFile] = useState<string | null>(null);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  const handleProjectSelect = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProjectId(project.id);
      setCurrentFiles(project.files);
      setCurrentActiveFile(Object.keys(project.files)[0] || null);
      setCurrentView( screenNames.indexOf('Project View') );
    }
  };

  const handleReturnSelect = () => {
      setCurrentView( screenNames.indexOf('Dashboard') );
  };

  useEffect(() => {
    const loadProjects = async () => {
      const projects = await window.electron.getProjects();
      setProjects(projects);
    };
    loadProjects();
  }, []);

  const handleContinueFromSemanticGrouper = async (finalTree: any) => {
    try {
      // Call API to get zip file
      const response = await axios.post('http://localhost:5000/download', { finalTree }, {
        responseType: 'arraybuffer'
      });
      
      // Create project
      const projectId = `project-${Date.now()}`;
      const projectName = formatFigmaName(projectUrl as string);
      
      // Unzip the project
      const unzipResult = await window.electron.unzipProject(projectId, response.data);

      const files = unzipResult.files;
      const projectPath = unzipResult.path;

      // Save project metadata
      const project : Project= {
        id: projectId,
        name: projectName,
        files: files as any,
        figmaLink: projectUrl || '',
        path: projectPath
      };
      
      await window.electron.saveProject(project, {});

      // Update state
      setProjects(prev => [...prev, project]);
      
      setCurrentProjectId(project.id);
      
      setCurrentFiles(project.files);
      
      setCurrentActiveFile(Object.keys(project.files)[0] || null);

      setCurrentView(screenNames.indexOf('Project View'));
      
    } catch (error) {
      console.error('Error getting final files:', error);
    }
  };

  return (
    <main className='h-screen flex bg-white '>   
      {currentView === 0 && (
        <Dashboard projects={projects} 
          onAddProject={() => { 
            setCurrentView( screenNames.indexOf('Add Project') ); 
            setProjectUrl(''); 
          }} 
          onProjectSelect={handleProjectSelect} 
        />
      )}

      {currentView === 1 && (
        <AddProject 
          onContinue={(url: string) => { 
            setProjectUrl(url); 
            setCurrentView( screenNames.indexOf('Pre Tree Builder') ); 
          }} 
          onBackPressed={() => { setCurrentView( screenNames.indexOf('Dashboard') ); }}
          onHomePressed={() => { setCurrentView( screenNames.indexOf('Dashboard') ); }} 
        />
      )}

      {currentView === 2 && (
        <RedundantGroupsView 
          figmaUrl={projectUrl} 
          onContinue={(keep: GroupItem[], svg: string) => { 
            setKeepGroups(keep); 
            setDesignSvg(svg); 
            setCurrentView( screenNames.indexOf('Tree Builder') ); 
          }} 
          onBackPressed={() => { setCurrentView( screenNames.indexOf('Add Project') ); }}
          onHomePressed={() => { setCurrentView( screenNames.indexOf('Dashboard') ); }}
        />
      )}
     
      {currentView === 3 && (
        <TreebuilderResultsView 
          figmaUrl={projectUrl} 
          svg={designSvg}
          keepGroups={keepGroups}
          onContinue={(designTree: any) => { 
            setDesignTree(designTree); 
            setCurrentView( screenNames.indexOf('Semantic Assigner') ); 
          }} 
          onBackPressed={() => { setCurrentView( screenNames.indexOf('Pre Tree Builder') ); }}
          onHomePressed={() => { setCurrentView( screenNames.indexOf('Dashboard') ); }}
        />
      )}
     
      {currentView === 4 && (
        <SemanticAssignerView 
          pageTree={designTree}
          svg={designSvg}
          onContinue={(semanticTree: any) => {
            setSemanticTree(semanticTree);
            setCurrentView(screenNames.indexOf('Semantic Grouper'));
          }}
          onBackPressed={() => { setCurrentView( screenNames.indexOf('Tree Builder') ); }}
          onHomePressed={() => { setCurrentView( screenNames.indexOf('Dashboard') ); }}  
        />
      )}
     
      {currentView === 5 && (
        <SemanticGrouperView 
          pageTree={semanticTree}
          svg={designSvg}
          onContinue={(componentsTree: any) => {
            setGroupedTree(componentsTree);
            handleContinueFromSemanticGrouper(componentsTree);
          }}  
          onBackPressed={() => { setCurrentView( screenNames.indexOf('Semantic Assigner') ); }}
          onHomePressed={() => { setCurrentView( screenNames.indexOf('Dashboard') ); }}
        />
      )}
     
      {currentView === 6 && (
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
    </main>
  );
};

export default App;