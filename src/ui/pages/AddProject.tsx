import { FC, useState } from 'react';
import styled from 'styled-components';
import FigmaEmbed from '../components/FigmaEmbed';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';

const AddProjectContainer = styled.div`
  padding: 20px;
`;

const Input = styled.input`
  width: 80%;
  padding: 10px;
  margin-bottom: 20px;
  margin-right: 20px;
`;

const ContinueButton = styled.button`
  padding: 10px 20px;
  background-color: #3B82F6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
`;

interface AddProjectProps {
  onContinue: (figmaLink: string) => void;
  onReturnSelect: () => void;
}

const AddProject: FC<AddProjectProps> = ({ onContinue,onReturnSelect }) => {
  const [figmaLink, setFigmaLink] = useState('');

  return (
    <AddProjectContainer>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={onReturnSelect} sx={{ color: '#F9FAFB', mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <h2>Step 1: Figma Preview</h2>
        </Box>
      <Input
        type="text"
        value={figmaLink}
        onChange={(e) => setFigmaLink(e.target.value)}
        placeholder="Paste Figma URL here..."
      />
      {figmaLink && <FigmaEmbed figmaLink={figmaLink} />}
      <ContinueButton onClick={() => onContinue(figmaLink)}>Continue</ContinueButton>
    </AddProjectContainer>
  );
};

export default AddProject;