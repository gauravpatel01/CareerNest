const API_BASE_URL = 'http://localhost:5000';

class ApplicationApi {
  static async create(applicationData) {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/applications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        throw new Error('Failed to create application');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  }

  static async list(filters = {}) {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await fetch(`${API_BASE_URL}/api/applications?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  }

  static async getById(applicationId) {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/applications/${applicationId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch application');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching application:', error);
      throw error;
    }
  }

  static async update(applicationId, applicationData) {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        throw new Error('Failed to update application');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating application:', error);
      throw error;
    }
  }

  static async delete(applicationId) {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/applications/${applicationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete application');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  }
}

export default ApplicationApi; 