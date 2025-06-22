import { FC } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import DefaultSidebar from '../components/sidebars/dashboard-sidebar';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import React from 'react';

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


const DashboardContainer = styled.div`
  flex: 1;
  padding: 40px 50px;
  overflow-y: auto;
`;

const Header = styled.div`
  width: 100%;
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


interface DashboardProps {
  projects: Project[];
  onAddProject: () => void;
  onProjectSelect: (projectId: string) => void;
}

const Dashboard: FC<DashboardProps> = ({ projects, onAddProject, onProjectSelect }) => {
  return (
    <>
      <DashboardWrapper className='w-full'>
        <DefaultSidebar />
        
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

          {
            projects?.length === 0 ? (
              <div className="flex flex-col justify-start items-center h-full">

                {(() => {
                    const [logoPath, setLogoPath] = React.useState<string | null>(null);
                                  
                    React.useEffect(() => {
                        window.electron.getAssetsPath().then((path: string) => {
                            setLogoPath(path + "\\logo.png");
                        });
                    }, []);
                  
                    return (
                        <Avatar className="w-100 h-100">
                            {logoPath ? (
                                <AvatarImage src={logoPath} />
                            ) : (
                                <AvatarFallback>D2R</AvatarFallback>
                            )}
                        </Avatar>
                    );
                })()}

                <h1 className="animate-pulse">
                    No Projects Found
                </h1>
              </div>
            ) :
            <ProjectList>
              {projects.map(project => (
                <ProjectItem key={project.id} onClick={() => onProjectSelect(project.name)}>
                  <ProjectName title={project.name}>
                    {project.name}
                  </ProjectName>
                  <ProjectDetails>
                    <p>Figma: {project.figmaLink ? 'Linked' : 'Not Linked'}</p>
                    <p>Created At: { (new Date(project.creationDate ?? new Date())).toLocaleDateString() }</p>
                    {/* <p>Files: {Object.keys(project.files).length}</p> */}
                  </ProjectDetails>
                </ProjectItem>
              ))}
            </ProjectList>
          }

        </DashboardContainer>
      </DashboardWrapper>
    </>
  );
};

export default Dashboard;