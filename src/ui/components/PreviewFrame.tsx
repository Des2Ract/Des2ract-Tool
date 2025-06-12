import { FC } from 'react';

const PreviewFrame: FC = () => {
  return (
    <iframe
      style={{ width: '100%', height: 'calc(100vh - 150px)', border: 'none' }}
      src="http://localhost:5174"
      title="Live Preview"
    />
  );
};

export default PreviewFrame;