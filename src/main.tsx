import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ToastProvider } from './components/common/ToastContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary
    fallbackTitle="Erreur inattendue de l'application"
    fallbackMessage="Un problème d'affichage est survenu. Cliquez ci-dessous pour recharger l'interface sans perdre vos fiches."
    resetLabel="Relancer l'affichage"
  >
    <ToastProvider>
      <App />
    </ToastProvider>
  </ErrorBoundary>
);
