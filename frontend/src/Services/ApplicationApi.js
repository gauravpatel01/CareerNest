// Use a simple approach for API base URL that works in browser
const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create application');
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

  static async updateStatus(applicationId, status) {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }

  // Helper method to create job application
  static async createJobApplication(jobId, applicationData) {
    return this.create({
      ...applicationData,
      job_id: jobId,
      application_type: 'job'
    });
  }

  // Helper method to create internship application
  static async createInternshipApplication(internshipId, applicationData) {
    return this.create({
      ...applicationData,
      internship_id: internshipId,
      application_type: 'internship'
    });
  }

  // Get applications for a specific job
  static async getJobApplications(jobId) {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/applications/job/${jobId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch job applications');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching job applications:', error);
      throw error;
    }
  }

  // Get applications for a specific internship
  static async getInternshipApplications(internshipId) {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/applications/internship/${internshipId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch internship applications');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching internship applications:', error);
      throw error;
    }
  }

  // Get applications by applicant email
  static async getApplicantApplications(email) {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/applications/applicant/${email}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applicant applications');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching applicant applications:', error);
      throw error;
    }
  }
}

export default ApplicationApi; 