import React, { useEffect, useState } from 'react';
import { Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Card, CardActions, CardHeader, Pagination, Grid, Button, CardContent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addNewTemplate, fetchTemplates, generateTemplate, deleteTemplateById } from '../store/templateSlice';

function TemplatePage(props) {
  const { token } = useSelector((state) => state.auth);
  const { templates, loading, error, currentPage, totalPages } = useSelector((state) => state.template);
  const dispatch = useDispatch();

  const [tempName, setTempName] = useState('');
  const [tempFile, setTempFile] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [templateData, setTemplateData] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [livePreview, setLivePreview] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // State for the delete warning modal
  const [templateToDelete, setTemplateToDelete] = useState(null); // Store the selected template to delete

  // Open add template modal
  const handleAddTemplate = () => {
    setTempName('');
    setTempFile(null);
    setAddModalOpen(true);
  };

  // Save new template
  const handleSaveNewTemplate = async () => {
    if (!tempName || !tempFile) {
      alert('Please provide both a template name and a file.');
      return;
    }

    await dispatch(addNewTemplate({ token, file: tempFile, name: tempName }));
    setAddModalOpen(false);
    dispatch(fetchTemplates({ token, page: currentPage, limit: 10 }));
  };

  // Generate document
  const handleGenerateDocument = async () => {
    const result = await dispatch(generateTemplate({ token, templateId: templateData._id, templateData: inputValues, format: templateData.path.split('.').pop().toLowerCase() }));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/gentemp');
    }
  };

  // Open delete warning modal
  const handleDeleteTemplate = (template) => {
    setTemplateToDelete(template);
    setDeleteModalOpen(true);
  };

  // Confirm deletion of template
  const confirmDeleteTemplate = async () => {
    await dispatch(deleteTemplateById({ token, templateId: templateToDelete._id }));
    setDeleteModalOpen(false);
    setTemplateToDelete(null);
    dispatch(fetchTemplates({ token, page: currentPage, limit: 10 }));
  };

  // Open generate modal
  const handleGenerateTemplate = (template) => {
    setTemplateData(template);
    setInputValues({});
    setLivePreview(template.content);
    setGenerateModalOpen(true);
  };

  // Handle input change and update live preview
  const handleInputChange = (e, placeholder) => {
    const { value } = e.target;
    setInputValues({ ...inputValues, [placeholder]: value });
    let updatedPreview = templateData.content;

    Object.keys(inputValues).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      updatedPreview = updatedPreview.replace(regex, inputValues[key]);
    });

    updatedPreview = updatedPreview.replace(new RegExp(`{{${placeholder}}}`, 'g'), value);
    setLivePreview(updatedPreview);
  };

  // Fetch templates on page load or when the page changes
  useEffect(() => {
    dispatch(fetchTemplates({ token, page: currentPage, limit: 10 }));
  }, [dispatch, token, currentPage]);

  return (
    <Box sx={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Templates and Add Template Button */}
      <div className="flex justify-between mb-10">
        <h2 className="text-2xl font-extrabold">Templates</h2>
        <Button onClick={handleAddTemplate} variant="contained" color="success">
          Add Template
        </Button>
      </div>

      {/* Template Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map((template) => (
          <Card key={template._id} className="shadow-sm rounded-lg border-2 border-green-600">
            <CardHeader
              title={template.path.split('.').pop().toUpperCase()}
              className={template.path.endsWith('.pdf') ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}
            />
            <CardContent>
              <Typography variant="body2" color="textSecondary">{template.name}</Typography>
              {template.content && <Typography variant="body2">{template.content.slice(0, 100)}</Typography>}
            </CardContent>
            <CardActions>
              <Button color="error" onClick={() => handleDeleteTemplate(template)}>Delete</Button>
              <Button color="success" onClick={() => handleGenerateTemplate(template)}>Generate</Button>
            </CardActions>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(e, value) => dispatch(fetchTemplates({ token, page: value, limit: 10 }))}
        sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
      />

      {/* Add Template Modal */}
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add New Template</DialogTitle>
        <DialogContent>
          <TextField label="Template Name" value={tempName} onChange={(e) => setTempName(e.target.value)} fullWidth />
          <TextField type="file" onChange={(e) => setTempFile(e.target.files[0])} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveNewTemplate} color="primary">Save Template</Button>
        </DialogActions>
      </Dialog>

      {/* Generate Template Modal */}
      <Dialog open={generateModalOpen} onClose={() => setGenerateModalOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Generate Template</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              {templateData?.placeholders?.map((placeholder, index) => (
                <TextField
                  key={index}
                  label={placeholder}
                  value={inputValues[placeholder] || ''}
                  onChange={(e) => handleInputChange(e, placeholder)}
                  fullWidth
                />
              ))}
            </Grid>
            <Grid item xs={9}>
              <Card className="p-5 mt-2">
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{livePreview}</Typography>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGenerateModalOpen(false)}>Cancel</Button>
          <Button onClick={handleGenerateDocument} color="primary">Generate</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this template?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteTemplate} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TemplatePage;
