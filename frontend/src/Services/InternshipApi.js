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

    const jwt = localStorage.getItem("jwt");
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add JWT token if available (for recruiter requests)
    if (jwt) {
      headers['Authorization'] = `Bearer ${jwt}`;
    }

    const response = await fetch(`/api/internships?${queryParams}`, {
      method: 'GET',
      headers,
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

// Create new internship
export async function createInternship(internshipData) {
  try {
    const jwt = localStorage.getItem("jwt");
    const response = await fetch('/api/internships/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify(internshipData),
    });

    if (!response.ok) {
      throw new Error('Failed to create internship');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating internship:', error);
    throw error;
  }
}

// Update internship
export async function updateInternship(internshipId, updateData) {
  try {
    const jwt = localStorage.getItem("jwt");
    const response = await fetch(`/api/internships/${internshipId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error('Failed to update internship');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating internship:', error);
    throw error;
  }
}

// Delete internship
export async function deleteInternship(internshipId) {
  try {
    const jwt = localStorage.getItem("jwt");
    const response = await fetch(`/api/internships/${internshipId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete internship');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting internship:', error);
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