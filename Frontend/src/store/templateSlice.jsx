// src/redux/templateSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addTemplate, getTemplates, generateDocument, deleteTemplate } from '../apis/template';

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

// Async thunk for generating a document
export const generateTemplate = createAsyncThunk('/documents/generate', async (credentials, thunkAPI) => {
  try {
    const response = await generateDocument(credentials.token, credentials.templateId, credentials.templateData, credentials.format);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Document generation failed');
  }
});

// Async thunk for fetching templates
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

// Async thunk for deleting a template
export const deleteTemplateById = createAsyncThunk('/template/delete', async (credentials, thunkAPI) => {
  try {
    const response = await deleteTemplate(credentials.token, credentials.templateId);
    return credentials.templateId;  // Return the templateId to remove it from state
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Failed to delete template');
  }
});

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
      })
      .addCase(fetchTemplates.pending, (state) => {
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
      })
      // Cases for delete template
      .addCase(deleteTemplateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTemplateById.fulfilled, (state, action) => {
        state.templates = state.templates.filter(template => template.id !== action.payload);  // Remove the deleted template from the state
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteTemplateById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

// Export the reducer
export default templateSlice.reducer;
