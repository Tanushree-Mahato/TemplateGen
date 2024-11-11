// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import templateReducer from './templateSlice';
import generatedDocReducer from './generatedDocSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    template: templateReducer,
    document: generatedDocReducer,
  },
});

export default store;
