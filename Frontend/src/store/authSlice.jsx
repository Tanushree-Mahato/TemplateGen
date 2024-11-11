// src/redux/authSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { login, signup } from '../apis/login';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null
};

export const checkLoginStatus = createAsyncThunk('auth/checkLoginStatus', async (_, thunkAPI) => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      if (token) {
        return { token };
      } else {
        localStorage.removeItem('token');
        return thunkAPI.rejectWithValue('Token expired');
      }
    } catch (error) {
      localStorage.removeItem('token');
      return thunkAPI.rejectWithValue('Invalid token');
    }
  } else {
    return thunkAPI.rejectWithValue('No token found');
  }
});

export const loginUser = createAsyncThunk('/auth/login', async (credentials, thunkAPI) => {
  try {
    const response = await login(credentials.email, credentials.password);
    localStorage.setItem('token', response.token);
    return response; 
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Login failed'); 
  }
});

export const signupUser = createAsyncThunk('auth/signup', async (credentials, thunkAPI) => {
  try {
    const response = await signup(credentials.username, credentials.email, credentials.password);
    localStorage.setItem('token', response.token); // Save token in localStorage
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message || 'SignUp failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      console.log('called')
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('token');
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login user handling
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token; // Save the token from response
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload.user; // Assuming user data is in the response
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload; // Capture error message
        state.loading = false;
      })

      // Signup user handling
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.token = action.payload.token; // Save the token from response
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload.user; // Assuming user data is in the response
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.error = action.payload; // Capture error message
        state.loading = false;
      })

      // Check login status handling
      .addCase(checkLoginStatus.fulfilled, (state, action) => {
        state.token = action.payload.token; // Save the token from response
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(checkLoginStatus.rejected, (state, action) => {
        state.error = action.payload; // Capture error message
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;