import { FC, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import TabSwitcher from '../components/TabSwitcher';

const GlobalStyle = createGlobalStyle` @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'); body { margin: 0; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }`;
const fadeIn = keyframes` from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`;
const spin = keyframes` to { transform: rotate(360deg); }`;
const PageWrapper = styled.div` display: flex; justify-content: center; align-items: flex-start; min-height: 100vh; padding: 60px 20px; background: linear-gradient(170deg, #1D2B4A 0%, #111827 100%); overflow: auto; `;
const MainPanel = styled.div` width: 100%; max-width: 900px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37); padding: 40px; animation: ${fadeIn} 0.5s ease-out; `;
const Header = styled.div` text-align: center; margin-bottom: 32px; color: #F9FAFB; h1 { font-size: 2.5rem; margin: 0 0 8px 0; } p { font-size: 1.125rem; color: #9CA3AF; margin: 0; } `;
const InputContainer = styled.div` display: flex; gap: 12px; margin-bottom: 40px; `;
const FigmaInput = styled.input` flex-grow: 1; padding: 14px 18px; font-size: 1rem; background-color: #1F2937; border: 1px solid #374151; border-radius: 8px; color: #F9FAFB; outline: none; transition: border-color 0.2s, box-shadow 0.2s; &::placeholder { color: #6B7280; } &:focus { border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4); } `;
const GenerateButton = styled.button` display: flex; align-items: center; justify-content: center; padding: 14px 28px; font-size: 1rem; font-weight: 600; background: #3B82F6; color: #FFFFFF; border: none; border-radius: 8px; cursor: pointer; transition: background-color 0.2s, transform 0.2s; &:hover:not(:disabled) { background: #2563EB; transform: translateY(-2px); } &:disabled { background: #4B5563; cursor: not-allowed; } `;
const Loader = styled.div` width: 18px; height: 18px; border: 2px solid rgba(255, 255, 255, 0.5); border-top-color: #FFFFFF; border-radius: 50%; animation: ${spin} 0.8s linear infinite; margin-right: 8px; `;
const ResultsContainer = styled.div` min-height: 400px; background-color: #0d1117; border-radius: 8px; overflow: hidden; border: 1px solid #374151; `;
const EmptyState = styled.div` display: flex; flex-direction: column; justify-content: center; align-items: center; height: 400px; color: #6B7280; text-align: center; h3 { font-size: 1.25rem; margin: 0 0 8px 0; } p { margin: 0; max-width: 300px; } `;

interface GeneratedFiles {
  [key: string]: string;
}

interface ApiResponse {
  type: string;
  files: GeneratedFiles;
}

const mockApiResponses: ApiResponse[] = [
  {
    type: 'component',
    files: {
      'Component.tsx': `import React from 'react';\n\nconst Component: React.FC = () => {\n  return <div>Mock Generated Component</div>;\n};\n\nexport default Component;`,
    },
  },
  {
    type: 'styles',
    files: {
      'styles.css': `div { background-color: #f0f0f0; padding: 20px; }`,
    },
  },
  {
    type: 'assets',
    files: {
      'image.png': 'https://via.placeholder.com/150',
    },
  },
];

const Home: FC = () => {
  const [figmaLink, setFigmaLink] = useState<string>('');
  const [files, setFiles] = useState<GeneratedFiles>({});
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const mockPromises = mockApiResponses.map((response, index) =>
        new Promise<ApiResponse>((resolve) => {
          setTimeout(() => resolve(response), 1000 * (index + 1));
        })
      );

      const results = await Promise.all(mockPromises);
      const combinedFiles = results.reduce((acc, result) => ({
        ...acc,
        ...result.files,
      }), {});
      setFiles(combinedFiles);
      setActiveFile(Object.keys(combinedFiles)[0] || null);
    } catch (err) {
      console.error('Error generating code:', err);
      setError('Failed to generate code. Please check the link and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <PageWrapper>
        <MainPanel>
          <Header>
            <h1>Figma to React</h1>
            <p>Paste your Figma design link below to generate React code.</p>
          </Header>
          <InputContainer>
            <FigmaInput
              type="text"
              value={figmaLink}
              onChange={(e) => setFigmaLink(e.target.value)}
              placeholder="https://www.figma.com/design/..."
              disabled={loading}
            />
            <GenerateButton onClick={handleGenerate} disabled={loading}>
              {loading && <Loader />}
              {loading ? 'Generating...' : 'Generate'}
            </GenerateButton>
          </InputContainer>

          {error && <p style={{ color: '#F87171', textAlign: 'center', marginBottom: '20px' }}>{error}</p>}

          <ResultsContainer>
            {Object.keys(files).length > 0 || figmaLink ? (
              <TabSwitcher
                figmaLink={figmaLink}
                files={files}
                activeFile={activeFile}
                setActiveFile={setActiveFile}
                setFiles={setFiles}
              />
            ) : (
              <EmptyState>
                <h3>Your generated code will appear here</h3>
                <p>Simply paste a Figma link and click "Generate" to get started.</p>
              </EmptyState>
            )}
          </ResultsContainer>
        </MainPanel>
      </PageWrapper>
    </>
  );
};

export default Home;