import React from 'react';
import { Box } from '@mui/material';
import TemplateGallery from '../components/templateGallery';
import RecentDocuments from '../components/recentDocuments';

function Dashboard() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <TemplateGallery />
      <RecentDocuments />
    </Box>
  );
}

export default Dashboard;
