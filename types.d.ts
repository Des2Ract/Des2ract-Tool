declare const PROJECTS_DIR: string;

interface Project {
  id: string;
  name: string;
  figmaLink: string;
  files: { [key: string]: string };
  creationDate?: string;
  path?: string; // Path to project folder
}

interface Window {
  electron: {
    getProjects: () => Promise<Project[]>;
    saveProject: (
      project: Project,
      files: Record<string, string | Buffer>
    ) => Promise<Project>;
    runProject: (projectId: string, command: string) => Promise<void>;
    stopProject: (projectId: string) => Promise<boolean>;
    unzipProject: (
      projectId: string,
      zipData: Buffer
    ) => Promise<{ [key: string]: string }, string>;
    readAllFilesRecursively: (
      projectPath: string,
    ) => Promise<{ [key: string]: string }, string>;
    onProjectOutput: (
      callback: (data: { projectId: string; data: string }) => void
    ) => void;
    getAssetsPath: () => Promise<string>;
    selectFolder: () => Promise<string>;
    createReactApp: (folderPath: string, projectName: string, generatedFiles: any[]) => Promise<void>;
    onOutput: (callback: (data: string) => void) => void;
    onError: (callback: (data: string) => void) => void;
    onClose: (callback: (data: string) => void) => void;
    
    get: (key: string) => any,
    set: (key: string, value: any) => void,
  };
}
