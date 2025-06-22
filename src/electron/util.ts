import { ipcMain, BrowserWindow } from "electron";
import { getUIPath } from "./pathResolver.js";
import { pathToFileURL } from "url";
import { IpcMainEvent } from "electron";

export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

// Add new interfaces
export interface Project {
  id: string;
  name: string;
  figmaLink: string;
  path: string; // Path to project folder
}

// Add these functions to existing util.ts
export function sendToWindow<Key extends keyof EventPayloadMapping>(
  key: Key,
  window: BrowserWindow,
  payload: EventPayloadMapping[Key]
) {
  window.webContents.send(key, payload);
}

export interface EventPayloadMapping {
  "get-projects": Project[];
  "save-project": { project: Project; files: { [key: string]: string } };
  "run-project": any;
  "stop-project": string;
  "project-output": { projectId: string; data: string };
}

export function ipcMainOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: (event: IpcMainEvent, payload: EventPayloadMapping[Key]) => void
) {
  ipcMain.on(key, handler);
}
