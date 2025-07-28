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