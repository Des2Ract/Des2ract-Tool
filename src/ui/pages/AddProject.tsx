import { FC, useState } from 'react';
import styled from 'styled-components';
import FigmaEmbed from '../components/FigmaEmbed';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';

const AddProjectContainer = styled.div`
  padding: 40px;
  background-color: #f7f9fc;
  color: #1f2937;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  position: relative;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #1f2937;
`;

const InputWrapper = styled.div`
  width: 80%;
  max-width: 800px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 20px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

const ContinueButton = styled.button`
  padding: 15px 30px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s ease-in-out;
  margin-top: 20px;

  &:hover {
    background-color: #2563eb;
  }
`;

interface AddProjectProps {
  onContinue: (figmaLink: string) => void;
  onReturnSelect: () => void;
}

const AddProject: FC<AddProjectProps> = ({ onContinue, onReturnSelect }) => {
  const [figmaLink, setFigmaLink] = useState('');

  return (
    <AddProjectContainer>
      <Header>
        <IconButton
          onClick={onReturnSelect}
          sx={{
            position: 'absolute',
            left: 0,
            color: '#3B82F6',
          }}
        >
          <ArrowBack />
        </IconButton>
        <Title>Step 1: Figma Preview</Title>
      </Header>
      <InputWrapper>
        <Input
          type="text"
          value={figmaLink}
          onChange={(e) => setFigmaLink(e.target.value)}
          placeholder="Paste your Figma URL here..."
        />
      </InputWrapper>
      {figmaLink && <FigmaEmbed figmaLink={figmaLink} />}
      <ContinueButton onClick={() => onContinue(figmaLink)}>
        Continue
      </ContinueButton>
    </AddProjectContainer>
  );
};

export default AddProject;