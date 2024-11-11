import backendURL from "./config";

export const addTemplate = async (token, file, name) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);

    try {
        const response = await backendURL.post('/templates/upload', formData, {
            headers: {
                Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
                'Content-Type': 'multipart/form-data', // Let axios set the correct content type
            },
        });
        return response.data;
    } catch (error) {
        throw error; // Handle or throw error if the request fails
    }
};

export const getTemplates = async (token, page, limit) => {
    try {
        const response = await backendURL.post('/templates/getTemplates',
            {
                page,
                limit
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
                    'Content-Type': 'application/json', // Ensure correct content type for JSON payload
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error; // Handle or throw error if the request fails
    }
};

export const generateDocument = async (token, templateId, data, format) => {
    try {
        const response = await backendURL.post('/documents/generate',
            {
                templateId, data, format
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
                    'Content-Type': 'application/json', // Ensure correct content type for JSON payload
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error; // Handle or throw error if the request fails
    }
};

// Function to delete a template by its ID
export const deleteTemplate = async (token, templateId) => {
    try {
        const response = await backendURL.delete(`/templates/${templateId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
        });
        return response.data;
    } catch (error) {
        throw error; // Handle or throw error if the request fails
    }
};
