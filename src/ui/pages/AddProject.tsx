import { FC, useState } from 'react';
import styled from 'styled-components';
import FigmaEmbed from '../components/FigmaEmbed';

const AddProjectContainer = styled.div`
  padding: 20px;
`;

const Input = styled.input`
  width: 80%;
  padding: 10px;
  margin-bottom: 20px;
`;

const ContinueButton = styled.button`
  padding: 10px 20px;
  background-color: #3B82F6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

interface AddProjectProps {
  onContinue: (figmaLink: string) => void;
}

const AddProject: FC<AddProjectProps> = ({ onContinue }) => {
  const [figmaLink, setFigmaLink] = useState('');

  return (
    <AddProjectContainer>
      <h2>Step 1: Figma Preview</h2>
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