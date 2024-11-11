// src/redux/templateSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addTemplate, getTemplates, generateDocument } from '../apis/template';

const initialState = {
  templates: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalTemplates: 0,
};

// Async thunk for adding a template
export const addNewTemplate = createAsyncThunk('/template/upload', async (credentials, thunkAPI) => {
  try {
    const response = await addTemplate(credentials.token, credentials.file, credentials.name);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Template addition failed');
  }
});
export const generateTemplate = createAsyncThunk('/documents/generate', async (credentials, thunkAPI) => {
  try {
    const response = await generateDocument(credentials.token, credentials.templaetId, credentials.templateData, credentials.format);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Template addition failed');
  }
});
export const fetchTemplates = createAsyncThunk(
  'template/getTemplates',
  async (credentials, thunkAPI) => {
    try {
      const response = await getTemplates(credentials.token, credentials.page, credentials.limit);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch templates');
    }
  }
);

// Define the template slice
const templateSlice = createSlice({
  name: 'template',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(addNewTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewTemplate.fulfilled, (state, action) => {
        state.templates.push(action.payload); // Add the new template to the state
        state.loading = false;
        state.error = null;
      })
      .addCase(addNewTemplate.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      }).addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.templates = action.payload.templates;  // Update the templates state with fetched templates
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalTemplates = action.payload.totalTemplates;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(generateTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(generateTemplate.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
    // If `checkLoginStatus` is needed, ensure it is imported and added here
  },
});

// Export the reducer
export default templateSlice.reducer;
