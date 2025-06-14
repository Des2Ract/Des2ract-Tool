import { FC } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

// --- Global Styles for a cohesive look ---
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

  body {
    background-color: #1a1a2e;
    color: #e0e0e0;
    font-family: 'Poppins', sans-serif;
  }
`;

const DashboardWrapper = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 150px;
  background-color: #161625;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #2a2a3e;
`;

const Logo = styled.h1`
  font-size: 1.8rem;
  color: #ffffff;
  margin-bottom: 40px;
  text-align: center;
  letter-spacing: 1px;
`;

const DashboardContainer = styled.div`
  flex: 1;
  padding: 40px;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 600;
  color: #ffffff;
`;

const AddButton = styled.button`
  padding: 12px 24px;
  background: linear-gradient(90deg, #5A67D8, #3B82F6);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }
`;

const ProjectList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
`;

const ProjectItem = styled.li`
  background-color: #1e1e32;
  padding: 25px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  border: 1px solid #2a2a3e;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 150px;

  &:hover {
    transform: translateY(-5px);
    background-color: #24243e;
    border-color: #3B82F6;
  }
`;

const ProjectName = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: #e0e0e0;
  
  /* --- Add these lines to prevent overflow --- */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProjectDetails = styled.div`
  margin-top: 15px;
  font-size: 0.9rem;
  color: #a0a0b0;
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
    <>
      <GlobalStyle />
      <DashboardWrapper>
        <Sidebar>
          <Logo>Des2ract</Logo>
        </Sidebar>
        <DashboardContainer>
          <Header>
            <Title>Your Projects</Title>
            <AddButton onClick={onAddProject}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z"></path></svg>
              New Project
            </AddButton>
          </Header>
          <ProjectList>
            {projects.map(project => (
              <ProjectItem key={project.id} onClick={() => onProjectSelect(project.id)}>
                <ProjectName title={project.name}>
                  {project.name}
                </ProjectName>
                <ProjectDetails>
                  <p>Figma: {project.figmaLink ? 'Linked' : 'Not Linked'}</p>
                  <p>Files: {Object.keys(project.files).length}</p>
                </ProjectDetails>
              </ProjectItem>
            ))}
          </ProjectList>
        </DashboardContainer>
      </DashboardWrapper>
    </>
  );
};

export default Dashboard;