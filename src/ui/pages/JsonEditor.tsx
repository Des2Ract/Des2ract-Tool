import { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const JsonEditorContainer = styled.div`
  padding: 20px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 300px;
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

interface JsonEditorProps {
  step: number;
  onContinue: (json: any) => void;
  projectData: any;
}

const JsonEditor: FC<JsonEditorProps> = ({ step, onContinue, projectData }) => {
  const [json, setJson] = useState('');

  useEffect(() => {
    const fetchJson = async () => {
      try {
        let response;
        if (step === 1) {
            // Extract fileKey and nodeId from the Figma URL if not present in projectData
            let fileKey = null;
            let nodeId = null;

            if (projectData.figmaLink) {
              const url = new URL(projectData.figmaLink);
              // fileKey is the 3rd segment in the pathname for /design/:fileKey/...
              const pathParts = url.pathname.split('/');
              if (!fileKey && pathParts.length > 2) {
              fileKey = pathParts[2];
              }
              // node-id is in the search params
              if (!nodeId) {
              nodeId = url.searchParams.get('node-id') || undefined;
              }
            }

            const params: Record<string, string> = {};
            if (fileKey) {
              params.fileKey = fileKey;
            }
            // Only add nodeId if it exists (currently has an error)
            if (nodeId) {
              params.nodeId = nodeId;
            }
            response = await axios.get('https://moadelezz2-des2ract.hf.space/api/tree-builder', { params });
        } else if (step === 2) {
            response = await axios.post(
            'https://AOZ2025-Semantic-Assigner.hf.space/predict',
            projectData.json1.data,
            { headers: { 'Content-Type': 'application/json' } }
            );
        } else if (step === 3) {
          // response = await axios.post('/api/step3', { json2: projectData.json2 });
          response = { data: projectData.json2?.data || projectData.json2 || projectData.json1?.data };
        }
        if (!response) {
            throw new Error('NULL Response');
        }
        setJson(JSON.stringify(response.data, null, 2));
      } catch (error) {
        console.error('Error fetching JSON:', error);
        setJson('Error fetching JSON');
      }
    };
    fetchJson();
  }, [step, projectData]);

  const handleContinue = () => {
    try {
      const parsedJson = JSON.parse(json);
      onContinue(parsedJson);
    } catch {
      alert('Invalid JSON');
    }
  };

  return (
    <JsonEditorContainer>
      {(() => {
        switch (step) {
          case 1:
        return <h2>Step 2 : Tree Builder</h2>;
          case 2:
        return <h2>Step 3 : Semantic Assigner</h2>;
          case 3:
        return <h2>Step 4 : Semantic Grouper</h2>;
          default:
        return <h2>Edit JSON</h2>;
        }
      })()}
      <TextArea value={json} onChange={(e) => setJson(e.target.value)} />
      <ContinueButton onClick={handleContinue}>Continue</ContinueButton>
    </JsonEditorContainer>
  );
};

export default JsonEditor;