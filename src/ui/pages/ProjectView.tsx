import { FC, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import PreviewFrame from '../components/PreviewFrame';
import Editor from '../components/Editor';
import { BorderBottom, Code, Devices, PlayArrow, Stop, Terminal } from '@mui/icons-material';
import ArrowBack from '@mui/icons-material/ArrowBack';

interface ProjectViewProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  currentProjectId: string;
  files: { [key: string]: string };
  activeFile: string | null;
  setActiveFile: (file: string) => void;
  setFiles: (files: { [key: string]: string }) => void;
  onReturnSelect: () => void;
}

const StyledTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    backgroundColor: '#3B82F6',
    height: '3px',
    borderRadius: '3px 3px 0 0',
  },
});

const StyledTab = styled((props: { label: string; icon: React.ReactElement }) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  [theme.breakpoints.up('sm')]: {
    minWidth: 0,
  },
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(1),
  color: 'black',
  fontFamily: "'Inter', sans-serif",
  fontSize: '1rem',
  padding: '12px 16px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    color: '#F9FAFB',
    opacity: 0.7,
  },
  '&.Mui-selected': {
    color: '#F9FAFB',
    fontWeight: theme.typography.fontWeightMedium,
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
}));

const TabPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: 'white',
  height: 'calc(100% - 49px)',
  overflow: 'auto',
}));

const ProjectView: FC<ProjectViewProps> = ({
  projects,
  setProjects,
  currentProjectId,
  files,
  activeFile,
  setActiveFile,
  setFiles,
  onReturnSelect
}) => {
  const [tabValue, setTabValue] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [port, setPort] = useState<number | null>(null);

  useEffect(() => {
    const handleOutput = ({ projectId: pid, data }: { projectId: string; data: string }) => {
      const stripAnsiRegex = (str: string) =>
        str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
      data = stripAnsiRegex(data).trim();
      if (pid === currentProjectId) {
        setOutput(prev => [...prev, data]);
      
        // Try to detect port
        const portMatch = data.match(/Local:\s+http:\/\/localhost:(\d+)/);
        if (portMatch) {
          setPort(parseInt(portMatch[1], 10));
        }
      }
    };

    window.electron.onProjectOutput(handleOutput);
    return () => {
    };
  }, [currentProjectId]);

  const handleRunProject = () => {
    setOutput([]);
    setIsRunning(true);
    window.electron.runProject(currentProjectId, 'npm i && npm run dev -- --port 3000');
  };

  const handleStopProject = () => {
    window.electron.stopProject(currentProjectId).then(() => {
      setPort(null);
      setIsRunning(false);
    });
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBack = async () => {
  if (isRunning) await handleStopProject();
  onReturnSelect();
  };

  const tabs = [
    { label: 'Code Editor', icon: <Code /> },
    { label: 'Live Preview', icon: <Devices /> },
    { label: 'Terminal', icon: <Terminal /> },
  ];

  return (
      <main className='flex flex-col w-full h-full'>
          <nav className='bg-accent flex justify-between items-center p-2'>
            <div className='flex items-center'>
              <IconButton onClick={handleBack} sx={{ color: '#F9FAFB', mr: 1 }}>
                <ArrowBack />
              </IconButton>
              
              <StyledTabs value={tabValue} onChange={handleChange}>
                {tabs.map((tab, index) => (
                  <StyledTab key={index} icon={tab.icon} label={tab.label} />
                ))}
              </StyledTabs>
            </div>

            <div className='flex items-center'>
              {isRunning ? (
                <IconButton onClick={handleStopProject} color="error">
                  <Stop />
                </IconButton>
              ) : (
                <IconButton onClick={handleRunProject} color="success">
                  <div className='bg-black/10 rounded-full'>
                    <PlayArrow fontSize='large' className='text-green-500'/>
                  </div>
                </IconButton>
              )}
            </div>
          </nav>

          {tabValue === 0 && (
            <TabPanel>
              <Editor
                projects={projects}
                setProjects={setProjects}
                currentProjectId={currentProjectId || ''}
                files={files}
                activeFile={activeFile}
                setActiveFile={setActiveFile}
                setFiles={setFiles}
              />
            </TabPanel>
          )}

          {tabValue === 1 && (
            <TabPanel>
              {port ? (
                <PreviewFrame port={port} />
              ) : (
                <div className='text-black/40'>Waiting for preview to become available...</div>
              )}
            </TabPanel>
          )}

          {tabValue === 2 && (
            <TabPanel
              sx={{
                p: 0,
                height: '100%',
                backgroundColor: '#000',
                color: '#fff',
                fontFamily: 'monospace',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
              }}
            >
              {output.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </TabPanel>
          )}          
      </main>


  );
};

export default ProjectView;
