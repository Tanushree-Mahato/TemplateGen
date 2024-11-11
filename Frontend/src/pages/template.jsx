import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Grid, Card, CardMedia, CardContent, CardActions, CardHeader, CardActionArea } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addNewTemplate, fetchTemplates, generateTemplate } from '../store/templateSlice';

function TemplatePage(props) {
  const { token } = useSelector((state) => state.auth);
  const { templates, loading, error, currentPage, totalPages } = useSelector((state) => state.template);
  const dispatch = useDispatch();
  const [tempName, setTempName] = useState('');
  const [tempFile, setTempFile] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [templateData, setTemplateData] = useState(null); // Store the selected template data
  const [inputValues, setInputValues] = useState({}); // Store input values for placeholders
  const [livePreview, setLivePreview] = useState(''); // Store live preview of the template content

  // Handle opening the add template modal
  const handleAddTemplate = () => {
    setTempName('');
    setTempFile(null);
    setAddModalOpen(true);
  };

  // Handle saving the new template
  const handleSaveNewTemplate = async () => {
    if (!tempName || !tempFile) {
      alert('Please provide both a template name and a file.');
      return;
    }

    const result = await dispatch(addNewTemplate({ token, file: tempFile, name: tempName }));
    setAddModalOpen(false);
    dispatch(fetchTemplates({ token, page: currentPage, limit: 10 }));
  };
  const handleGenerateDocument = async () => {

    console.log(templateData)
    const result = await dispatch(generateTemplate({ token, templaetId: templateData._id, templateData: inputValues, format: templateData.path.split('.').pop().toLowerCase() }));

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/gentemp');
    }
  };

  // Handle page change for pagination
  const handlePageChange = (event, value) => {
    dispatch(fetchTemplates({ token, page: value, limit: 10 }));
  };

  // Handle opening the generate modal for a template
  const handleGenerateTemplate = (template) => {
    setTemplateData(template); // Store template data for live preview
    setInputValues({}); // Clear previous input values
    setLivePreview(template.content); // Set the initial content for preview
    setGenerateModalOpen(true); // Open the modal
  };

  // Handle input change and update live preview
  const handleInputChange = (e, placeholder) => {
    const { value } = e.target;
    setInputValues({ ...inputValues, [placeholder]: value });
    let updatedPreview = templateData.content;

    // Replace placeholders in the content with input values
    Object.keys(inputValues).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      updatedPreview = updatedPreview.replace(regex, inputValues[key]);
    });

    // Update live preview with the new content
    updatedPreview = updatedPreview.replace(new RegExp(`{{${placeholder}}}`, 'g'), value);
    setLivePreview(updatedPreview); // Set the live preview
  };

  // Fetch templates on page load or when the page changes
  useEffect(() => {
    dispatch(fetchTemplates({ token, page: currentPage, limit: 10 }));
  }, [dispatch, token, currentPage]);

  return (
    <Box sx={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>

      <div className='flex justify-between mb-10'>
        <h2 className="text-2xl font-extrabold">Templates</h2>
        <button onClick={handleAddTemplate}
          className="text-white bg-green-600 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Add Template
        </button>
      </div>

      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((template) => (
            <Card
              key={template._id}
              className="shadow-sm rounded-lg border border-2 border-green-600 flex flex-col justify-between"
            >
               <CardHeader 
                  title={template?.path && template.path.slice(template.path.lastIndexOf(".") + 1)} 
                  className={template?.path && template.path.slice(template.path.lastIndexOf(".") + 1) === 'pdf' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'} />
                  <CardContent className="p-3">
                <p className="text-sm font-medium text-gray-900">{template.name}</p>
                {template.content && (
                  <p className="text-sm text-gray-500">{template?.content && template.content.slice(0, 100)}</p>
                )}
              </CardContent>
              {/* Replacing CardActionArea with Box */}
              <Box>
                <CardActions className="p-3 mt-auto justify-between">
                  <button
                    onClick={() => handleGenerateTemplate(template)}
                    className="text-white bg-green-600 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleGenerateTemplate(template)}
                    className="text-white bg-green-600 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Generate
                  </button>
                </CardActions>
              </Box>
            </Card>

          ))}
        </div>

      </div>

      {/* Pagination Controls */}
      <Pagination
        size='small'
        shape='rounded'
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}
      />

      {/* Modal for Adding New Template */}
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} maxWidth='xs' fullWidth>
        <DialogTitle>
          <h5 className="text-xl font-bold font-sans text-green-600"> Add New Template</h5>
        </DialogTitle>

        <DialogContent>
          <TextField
            label="Template Name"
            value={tempName}
            type="text"
            onChange={(e) => setTempName(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            type="file"
            onChange={(e) => setTempFile(e.target.files[0])}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <button onClick={() => setAddModalOpen(false)}
            className="bg-white text-green-600 border border-green-600 rounded-md shadow-md hover:text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button onClick={handleSaveNewTemplate}
            className="text-white bg-green-600 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Save Template
          </button>
        </DialogActions>
      </Dialog>

      {/* Modal for Generating Template with Placeholders */}
      <Dialog
        maxWidth='lg' fullWidth
        open={generateModalOpen} onClose={() => setGenerateModalOpen(false)}>
        <DialogTitle>
          <h5 className="text-xl font-bold font-sans text-green-600">Generate Template</h5>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              {/* Input Fields */}
              {templateData && templateData.placeholders && templateData.placeholders.map((placeholder, index) => (
                <TextField
                  key={index}
                  label={placeholder}
                  value={inputValues[placeholder] || ''}
                  onChange={(e) => handleInputChange(e, placeholder)}
                  fullWidth
                  margin="dense"
                />
              ))}
            </Grid>
            <Grid item xs={9}>
              <center>
                <h5 className="text-sm font-bold font-sans text-black">Live Preview</h5>
              </center>
              <Card className='p-5 mt-2'>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', marginTop: '8px' }}>
                  {livePreview}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <button onClick={() => setGenerateModalOpen(false)}
            className="bg-white text-green-600 border border-green-600 rounded-md shadow-md hover:text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button onClick={() => { setGenerateModalOpen(false); handleGenerateDocument() }}
            className="text-white bg-green-600 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Generate Template
          </button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TemplatePage;
