export async function fetchInternshipsFromAPI() {
  const adminToken = localStorage.getItem("admin-token");
  const response = await fetch('/api/internships', {
    headers: {
      'Content-Type': 'application/json',
      'x-admin-auth': 'true',
      'Authorization': `Bearer ${adminToken}`,
    },
  });
  return response.json();
}

// Add method to fetch internships with filters for recruiters
export async function fetchInternships(filters = {}) {
  try {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        queryParams.append(key, filters[key]);
      }
    });

    const response = await fetch(`/api/internships?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch internships');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching internships:', error);
    throw error;
  }
}

export async function updateInternshipStatus(entityId, status) {
  const adminToken = localStorage.getItem("admin-token");
  const response = await fetch(`/api/internships/${entityId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-auth': 'true',
      'Authorization': `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ status }),
  });
  return response.json();
}