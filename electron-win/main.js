// main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs").promises;

// 开发模式
const developing = true;

app.name = "Teens_health"; // ← 应用名

// 数据存储文件路径
const DATA_FILE = path.join(app.getPath("userData"), "data.json");

// 初始化数据文件
async function initializeDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    // 如果文件不存在，创建一个空数组
    await fs.writeFile(DATA_FILE, JSON.stringify([]));
  }
}

// 读取所有数据
async function readAllData() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data:", error);
    return [];
  }
}

// 写入所有数据
async function writeAllData(data) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing data:", error);
    throw error;
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1680,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (developing) {
    console.log("env: development");
    // 加载应用内容
    mainWindow.loadURL("http://localhost:5173"); // 如果使用 Vite 开发服务器
    mainWindow.webContents.openDevTools();
    return;
  } else {
    console.log("env: production");
    // 加载应用内容
    mainWindow.loadFile("vue3/dist/index.html");
  }
}

app.whenReady().then(async () => {
  await initializeDataFile();
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// IPC处理程序
ipcMain.handle("load-all-data", async () => {
  return await readAllData();
});

ipcMain.handle("save-data", async (event, data) => {
  const currentData = await readAllData();
  const newData = Array.isArray(data)
    ? [...currentData, ...data]
    : [...currentData, data];
  await writeAllData(newData);
  return { success: true, message: "Data stored successfully" };
});

ipcMain.handle("update-data", async (event, id, updatedData) => {
  const currentData = await readAllData();
  const index = currentData.findIndex((item) => item.id == id);

  if (index !== -1) {
    currentData[index] = { ...currentData[index], ...updatedData };
    await writeAllData(currentData);
    return { success: true, message: "Data updated successfully" };
  } else {
    return { success: false, message: "Item not found" };
  }
});

ipcMain.handle("delete-data", async (event, id) => {
  const currentData = await readAllData();
  const filteredData = currentData.filter((item) => item.id != id);

  if (filteredData.length < currentData.length) {
    await writeAllData(filteredData);
    return { success: true, message: "Data deleted successfully" };
  } else {
    return { success: false, message: "Item not found" };
  }
});

ipcMain.handle("batch-delete-data", async (event, ids) => {
  const currentData = await readAllData();
  let filteredData = currentData;

  ids.forEach((id) => {
    filteredData = filteredData.filter((item) => item.id != id);
  });

  if (filteredData.length < currentData.length) {
    await writeAllData(filteredData);
    return { success: true, message: "Data deleted successfully" };
  } else {
    return { success: false, message: "Item not found" };
  }
});
