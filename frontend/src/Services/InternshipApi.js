export const API_URL = 'https://app.base44.com/api/apps/6879acf793e21765c6c4b5c7/entities/Internship';
export const API_KEY = 'fc6a61ef692346c9b3d1d0749378bd8e';

export async function fetchInternshipsFromAPI() {
  const response = await fetch(API_URL, {
    headers: {
      'api_key': API_KEY,
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

export async function updateInternshipStatus(entityId, status) {
  const response = await fetch(`${API_URL}/${entityId}`, {
    method: 'PUT',
    headers: {
      'api_key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  return response.json();
}