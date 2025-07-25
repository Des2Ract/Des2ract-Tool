
import { createRoot } from 'react-dom/client';
import App from './App';
import { TerminalContextProvider } from 'react-terminal';
import './index.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <TerminalContextProvider>
      <App />
    </TerminalContextProvider>
  );
}