// src/api.js
const API_BASE_URL = 'https://0b5ff8b0.uqcloud.net/api';
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ4Mjk5NDMifQ.jum7KkebzPe_pkxkzhmqVYRd5ydWYLq9XBkE_tMbzw4';
const USERNAME = 's4829943';

/**
 * Helper function to handle API requests.
 */
async function apiRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JWT_TOKEN}`,
    },
  };

  if (method === 'POST' || method === 'PATCH') {
    options.headers['Prefer'] = 'return=representation';
  }

  if (body) {
    options.body = JSON.stringify({ ...body, username: USERNAME });
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const responseData = await response.json(); 

  if (!response.ok) {
    console.error('API Error:', responseData); 
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return responseData;
}

// Projects API
export const createProject = (project) => apiRequest('/project', 'POST', project);
export const getProjects = () => apiRequest('/project');
export const getProjectById = (id) => apiRequest(`/project?id=eq.${id}`);
export const updateProject = (id, project) => apiRequest(`/project?id=eq.${id}`, 'PATCH', project);
export const deleteProject = async (id) => {
  return apiRequest(`/project?id=eq.${id}`, 'DELETE');
};


// Locations API
export const getLocationsByProjectId = (projectId) => apiRequest(`/location?project_id=eq.${projectId}`);
export const getLocationById = (id) => apiRequest(`/location?id=eq.${id}`);
export const createLocation = (location) => apiRequest('/location', 'POST', location);
export const updateLocation = (id, location) => apiRequest(`/location?id=eq.${id}`, 'PATCH', location);
export const deleteLocation = (id) => apiRequest(`/location?id=eq.${id}`, 'DELETE');
