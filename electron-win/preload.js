// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// 定义暴露给渲染进程的API接口
const electronAPI = {
  // 加载所有数据
  loadAllData: () => ipcRenderer.invoke('load-all-data'),
  
  // 存储数据
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  
  // 修改数据
  updateData: (id, updatedData) => ipcRenderer.invoke('update-data', id, updatedData),
  
  // 删除数据
  deleteData: (id) => ipcRenderer.invoke('delete-data', id),
  
  // 批量删除数据
  batchDeleteData: (ids) => ipcRenderer.invoke('batch-delete-data', ids),
  
  // 监听数据变更事件（可选）
  onDataChanged: (callback) => {
    ipcRenderer.on('data-changed', (_, data) => callback(data));
  },
  
  // 移除数据变更监听器
  removeDataChangedListener: () => {
    ipcRenderer.removeAllListeners('data-changed');
  }
};

// 将API安全地暴露到渲染进程的window对象上
contextBridge.exposeInMainWorld('electronAPI', electronAPI);


