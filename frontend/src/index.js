import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/global.css'; // Custom CSS
import './assets/styles/user-pages.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);