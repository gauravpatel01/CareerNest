import React, { useEffect, useState } from "react";
import { Button } from "../Components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ProfileView() {
  const [profile, setProfile] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      setError("Not authenticated");
      return;
    }
    fetch(`${import.meta.env.VITE_BACKEND_URL || ""}/api/user/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${jwt}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setProfile(data.user);
          setUserRole(data.user.role);
        } else {
          setError("Failed to load profile");
        }
      })
      .catch(() => setError("Failed to load profile"));
  }, []);

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }
  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-8 font-sans">
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-xl">
            {profile.image ? (
              <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 text-gray-500 font-medium">
                No Image
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-blue-800 mt-2">{profile.name}</h1>
          <p className="text-gray-600">{profile.email}</p>
          <p className="text-gray-600">{profile.phone}</p>
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mt-1">
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-blue-600 mb-2">Address</h2>
            <p>{profile.address?.street}</p>
            <p>{profile.address?.city}, {profile.address?.state} {profile.address?.zip}</p>
            <h2 className="text-lg font-semibold text-blue-600 mt-4 mb-2">About</h2>
            <p>{profile.about}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-blue-600 mb-2">Social Links</h2>
            {profile.github && <p><a href={profile.github} className="text-blue-500" target="_blank" rel="noopener noreferrer">GitHub</a></p>}
            {profile.linkedin && <p><a href={profile.linkedin} className="text-blue-500" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>}
            {profile.portfolio && <p><a href={profile.portfolio} className="text-blue-500" target="_blank" rel="noopener noreferrer">Portfolio</a></p>}
          </div>
        </div>
        {userRole === "recruiter" ? (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-blue-600 mb-2">Company Details</h2>
            <p><b>Company Name:</b> {profile.company_name}</p>
            <p><b>Company Size:</b> {profile.company_size}</p>
            <p><b>Industry:</b> {profile.industry}</p>
            <p><b>Job Title:</b> {profile.job_title}</p>
            <p><b>Website:</b> {profile.company_website}</p>
            <p><b>Description:</b> {profile.company_description}</p>
            <p><b>Location:</b> {profile.location}</p>
          </div>
        ) : (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-blue-600 mb-2">College Details</h2>
            <p><b>College Name:</b> {profile.collegeName}</p>
            <p><b>Programme:</b> {profile.programme}</p>
            <p><b>Branch:</b> {profile.branch}</p>
            <p><b>Passing Year:</b> {profile.year}</p>
          </div>
        )}
        <div className="flex justify-center">
          <Button onClick={() => navigate("/p/updateprofile")}>Edit / Update Profile</Button>
        </div>
      </div>
    </div>
  );
} 