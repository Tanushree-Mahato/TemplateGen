// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import store from './store/store';
import Router from './router';

const rootElement = document.getElementById('root');

createRoot(rootElement).render(
  <Provider store={store}>
    <Router />
  </Provider>
);

