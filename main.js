const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

// URL do seu Google Apps Script Web App
const APP_URL = 'https://script.google.com/macros/s/AKfycbz-0H-83ttm91sjEZzC0pHHodsvtmXbG_c8S4YGXx1gB5wEFHhQAHIXJRLTXl1BCyFvmA/exec';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'Hope Clínica - Gestão de Guias',
    icon: path.join(__dirname, 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // Permite que o Google Apps Script funcione corretamente
      webSecurity: true
    }
  });

  // Carregar o Web App
  mainWindow.loadURL(APP_URL);

  // Maximizar ao abrir
  mainWindow.maximize();

  // Menu personalizado (mínimo)
  const menu = Menu.buildFromTemplate([
    {
      label: 'Hope Clínica',
      submenu: [
        {
          label: 'Recarregar',
          accelerator: 'F5',
          click: () => mainWindow.reload()
        },
        {
          label: 'Recarregar (forçar)',
          accelerator: 'Ctrl+Shift+R',
          click: () => mainWindow.webContents.reloadIgnoringCache()
        },
        { type: 'separator' },
        {
          label: 'Zoom +',
          accelerator: 'Ctrl+=',
          click: () => {
            const zoom = mainWindow.webContents.getZoomLevel();
            mainWindow.webContents.setZoomLevel(zoom + 0.5);
          }
        },
        {
          label: 'Zoom -',
          accelerator: 'Ctrl+-',
          click: () => {
            const zoom = mainWindow.webContents.getZoomLevel();
            mainWindow.webContents.setZoomLevel(zoom - 0.5);
          }
        },
        {
          label: 'Zoom Normal',
          accelerator: 'Ctrl+0',
          click: () => mainWindow.webContents.setZoomLevel(0)
        },
        { type: 'separator' },
        {
          label: 'Tela Cheia',
          accelerator: 'F11',
          click: () => mainWindow.setFullScreen(!mainWindow.isFullScreen())
        },
        { type: 'separator' },
        {
          label: 'Abrir no Navegador',
          click: () => shell.openExternal(APP_URL)
        },
        { type: 'separator' },
        {
          label: 'Sair',
          accelerator: 'Alt+F4',
          click: () => app.quit()
        }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);

  // Abrir links externos no navegador padrão
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://wa.me') || url.startsWith('https://api.whatsapp.com')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    // Permitir popups do Google (login, etc)
    return { action: 'allow' };
  });

  // Splash/Loading enquanto carrega
  mainWindow.webContents.on('did-start-loading', () => {
    mainWindow.setTitle('Hope Clínica - Carregando...');
  });
  
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.setTitle('Hope Clínica - Gestão de Guias');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Quando o app estiver pronto
app.whenReady().then(createWindow);

// Fechar quando todas as janelas fecharem (Windows)
app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
