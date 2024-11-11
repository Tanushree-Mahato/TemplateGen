import React, { useEffect, useRef } from 'react';
import { Card, CardMedia, CardContent, IconButton, Grid, CardHeader } from '@mui/material';
import { Add, ArrowForward, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchTemplates } from '../store/templateSlice';
import { useDispatch, useSelector } from 'react-redux';
import '../styles/TemplateGallery.css';

function TemplateGallery() {
  const { token } = useSelector((state) => state.auth);
  const { templates, currentPage } = useSelector((state) => state.template);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'right' ? 200 : -200;
      scrollRef.current.scrollLeft += scrollAmount;
    }
  };

  useEffect(() => {
    dispatch(fetchTemplates({ token, page: currentPage, limit: 10 }));
  }, [dispatch, token, currentPage]);

  return (
    <div className="template-gallery-container bg-green-500 rounded-xl p-6 relative bg-opacity-30">
      <div className="template-gallery-header flex items-center justify-between mb-4">
        <h5 className="text-xl font-extrabold">Start a new document</h5>
      </div>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6} sm={4} md={3} lg={1.8}>
          <Card
            onClick={() => navigate('/template')}
            className="template-add-card w-40 min-w-[160px] h-48 shadow-sm rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 bg-gray-100 cursor-pointer"
          >
            <Add fontSize="large" className="text-blue-800" />
          </Card>
        </Grid>

        <Grid item xs={12} sm={8} md={9} lg={10.2}>
          <div className="relative flex items-center">
            {/* Scroll Left Button */}
            {templates.length >= 5 && (
              <IconButton
                onClick={() => handleScroll('left')}
                className="carousel-button left-0"
              >
                <ArrowBack />
              </IconButton>
            )}

            <div
              ref={scrollRef}
              className="template-carousel-container flex space-x-4 overflow-x-auto p-1 hide-scrollbar"
            >
             {templates.map((template, index) => (
  <Card 
    key={index} 
    className="template-card h-48 w-40 min-w-[160px] shadow-sm rounded-lg overflow-hidden border border-gray-200"
  >
    <CardHeader 
      title={template?.path ? template.path.slice(template.path.lastIndexOf(".") + 1) : 'Unknown'} 
      className={
        template?.path && template.path.slice(template.path.lastIndexOf(".") + 1) === 'pdf' 
          ? 'bg-red-600 text-white' 
          : 'bg-blue-600 text-white'
      } 
    />
    <CardContent className="p-3">
      <p className="text-sm font-medium text-gray-900">
        {template.name || 'No Name'}
      </p>
      {template?.content && (
        <p className="text-sm text-gray-500">
          {template.content.slice(0, 100)}
        </p>
      )}
    </CardContent>
  </Card>
))}
            </div>

            {templates.length >= 5 && (
              <IconButton
                onClick={() => handleScroll('right')}
                className="carousel-button right-0"
              >
                <ArrowForward />
              </IconButton>
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default TemplateGallery;
