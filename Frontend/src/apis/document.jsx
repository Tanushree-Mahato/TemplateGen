import backendURL from "./config";

export const getDocuments = async (token, page, limit) => {
    try {
        const response = await backendURL.post('/documents/getDoc',
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

export const getRecentDoc = async (token) => {
    try {
        const response = await backendURL.get('/documents/getRecentDoc',
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
export const downloadDoc = async (token, id) => {
    try {
        console.log(token, id)
        const response = await backendURL.post('/documents/download', { id },
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

