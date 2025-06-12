import { FC } from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: 20px;
`;

const ProjectList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ProjectItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
`;

const AddButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #3B82F6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

interface Project {
  id: string;
  name: string;
  figmaLink: string;
  files: { [key: string]: string };
}

interface DashboardProps {
  projects: Project[];
  onAddProject: () => void;
  onProjectSelect: (projectId: string) => void;
}

const Dashboard: FC<DashboardProps> = ({ projects, onAddProject, onProjectSelect }) => {
  return (
    <DashboardContainer>
      <h2>Dashboard</h2>
      <ProjectList>
        {projects.map(project => (
          <ProjectItem key={project.id} onClick={() => onProjectSelect(project.id)}>
            {project.name} - {project.figmaLink}
          </ProjectItem>
        ))}
      </ProjectList>
      <AddButton onClick={onAddProject}>Add Project</AddButton>
    </DashboardContainer>
  );
};

export default Dashboard;