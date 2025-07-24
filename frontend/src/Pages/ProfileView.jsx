import React, { useEffect, useState } from "react";
import { Button } from "../Components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../Components/ui/card";
import { Facebook, Github, Globe, Instagram, Linkedin, Twitter } from "lucide-react";

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
        {/* Responsive Cards Section */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-blue-600">Address</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p>{profile.address?.street}</p>
                <p>
                  {profile.address?.city} {profile.address?.state} {profile.address?.zip}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-blue-600">About</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p>{profile.about}</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-600 mt-4 md:mt-0">Social Links</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex gap-6 items-center">
                {profile.github && (
                  <button
                    type="button"
                    onClick={() => window.open(profile.github, "_blank", "noopener,noreferrer")}
                    className="hover:text-blue-600 transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="w-7 h-7" />
                  </button>
                )}
                {profile.linkedin && (
                  <button
                    type="button"
                    onClick={() => window.open(profile.linkedin, "_blank", "noopener,noreferrer")}
                    className="hover:text-blue-600 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-7 h-7" />
                  </button>
                )}
                {profile.facebook && (
                  <button
                    type="button"
                    onClick={() => window.open(profile.facebook, "_blank", "noopener,noreferrer")}
                    className="hover:text-blue-600 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-7 h-7" />
                  </button>
                )}
                {profile.instagram && (
                  <button
                    type="button"
                    onClick={() => window.open(profile.instagram, "_blank", "noopener,noreferrer")}
                    className="hover:text-blue-600 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-7 h-7" />
                  </button>
                )}
                {profile.twitter && (
                  <button
                    type="button"
                    onClick={() => window.open(profile.twitter, "_blank", "noopener,noreferrer")}
                    className="hover:text-blue-600 transition-colors"
                    aria-label="twitter"
                  >
                    <Twitter className="w-7 h-7" />
                  </button>
                )}
                {profile.portfolio && (
                  <button
                    type="button"
                    onClick={() => window.open(profile.portfolio, "_blank", "noopener,noreferrer")}
                    className="hover:text-blue-600 transition-colors"
                    aria-label="Portfolio"
                  >
                    <Globe className="w-7 h-7" />
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Responsive College/Company Details Card */}
        <div className="mb-6">
          {userRole === "recruiter" ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-blue-600">Company Details</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p>
                  <b>Company Name:</b> {profile.company_name}
                </p>
                <p>
                  <b>Company Size:</b> {profile.company_size}
                </p>
                <p>
                  <b>Industry:</b> {profile.industry}
                </p>
                <p>
                  <b>Job Title:</b> {profile.job_title}
                </p>
                <p>
                  <b>Website:</b> {profile.company_website}
                </p>
                <p>
                  <b>Description:</b> {profile.company_description}
                </p>
                <p>
                  <b>Location:</b> {profile.location}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-blue-600">College Details</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p>
                  <b>College Name:</b> {profile.collegeName}
                </p>
                <p>
                  <b>Programme:</b> {profile.programme}
                </p>
                <p>
                  <b>Branch:</b> {profile.branch}
                </p>
                <p>
                  <b>Passing Year:</b> {profile.year}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="flex justify-center">
          <Button onClick={() => navigate("/p/updateprofile")}>Edit / Update Profile</Button>
        </div>
      </div>
    </div>
  );
}
