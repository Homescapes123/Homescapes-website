import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {initBotId} from 'botid/client/core';
import App from './App.tsx';
import './index.css';

// Vercel BotID: attaches an invisible browser challenge to enquiry submissions (checked in api/enquiry.ts).
// It does nothing in local development.
initBotId({protect: [{path: '/api/enquiry', method: 'POST'}]});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
