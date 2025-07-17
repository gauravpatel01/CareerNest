import { useEffect, useState } from "react";
import { FileText, UploadCloud, Settings, HelpCircle, UserCircle, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../Components/common/LoadingSpinner";
import JobCard from "../Components/jobs/JobCard";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/dialog";
import SettingsDialog from "../Components/Dialog/SetingsDialog";

export default function StudentDashboard() {
  const [internships, setInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");

  useEffect(() => {
    loadInternships();
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
    <div className="min-h-screen flex bg-white font-sans">
      {/* Sidebar */}
      <aside className="w-full lg:w-80 bg-blue-50 shadow-lg lg:rounded-xl m-0 lg:m-4 p-4 space-y-6">
        <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800 border-b pb-2">
          <UserCircle className="w-5 h-5" />
          Profile Actions
        </h2>

        <nav className="space-y-4 text-sm font-semibold text-gray-800">
          <Link
            to="/p/updateprofile"
            className="block bg-white hover:bg-blue-100 p-4 rounded-xl border-l-4 border-blue-500 shadow-sm"
          >
            <div className="flex items-start gap-2">
              <UserCircle className="w-5 h-5 mt-1" />
              <div>
                <p>Update Profile</p>
                <p className="text-xs font-normal text-gray-500">Keep your skills, projects, and resume up to date</p>
              </div>
            </div>
          </Link>

          <Link
            to="/p/editresume"
            className="block bg-white hover:bg-blue-100 p-4 rounded-xl border-l-4 border-blue-500 shadow-sm"
          >
            <div className="flex items-start gap-2">
              <FileText className="w-5 h-5 mt-1" />
              <div>
                <p>Edit Resume</p>
                <p className="text-xs font-normal text-gray-500">Create or update your professional resume</p>
              </div>
            </div>
          </Link>

          <Link
            to="/p/uploadresume"
            className="block bg-white hover:bg-blue-100 p-4 rounded-xl border-l-4 border-blue-500 shadow-sm relative"
          >
            <div className="flex items-start gap-2">
              <UploadCloud className="w-5 h-5 mt-1" />
              <div>
                <p>Upload Resume</p>
                <p className="text-xs font-normal text-gray-500">Add your resume to apply for internships</p>
              </div>
            </div>
            <span className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
              !
            </span>
          </Link>

          {/* Settings - Converted to Dialog */}
          <SettingsDialog />

          {/* <Link
            to="/p/help"
            className="block bg-white hover:bg-blue-100 p-4 rounded-xl border-l-4 border-blue-500 shadow-sm"
          >
            <div className="flex items-start gap-2">
              <HelpCircle className="w-5 h-5 mt-1" />
              <div>
                <p>Help</p>
                <p className="text-xs font-normal text-gray-500">Get support and answers to your questions</p>
              </div>
            </div>
          </Link> */}
        </nav>
      </aside>

      {/* Main Section */}
      <div className="hidden md:flex-1 md:flex flex-col">
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

            <div className="h-[70vh] overflow-y-auto pr-2 space-y-4">
              {internships.length > 0 ? (
                internships.map((internship) => <JobCard key={internship.id} job={internship} isInternship={true} />)
              ) : (
                <div className="text-center py-12">
                  <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No internships found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search terms</p>
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setLocationFilter("all");
                      setDurationFilter("all");
                    }}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
