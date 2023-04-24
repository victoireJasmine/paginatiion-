import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/style.css';

import App from './app/app';

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
);
