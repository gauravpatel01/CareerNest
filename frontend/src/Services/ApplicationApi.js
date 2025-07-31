
const API_URL = 'https://app.base44.com/api/apps/688ba1559021f102016f49bb/entities/Application';
const API_KEY = 'fc6a61ef692346c9b3d1d0749378bd8e'; // Move to .env for production

const headers = {
  'api_key': API_KEY,
  'Content-Type': 'application/json'
};

const ApplicationApi = {
  async list() {
    const response = await fetch(API_URL, { headers });
    if (!response.ok) throw new Error("Failed to fetch applications");
    const json = await response.json();
    return json.entities || [];
  },

  async update(id, data) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update application");
    return await response.json();
  }
};

export default ApplicationApi;

