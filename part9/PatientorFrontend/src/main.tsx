import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { reducer, StateProvider } from './state';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StateProvider reducer={reducer}>
    <App />
  </StateProvider>
  ,
);
