// src/redux/generatedDocSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDocuments, getRecentDoc, downloadDoc } from '../apis/document';

const initialState = {
  documents: [],
  recent: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalDocuments: 0,
};

export const fetchGeneratedDoc = createAsyncThunk('/documents/getDoc', async (credentials, thunkAPI) => {
  try {
    const response = await getDocuments(credentials.token, credentials.page, credentials.limit);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch documents');
  }
}
);

export const fetchRecentDoc = createAsyncThunk('/documents/getRecentDoc', async (credentials, thunkAPI) => {
  try {
    const response = await getRecentDoc(credentials.token);
    console.log(response)
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch recent documents');
  }
}
);
export const downloadDocument = createAsyncThunk(
  '/documents/download',
  async (credentials, thunkAPI) => {
    try {
      console.log(credentials)
      const response = await downloadDoc(credentials.token, credentials.id);
      const fileUrl = response.fileUrl;
      console.log(fileUrl)
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileUrl.split('/').pop(); // Optional: extract filename from the URL
      document.body.appendChild(link);
      link.click();
      link.remove();

      return response; // Return response in case additional processing is needed
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to download document');
    }
  }
);

const generatedDocSlice = createSlice({
  name: 'documents',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeneratedDoc.fulfilled, (state, action) => {
        state.documents = action.payload.documents;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalDocuments = action.payload.totalDocuments;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchGeneratedDoc.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchGeneratedDoc.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentDoc.fulfilled, (state, action) => {
        state.recent = action.payload.documents;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchRecentDoc.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchRecentDoc.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
  },
});

// Export the reducer
export default generatedDocSlice.reducer;
