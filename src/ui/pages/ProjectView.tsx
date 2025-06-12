import { FC, useState } from 'react';
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PreviewFrame from '../components/PreviewFrame';
import Editor from '../components/Editor';
import { Code, Devices } from '@mui/icons-material';

interface ProjectViewProps {
  files: { [key: string]: string };
  activeFile: string | null;
  setActiveFile: (file: string) => void;
  setFiles: (files: { [key: string]: string }) => void;
}

const StyledTabs = styled(Tabs)({
  borderBottom: '1px solid #374151',
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
  color: '#9CA3AF',
  fontFamily: "'Inter', sans-serif",
  fontSize: '1rem',
  padding: '12px 16px',
  '&:hover': {
    color: '#F9FAFB',
    opacity: 1,
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
  height: 'calc(100% - 49px)',
  overflow: 'auto',
}));

const ProjectView: FC<ProjectViewProps> = ({ files, activeFile, setActiveFile, setFiles }) => {
  const [tabValue, setTabValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ backgroundColor: '#111827', borderRadius: '8px 8px 0 0' }}>
        <StyledTabs value={tabValue} onChange={handleChange} aria-label="project-tabs">
          <StyledTab icon={<Code />} label="Code Editor" />
          <StyledTab icon={<Devices />} label="Live Preview" />
        </StyledTabs>
      </Box>
      {tabValue === 0 && (
        <TabPanel sx={{ p: 0, height: '100%' }}>
          <Editor files={files} activeFile={activeFile} setActiveFile={setActiveFile} setFiles={setFiles} />
        </TabPanel>
      )}
      {tabValue === 1 && (
        <TabPanel>
          <PreviewFrame />
        </TabPanel>
      )}
    </Box>
  );
};

export default ProjectView;