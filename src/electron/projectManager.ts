import { app } from "electron";
import fs from "fs";
import path from "path";
import { spawn, ChildProcess } from "child_process";
import { ipcMain, BrowserWindow } from "electron";
import { Project } from "./util.js";
import AdmZip from "adm-zip";
import { fileURLToPath } from "url";
import treeKill from "tree-kill";
import { isDev } from "./util.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const PROJECTS_DIR = path.join(__dirname, isDev() ? "../" : "./", "projects");
const PROJECTS_DIR = path.join(app.getPath("downloads"), "des2ract-projects");
let activeProcesses: Record<string, ChildProcess> = {};

export function initProjectManager(mainWindow: BrowserWindow) {
  // Ensure projects directory exists
  if (fs.existsSync(PROJECTS_DIR)) {
    const stat = fs.statSync(PROJECTS_DIR);
    if (!stat.isDirectory()) {
      console.error(
        `${PROJECTS_DIR} exists but is not a directory. Removing it...`
      );
      fs.unlinkSync(PROJECTS_DIR); // or renameSync if you want to preserve it
    }
  }

  if (!fs.existsSync(PROJECTS_DIR)) {
    fs.mkdirSync(PROJECTS_DIR, { recursive: true });
  }

  function readAllFilesRecursively(
    dir: string,
    basePath: string
  ): { [key: string]: string } {
    let files: { [key: string]: string } = {};

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue; // Exclude node_modules

      const fullPath = path.join(dir, entry.name);
      const relativePath = path
        .relative(basePath, fullPath)
        .replace(/\\/g, "/"); // normalize slashes

      if (entry.isDirectory()) {
        const nestedFiles = readAllFilesRecursively(fullPath, basePath);
        files = { ...files, ...nestedFiles };
      } else {
        const content = fs.readFileSync(fullPath, "utf-8");
        files[relativePath] = content;
      }
    }

    return files;
  }

  ipcMain.handle("get-projects", async () => {
    const projectDirs = fs
      .readdirSync(PROJECTS_DIR, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    return projectDirs
      .map((id) => {
        const projectPath = path.join(PROJECTS_DIR, id);
        const metaPath = path.join(projectPath, "project.json");

        if (fs.existsSync(metaPath)) {
          const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
          const files = readAllFilesRecursively(projectPath, projectPath);
          return { ...meta, files, path: projectPath };
        }
        return null;
      })
      .filter(Boolean) as Project[];
  });

  ipcMain.handle("save-project", async (_, { project, files }) => {
    const projectPath = path.join(PROJECTS_DIR, project.id);
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
    }

    Object.entries(files).forEach(([filePath, content]) => {
      const fullPath = path.join(projectPath, filePath);
      const dir = path.dirname(fullPath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (typeof content === "string") {
        fs.writeFileSync(fullPath, content);
      } else if (Buffer.isBuffer(content)) {
        fs.writeFileSync(fullPath, Uint8Array.from(content));
      } else {
        throw new Error(`Invalid content type for file ${filePath}`);
      }
    });

    // Exclude 'files' from the meta object before saving
    const { files: _files, ...meta } = { ...project, path: projectPath };
    fs.writeFileSync(
      path.join(projectPath, "project.json"),
      JSON.stringify(meta, null, 2)
    );

    return project;
  });

  ipcMain.handle("run-project", async (_, projectId: string, projectPath: string) => {

    if (activeProcesses[projectId]) {
      activeProcesses[projectId].kill();
    }

    const proc = spawn('npm i && npm run dev -- --port 3000', {
      cwd: projectPath,
      shell: true,
      stdio: ["pipe", "pipe", "pipe"],
    });

    activeProcesses[projectId] = proc;

    proc.stdout?.on("data", (data) => {
      mainWindow.webContents.send("project-output", {
        projectId,
        data: data.toString(),
      });
    });

    proc.stderr?.on("data", (data) => {
      mainWindow.webContents.send("project-output", {
        projectId,
        data: data.toString(),
      });
    });

    proc.on("close", () => {
      delete activeProcesses[projectId];
    });
  });

  ipcMain.handle("stop-project", (_, projectId) => {
    const proc = activeProcesses[projectId];
    if (proc) {
      treeKill(proc.pid as number, "SIGTERM");
      delete activeProcesses[projectId];
      return true;
    }
    return false;
  });

  ipcMain.handle("unzip-project", (_, { projectId, zipData }) => {
    const projectPath = path.join(PROJECTS_DIR, projectId);

    // Convert zipData (number[]) back to Buffer
    const buffer = Buffer.from(zipData);

    const zip = new AdmZip(buffer);
    zip.extractAllTo(projectPath, true);

    const files = readAllFilesRecursively(projectPath, projectPath);

    return { files, projectPath };
  });
  
  ipcMain.handle("read-project-files", (_, { projectPath }) => {
    const files = readAllFilesRecursively(projectPath, projectPath);
    return files;
  });

  ipcMain.handle("get-assets-path", () => {
    return path.join(app.getAppPath(), isDev() ? "." : "..", "/src/assets");
  });
}
