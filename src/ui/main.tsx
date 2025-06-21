
import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ElectronProvider } from './components/ElectronContext';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <ElectronProvider>
      <App />
    </ElectronProvider>
  );
}