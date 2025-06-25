import { FC, useState,useEffect, useMemo } from 'react';
import Dashboard from './pages/Dashboard';
import AddProject from './pages/AddProject';
import axios from 'axios';
// import '@patternfly/react-core/dist/styles/base.css';
import './index.css';
import './App.css'
import RedundantGroupsView from './pages/PreBuilder';
import { GroupItem } from '@/lib/types';
import TreebuilderResultsView from './pages/TreeBuilder';
import SemanticAssignerView from './pages/SematicAssigner';
import SemanticGrouperView from './pages/SemanticGrouper';
import ProjectView from './pages/ProjectView';
import ProjectCreationPage from './pages/ProjectCreation';
import { TestTree } from '@/lib/test-tree';

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
  'Code Generation',
  'Project View'
]

const App: FC = () => {
  const [currentView, setCurrentView] = useState<number>(0);
  const [projectUrl, setProjectUrl] = useState<string>("https://www.figma.com/design/QpKlDdGRvg7DRe9NvXQRtZ/PUBLIC-SPACE--Community-?node-id=18-7&t=mYWUvhwY38oOJ5cO-0");
  
  const [keepGroups, setKeepGroups] = useState<GroupItem[]>([]); 
  const [designSvg, setDesignSvg] = useState<string>('');
  const [designTree, setDesignTree] = useState<any>(null);
  const [semanticTree, setSemanticTree] = useState<any>(null);
  const [groupedTree, setGroupedTree] = useState<any>(null);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectName, setCurrentProjectName] = useState<string | null>(null);

  const handleProjectSelect = (projectName: string) => {
    setCurrentProjectName(projectName);
    setCurrentView( screenNames.indexOf('Project View') );
  };

  const handleReturnSelect = () => {
      setCurrentView( screenNames.indexOf('Dashboard') );
  };

  useEffect(() => {
    const loadProjects = async () => {
      const projects = JSON.parse(localStorage.getItem('projects') ?? "[]");
      setProjects(projects);
    };
    loadProjects();
  }, []);

  const handleContinueFromSemanticGrouper = async (finalTree: any) => {
    setGroupedTree(finalTree);
    setCurrentView( screenNames.indexOf('Code Generation') );
  }

  const handleGenerateProjectFinished = async (projectName: string) => {
    try {
      const updatedProjects : Project[] = JSON.parse( localStorage.getItem('projects') ?? "[]" );

      setProjects(updatedProjects);
      setCurrentProjectName(projectName);
      setCurrentView(screenNames.indexOf('Project View'));

    } catch (error) {
      console.error('Error getting final files:', error);
    }
  };

  const activeProject = useMemo(()=> {
    const projects : Project[] = JSON.parse(localStorage.getItem('projects') ?? "[]");
    return projects.find((project) => project.name === currentProjectName);
  }, [currentProjectName])

  return (
    <main className='h-screen flex bg-white '>   
      {currentView === 0 && (
        <Dashboard 
          projects={projects} 
          onAddProject={() => { 
            setCurrentView( screenNames.indexOf('Add Project') ); 
            setProjectUrl(''); 
          }} 
          onDeleteProject={(projectId) => {
            const updatedProjects = projects.filter((project) => project.id !== projectId);
            localStorage.setItem('projects', JSON.stringify(updatedProjects));
            setProjects(updatedProjects);
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
        <ProjectCreationPage
          designUrl={projectUrl}
          designTree={groupedTree} 
          figmaLink={projectUrl}
          onContinue={handleGenerateProjectFinished}
        />
      )}
     
      {currentView === 7 && (
        <ProjectView
          project={activeProject!}
          onReturnSelect={handleReturnSelect}
        />
      )}
    </main>
  );
};

export default App;