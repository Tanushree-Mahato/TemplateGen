import backendURL from "./config";
  
export const login = async (email, password) => {
    const response = await backendURL.post('/auth/login', { email, password });
    return response.data;
};

export const signup = async (username, email, password) => {
    console.log(username, email, password)
    const response = await backendURL.post('/auth/signup', { username, email, password });
    return response.data;
};