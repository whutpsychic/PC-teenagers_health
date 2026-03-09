const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// 数据文件路径
const dataFilePath = path.join(app.getPath('userData'), 'data.json');

// 初始化数据文件
function initializeDataFile() {
    if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, JSON.stringify([]));
    }
}

// 读取数据
function readData() {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('读取数据失败:', error);
        return [];
    }
}

// 写入数据
function writeData(data) {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('写入数据失败:', error);
        return false;
    }
}

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // 创建HTML内容
    mainWindow.loadFile('dist/index.html');
}

app.whenReady().then(() => {
    initializeDataFile();
    createWindow();

    // 添加数据
    ipcMain.handle('add-data', async (event, item) => {
        try {
            const data = readData();
            data.push(item);
            const success = writeData(data);
            return { success, message: success ? '' : '写入文件失败' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    });

    // 获取所有数据
    ipcMain.handle('get-all-data', async (event) => {
        return readData();
    });

    // 删除数据
    ipcMain.handle('delete-data', async (event, id) => {
        try {
            const data = readData();
            const filteredData = data.filter(item => item.id !== id);
            if (filteredData.length === data.length) {
                return { success: false, message: '未找到指定ID的数据' };
            }
            const success = writeData(filteredData);
            return { success, message: success ? '' : '写入文件失败' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    });

    // 搜索数据
    ipcMain.handle('search-data', async (event, keyword) => {
        try {
            const data = readData();
            const filteredData = data.filter(item => 
                item.name.toLowerCase().includes(keyword.toLowerCase()) ||
                item.email.toLowerCase().includes(keyword.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(keyword.toLowerCase()))
            );
            return filteredData;
        } catch (error) {
            console.error('搜索数据失败:', error);
            return [];
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
