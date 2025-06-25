import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { isDev } from "./util.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";
import { initProjectManager } from "./projectManager.js";
import { spawn } from "child_process";
import { cwd } from "process";
import { mkdir, writeFile } from 'fs/promises';
import path, { dirname } from "path";

type ReactFile = {
  name: string;
  content: string;
  path: string;
}

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 1024,
    webPreferences: {
      preload: getPreloadPath(),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
  });

  initProjectManager(mainWindow);

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(getUIPath());
  }

  // Open DevTools for debugging
  if (isDev()) {
    mainWindow.webContents.openDevTools();
  }
});

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });

  if (result.canceled) return null;
  return result.filePaths[0];
});

ipcMain.on('run-command', async (event, folderPath, projectName, generatedFiles : ReactFile[]) => {
  
  const processPath = path.join(app.getAppPath(), isDev() ? "." : "..", "/src/assets");
  const componentsFolder = `${processPath}/components`;

  await mkdir(`${processPath}/tmp`, { recursive: true });
  for (const file of generatedFiles) {        
    await writeFile(`${processPath}/tmp/${file.name}`, file.content, 'utf8');
  }    
  
  const commandsList = [
      // `npx create-next-app "${projectName}" --javascript --tailwind --no-eslint --turbopack --use-npm --app --no-src-dir --import-alias="@/*"`,
      `(cd ./${projectName} && npm install)`,
      `npx shadcn@latest init --template "next" --base-color "neutral" -y -f`,
      `xcopy "${componentsFolder}" "./app/components" /E /I /Y /H`,
      ...generatedFiles.map((file) => `xcopy "${processPath}\\tmp\\${file.name}" ".\\${file.path}\\" /y`),
      `echo Done`,
  ];

  const command = commandsList.join(' && ');  

  const child = spawn(command, { 
    cwd: folderPath,
    shell: true 
  });

  child.stdout.on('data', (data) => {
    event.sender.send('command-output', data.toString());
  });

  child.stderr.on('data', (data) => {
    event.sender.send('command-error', data.toString());
  });

  child.on('exit', (code) => {
    event.sender.send('command-close', code);
  });
});