import { FC } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

interface FileExplorerProps {
  files: { [key: string]: string };
  setActiveFile: (file: string) => void;
}

const FileExplorer: FC<FileExplorerProps> = ({ files, setActiveFile }) => {
  return (
    <div style={{ width: '250px', height: '100%', float: 'left', borderRight: '1px solid #ccc' }}>
      <List>
        {Object.keys(files).map(file => (
          <ListItem
            key={file}
            onClick={() => setActiveFile(file)}
            sx={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            <ListItemText primary={file} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default FileExplorer;