import { FC } from 'react';

interface FileExplorerProps {
  files: { [key: string]: string };
  setActiveFile: (file: string) => void;
}

const buildFileTree = (files: { [key: string]: string }) => {
  const root: Record<string, any> = {};

  for (const filePath in files) {
    const parts = filePath.split('/').filter(part => part); // Remove empty parts
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = i === parts.length - 1 ? null : {};
      }
      current = current[part] || current;
    }
  }

  return root;
};

const renderCustomTree = (
  nodes: Record<string, any>,
  setActiveFile: (file: string) => void,
  path = ''
) => {
  return (
    <ul style={{ paddingLeft: 20, margin: 0 }}>
      {Object.entries(nodes).map(([key, value]) => {
        const fullPath = path ? `${path}/${key}` : key;
        const isFile = value === null;
        return (
          <li key={fullPath} style={{ listStyle: 'none' }}>
            <div
              onClick={() => isFile && setActiveFile(fullPath)}
              style={{ cursor: isFile ? 'pointer' : 'default', padding: '2px 0' }}
            >
              {isFile ? '📄' : '📁'} {key}
            </div>
            {!isFile && renderCustomTree(value, setActiveFile, fullPath)}
          </li>
        );
      })}
    </ul>
  );
};

const FileExplorer: FC<FileExplorerProps> = ({ files, setActiveFile }) => {
  const treeData = buildFileTree(files);

  return (
    <div style={{ width: 250, minHeight: '400px', overflowY: 'auto' }}>
      <div style={{ padding: 10 }}>📁 Project</div>
      {renderCustomTree(treeData, setActiveFile)}
    </div>
  );
};

export default FileExplorer;