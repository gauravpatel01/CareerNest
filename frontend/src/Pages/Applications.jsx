import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
  FileText,
  Briefcase,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ApplicationApi from "../Services/ApplicationApi";
import { useNavigate } from "react-router-dom";

export default function Applications() {
  console.log("Applications component rendering...");
  
  // Simple test render to see if component loads
  if (!localStorage.getItem("user")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">Loading Applications...</h2>
          <p className="text-gray-500">Please wait while we check your authentication.</p>
        </div>
      </div>
    );
  }
  
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Applications component mounted");
    console.log("Current user:", localStorage.getItem("user"));
    console.log("JWT token:", localStorage.getItem("jwt"));
    
    // Check if user is authenticated and is a recruiter
    const userStr = localStorage.getItem("user");
    const jwt = localStorage.getItem("jwt");
    
    if (!userStr || !jwt) {
      console.log("User not authenticated, redirecting to recruiter auth");
      navigate("/p/recruiterauth");
      return;
    }
    
    try {
      const user = JSON.parse(userStr);
      console.log("User role:", user.role);
      
      if (user.role !== "recruiter") {
        console.log("User is not a recruiter, redirecting");
        navigate("/p/recruiterauth");
        return;
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/p/recruiterauth");
      return;
    }
    
    loadApplications();
  }, [navigate]);

  const loadApplications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Loading applications...");
      const data = await ApplicationApi.list();
      console.log("Applications data:", data);
      setApplications(data);
      
      // Separate job and internship applications
      const jobApps = data.filter(app => app.application_type === 'job');
      const internshipApps = data.filter(app => app.application_type === 'internship');
      
      setJobs(jobApps);
      setInternships(internshipApps);
    } catch (error) {
      console.error("Error loading applications:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple test render
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Applications Test</h1>
        <p className="text-gray-600 mb-4">This is a test to see if the component loads.</p>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Debug Information:</h2>
          <div className="space-y-2 text-sm">
            <p><strong>User:</strong> {localStorage.getItem("user") || "Not found"}</p>
            <p><strong>JWT:</strong> {localStorage.getItem("jwt") ? "Present" : "Not found"}</p>
            <p><strong>Loading:</strong> {isLoading ? "Yes" : "No"}</p>
            <p><strong>Error:</strong> {error || "None"}</p>
            <p><strong>Applications Count:</strong> {applications.length}</p>
          </div>
          
          <div className="mt-4">
            <Button onClick={loadApplications} className="bg-blue-500 hover:bg-blue-600">
              Reload Applications
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
