import { FC, useState, useEffect } from 'react';
import styled from 'styled-components';

interface FigmaEmbedProps {
  figmaLink: string;
}

const EmbedContainer = styled.div`
  width: 100%;
  height: calc(100vh - 150px);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1F2937;
  border-radius: 8px;
`;

const ErrorMessage = styled.div`
  color: #F87171;
  font-size: 1rem;
  text-align: center;
  padding: 20px;
  a {
    color: #3B82F6;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const FigmaEmbed: FC<FigmaEmbedProps> = ({ figmaLink }) => {
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!figmaLink) {
      setError('Please provide a valid Figma link.');
      return;
    }

    try {
      const url = new URL(figmaLink);
      if (url.hostname !== 'www.figma.com' && !url.hostname.endsWith('.figma.com')) {
        setError('Invalid Figma link. Please use a valid Figma URL (e.g., https://www.figma.com/file/... or https://www.figma.com/design/...).');
        return;
      }

      // Extract file key and optional node-id
      const match = figmaLink.match(/\/(file|design)\/([a-zA-Z0-9]+)\/[^?]+(\?node-id=([0-9-]+))?/);
      if (!match || !match[2]) {
        setError('Invalid Figma URL format. Ensure the URL includes a valid file or design key.');
        return;
      }
      const fileKey = match[2];
      const nodeId = match[4] || '0-1'; // Default to 0-1 if no node-id

      // Construct embed URL
      const baseUrl = `https://embed.figma.com/design/${fileKey}/${figmaLink.split('/').pop()?.split('?')[0]}`;
      setEmbedUrl(`${baseUrl}?node-id=${nodeId}&embed-host=share`);
      setError(null);
    } catch {
      setError('Invalid Figma link. Please provide a valid URL.');
    }
  }, [figmaLink]);

  if (error || !embedUrl) {
    return (
      <ErrorMessage>
        {error || 'Loading...'}
        {figmaLink && (
          <>
            <br />
            <a href={figmaLink} target="_blank" rel="noopener noreferrer">
              Open in Figma
            </a>
          </>
        )}
      </ErrorMessage>
    );
  }

  return (
    <EmbedContainer>
      <iframe
        style={{
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
        }}
        width="800"
        height="450"
        src={embedUrl}
        allowFullScreen
        title="Figma Embed"
        onError={() => setError(
          'Unable to embed Figma design. The file may be private, not found, or restricted by Figma’s security settings. ' +
          'Please ensure the file is set to "Anyone with the link can view" in Figma’s Share settings and try again. ' +
          `<a href="${figmaLink}" target="_blank" rel="noopener noreferrer">Open in Figma</a>`
        )}
      />
    </EmbedContainer>
  );
};

export default FigmaEmbed;