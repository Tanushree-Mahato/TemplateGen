import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardActions, Button, Typography, Pagination } from '@mui/material';
import { Download } from '@mui/icons-material';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { fetchGeneratedDoc, downloadDocument } from '../store/generatedDocSlice';
import { useDispatch, useSelector } from 'react-redux';

function GenTempPage() {
  const { token } = useSelector((state) => state.auth);
  const { documents, loading, error, currentPage, totalPages } = useSelector((state) => state.document);
  const dispatch = useDispatch();

  const handlePageChange = (event, value) => {
    dispatch(fetchGeneratedDoc({ token, page: value, limit: 10 }));
  };

  useEffect(() => {
    dispatch(fetchGeneratedDoc({ token, page: currentPage, limit: 10 }));
  }, [dispatch, token, currentPage]);

  return (
    <Box sx={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <h2 className="text-2xl font-extrabold mb-10">Generated Documents</h2>

      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {documents.map((document, index) => (
            <Card
              key={index + 1}
              className="h-60 shadow-sm rounded-lg border border-green-600 flex flex-col justify-between"
            >

              <CardContent className="p-3 flex-grow">
                <p className="text-sm font-medium text-gray-900">{document.name}</p>
                {document.content && (
                  <p className="text-sm text-gray-500">{document?.content && document.content.slice(0, 100)}</p>
                )}
              </CardContent>
              <CardActions className="p-3 mt-auto">
                <button
                  onClick={() => {
                    dispatch(downloadDocument({ token, id: document.id }))
                  }}
                  className={`${document.format === 'PDF' ? 'bg-red-600' : 'bg-blue-600'} text-white rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                >
                  <Download />
                </button>
              </CardActions>

            </Card>
          ))}
        </div>

      </div>

      <Pagination
        size='small'
        shape='rounded'
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}
      />
    </Box>
  );
}

export default GenTempPage;
