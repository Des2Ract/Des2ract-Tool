import { FC, useState, useEffect } from 'react';
import styled from 'styled-components';

interface FigmaEmbedProps {
  figmaLink: string;
}

const EmbedContainer = styled.div`
  width: 100%;
  max-width: 800px;
  height: calc(100vh - 250px);
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 1rem;
  text-align: center;
  padding: 40px;
  background: rgba(255, 235, 238, 0.8);
  border-radius: 12px;
  a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const WarningMessage = styled.div`
  color: black;
  font-size: 1rem;
  text-align: center;
  padding: 40px;
  background: rgba(255 186 0 / 0.6);
  border-radius: 12px;
  a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
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
      return;
    }

    try {
      const url = new URL(figmaLink);
      if (
        url.hostname !== 'www.figma.com' &&
        !url.hostname.endsWith('.figma.com')
      ) {
        setError(
          'Invalid Figma link. Please use a valid Figma URL (e.g., https://www.figma.com/file/... or https://www.figma.com/design/...).'
        );
        return;
      }

      const match = figmaLink.match(
        /\/(file|design)\/([a-zA-Z0-9]+)\/[^?]+(\?node-id=([0-9-]+))?/
      );
      if (!match || !match[2]) {
        setError(
          'Invalid Figma URL format. Ensure the URL includes a valid file or design key.'
        );
        return;
      }
      const fileKey = match[2];
      const nodeId = match[4] || '0-1';

      const baseUrl = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(
        figmaLink
      )}`;
      setEmbedUrl(`${baseUrl}&node-id=${nodeId}`);
      setError(null);
    } catch {
      setError('Invalid Figma link. Please provide a valid URL.');
    }
  }, [figmaLink]);

  if (error) {
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

  if (!embedUrl) {
    return null;
  }

  return (
    <div className='w-full h-full'>
      <iframe
        className='w-full h-full'
        style={{
          border: 'none',
          borderRadius: '12px',
        }}
        width="100%"
        height="100%"
        src={embedUrl}
        allowFullScreen
        title="Figma Embed"
        onError={() =>
          setError(
            'Unable to embed Figma design. The file may be private, not found, or restricted. Please ensure the file is set to "Anyone with the link can view" in Figma’s Share settings.'
          )
        }
      />
    </div>
  );
};

export default FigmaEmbed;