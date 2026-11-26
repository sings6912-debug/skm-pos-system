const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('SKMDesktopBridge', {
    isDesktopApp: true,
    platform: process.platform,
    getPrinters: () => ipcRenderer.invoke('skm:get-printers'),
    printSilentHtml: (payload) => ipcRenderer.invoke('skm:print-silent-html', payload),
    printRawIp: (payload) => ipcRenderer.invoke('skm:print-raw-ip', payload),
    openCustomerDisplay: (branch) => ipcRenderer.invoke('skm:open-customer-display', branch),
    openKdsWindow: (branch) => ipcRenderer.invoke('skm:open-kds-window', branch),
    getAppInfo: () => ipcRenderer.invoke('skm:get-app-info')
});
