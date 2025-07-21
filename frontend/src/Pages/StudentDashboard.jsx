import { useEffect, useState } from "react";
import LoadingSpinner from "../Components/common/LoadingSpinner";
import JobCard from "../Components/jobs/JobCard";
import Chatbot from "../Components/Chatbot";

export default function StudentDashboard() {
  const [internships, setInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadInternships();
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;
    fetch(`${import.meta.env.VITE_BACKEND_URL || ""}/api/user/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${jwt}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setProfile(data.user);
        else setError("Failed to load profile");
      })
      .catch(() => setError("Failed to load profile"));
  }, []);

  const loadInternships = async () => {
    try {
      const response = await fetch("https://app.base44.com/api/apps/687508e8c02e10285e949016/entities/Job", {
        headers: {
          api_key: "fc6a61ef692346c9b3d1d0749378bd8e",
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const internshipJobs = data.filter((job) => job.job_type === "Internship");
      setInternships(internshipJobs);
    } catch (error) {
      console.error("Error loading internships:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-0 lg:px-8 py-8">
        {/* Profile Summary Card */}
        {profile && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex items-center gap-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500">
              {profile.image ? (
                <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 text-gray-500 font-medium">
                  No Image
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-800">{profile.name}</h2>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-gray-600">{profile.phone}</p>
              <p className="text-gray-500 text-sm">{profile.collegeName} {profile.programme} {profile.branch}</p>
            </div>
          </div>
        )}
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {/* Main Section */}
        <div className="flex flex-col">
          <main className="p-6">
            <div className="bg-blue-100 border-l-4 border-blue-400 shadow p-6 rounded-xl mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome, Username! 👋</h2>
              <p className="text-gray-600 text-sm">
                Explore the latest internships and build your career with confidence
              </p>
            </div>

            {/* Featured Opportunities */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">Featured Opportunities</h3>
              <div className="space-y-4 max-w-4xl w-full mx-auto px-2">
                {internships.slice(0, 6).map((internship) => (
                  <JobCard key={internship.id} job={internship} />
                ))}
              </div>
            </div>
          </main>
        </div>

        {/* Chatbot */}
        <Chatbot />
      </div>
    </div>
  );
}
