import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  send: (channel: string, data?: any) => ipcRenderer.send(channel, data),
  on: (channel: string, callback: (event: any, data: any) => void) => {
    ipcRenderer.on(channel, (event, data) => callback(event, data));
  },
});

contextBridge.exposeInMainWorld("electron", {
  getProjects: (): Promise<Project[]> => ipcRenderer.invoke("get-projects"),

  saveProject: (
    project: Project,
    files: Record<string, string | Buffer>
  ): Promise<Project> => ipcRenderer.invoke("save-project", { project, files }),

  runProject: (projectId: string, command: string): Promise<void> =>
    ipcRenderer.invoke("run-project", { projectId, command }),

  stopProject: (projectId: string): Promise<boolean> =>
    ipcRenderer.invoke("stop-project", projectId),

  unzipProject: (projectId: string, zipData: ArrayBuffer): Promise<string> =>
    ipcRenderer.invoke("unzip-project", {
      projectId,
      zipData: Buffer.from(zipData),
    }),

  onProjectOutput: (
    callback: (data: { projectId: string; data: string }) => void
  ): void => {
    ipcRenderer.on("project-output", (_, data) => callback(data));
  }
});
