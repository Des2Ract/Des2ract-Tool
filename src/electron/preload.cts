import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  getProjects: (): Promise<Project[]> => ipcRenderer.invoke("get-projects"),

  saveProject: (
    project: Project,
    files: Record<string, string | Buffer>
  ): Promise<Project> => ipcRenderer.invoke("save-project", { project, files }),

  runProject: (projectId: string, projectPath: string): Promise<void> =>
    ipcRenderer.invoke("run-project", projectId, projectPath),

  stopProject: (projectId: string): Promise<boolean> =>
    ipcRenderer.invoke("stop-project", projectId),

  unzipProject: (projectId: string, zipData: ArrayBuffer): Promise<string> =>
    ipcRenderer.invoke("unzip-project", {
      projectId,
      zipData: Buffer.from(zipData),
    }),

  readAllFilesRecursively: (projectPath: string): Promise<string> =>
    ipcRenderer.invoke("read-project-files", {
      projectPath,
    }),

  onProjectOutput: (
    callback: (data: { projectId: string; data: string }) => void
  ): void => {
    ipcRenderer.on("project-output", (_, data) => callback(data));
  },

  getAssetsPath: (): Promise<string> => ipcRenderer.invoke("get-assets-path"),
  
  selectFolder: (): Promise<string> => ipcRenderer.invoke('select-folder'),
  createReactApp: (folderPath: string, projectName: string, generatedFiles: any[]) => ipcRenderer.send('run-command', folderPath, projectName, generatedFiles),
  onOutput: (callback: (data: string) => void) => ipcRenderer.on('command-output', (_, data) => callback(data)),
  onError: (callback: (data: string) => void) => ipcRenderer.on('command-error', (_, data) => callback(data)),
  onClose: (callback: (data: string) => void) => ipcRenderer.on('command-close', (_, code) => callback(code)),
});
