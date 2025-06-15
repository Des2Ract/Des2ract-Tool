import { FC } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

// --- Global Styles for a cohesive and modern look ---
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  body {
    background-color: #f8f9fa;
    color: #343a40;
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

const DashboardWrapper = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 180px;
  background-color: #ffffff;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e9ecef;
`;

const Logo = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #3B82F6;
  margin-bottom: 50px;
  text-align: center;
  letter-spacing: -1px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const DashboardContainer = styled.div`
  flex: 1;
  padding: 40px 50px;
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
  font-weight: 700;
  color: #212529;
`;

const AddButton = styled.button`
  padding: 12px 24px;
  background: #3B82F6;
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
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
  }
`;

const ProjectList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
`;

const ProjectItem = styled.li`
  background-color: #ffffff;
  padding: 25px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  border: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 160px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    border-color: #3B82F6;
  }
`;

const ProjectName = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: #343a40;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProjectDetails = styled.div`
  margin-top: 20px;
  font-size: 0.9rem;
  color: #6c757d;
  
  p {
    margin: 5px 0;
  }
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
          <Logo><Title>Des</Title><h1>2</h1><Title>ract</Title></Logo>
        </Sidebar>
        <DashboardContainer>
          <Header>
            <Title>Your Projects</Title>
            <AddButton onClick={onAddProject}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                <path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z"></path>
              </svg>
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