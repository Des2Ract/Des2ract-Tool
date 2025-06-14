declare const PROJECTS_DIR: string;

interface Project {
  id: string;
  name: string;
  figmaLink: string;
  files: { [key: string]: string };
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
    unzipProject: (projectId: string, zipData: Buffer) => Promise<string>;
    onProjectOutput: (
      callback: (data: { projectId: string; data: string }) => void
    ) => void;
  };
}
