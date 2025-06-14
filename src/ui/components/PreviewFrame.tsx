import { FC } from 'react';

interface PreviewFrameProps {
  port?: number;
}

const PreviewFrame: FC<PreviewFrameProps> = ({ port }) => {
  if (!port) return <div>Project not running</div>;

  return (
    <iframe
      style={{ width: '100%', height: 'calc(100vh - 150px)', border: 'none' }}
      src={`http://localhost:${port}`}
      title="Live Preview"
    />
  );
};

export default PreviewFrame;