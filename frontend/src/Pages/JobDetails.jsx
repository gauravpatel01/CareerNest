import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin, IndianRupee, Clock, Building, Users, CheckCircle, ArrowLeft,
} from "lucide-react";
import { createPageUrl } from "../Components/utils";
import LoadingSpinner from "../Components/common/LoadingSpinner";
import ApplicationForm from "../Components/jobs/ApplicationForm";

export default function JobDetails() {
  const { jobId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const shouldShowForm = searchParams.get("apply") === "true";

    if (jobId) {
      loadJob(jobId);
      if (shouldShowForm) {
        setShowApplicationForm(true);
      }
    } else {
      setIsLoading(false);
      setJob(null);
    }
  }, [jobId, location.search]);

  const loadJob = async (id) => {
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      // Map company_name to company if needed
      if (data.company_name && !data.company) {
        data.company = data.company_name;
      }
      // Map description if needed (if your backend uses a different field)
      if (data.job_description && !data.description) {
        data.description = data.job_description;
      }
      // Add more mappings here if your backend uses different field names
      console.log("Loaded job:", data);
      setJob(data);
    } catch (error) {
      console.error("Error loading job:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isStudent = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const jwt = localStorage.getItem("jwt");
      return user && jwt && user.role === "student";
    } catch {
      return false;
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return "Salary not disclosed";
    if (min && max) {
      return `₹${(min / 100000).toFixed(1)}L - ₹${(max / 100000).toFixed(1)}L per annum`;
    }
    return min ? `₹${(min / 100000).toFixed(1)}L+ per annum` : `Up to ₹${(max / 100000).toFixed(1)}L per annum`;
  };

  if (isLoading) return <LoadingSpinner />;

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Link to={createPageUrl("Jobs")}>
            <Button className="bg-blue-600 hover:bg-blue-700">Browse All Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (showApplicationForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button variant="outline" onClick={() => setShowApplicationForm(false)} className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Job Details</span>
            </Button>
          </div>

          {applicationMessage && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {applicationMessage}
            </div>
          )}

          <ApplicationForm
            job={job}
            onClose={() => setShowApplicationForm(false)}
            onSuccess={(message) => {
              setApplicationMessage(message);
              setShowApplicationForm(false);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <Link to={createPageUrl("Jobs")}>
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Jobs</span>
            </Button>
          </Link>
          <Button
            onClick={() => {
              if (isStudent()) setShowApplicationForm(true);
              else navigate("/p/studentauth");
            }}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
          >
            Apply Now
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4 mb-6">
                {job.company_logo && (
                  <img src={job.company_logo} alt={job.company} className="w-16 h-16 rounded-xl object-cover" />
                )}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <div className="flex items-center space-x-2 text-lg text-gray-600 mb-4">
                    <Building className="w-5 h-5" />
                    <span className="font-medium">{job.company}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-gray-600">
                    <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{job.location}</span>
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{job.job_type}</span>
                    <span className="flex items-center text-green-600 font-semibold"><IndianRupee className="w-4 h-4 mr-1" />{formatSalary(job.salary_min, job.salary_max)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge className="bg-blue-100 text-blue-800">{job.experience_level}</Badge>
                {job.remote_option && <Badge className="bg-green-100 text-green-800">Remote Available</Badge>}
                {job.skills?.slice(0, 5).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-blue-600 border-blue-600">{skill}</Badge>
                ))}
              </div>

              <Button
                onClick={() => {
                  if (isStudent()) setShowApplicationForm(true);
                  else navigate("/p/studentauth");
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg"
              >
                Apply for this Position
              </Button>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader><CardTitle>Job Description</CardTitle></CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
            </CardContent>
          </Card>

          {/* Requirements */}
          {job.requirements?.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Requirements</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Benefits */}
          {job.benefits?.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Benefits & Perks</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Apply */}
          <Card>
            <CardHeader><CardTitle>Quick Apply</CardTitle></CardHeader>
            <CardContent>
              <Button
                onClick={() => {
                  if (isStudent()) setShowApplicationForm(true);
                  else navigate("/p/studentauth");
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 mb-4"
              >
                Apply Now
              </Button>
              <p className="text-sm text-gray-600 text-center">
                Join hundreds of candidates who have already applied
              </p>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader><CardTitle>Job Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><h4 className="font-medium text-gray-900 mb-1">Experience Level</h4><p className="text-gray-600">{job.experience_level}</p></div>
              <div><h4 className="font-medium text-gray-900 mb-1">Job Type</h4><p className="text-gray-600">{job.job_type}</p></div>
              <div><h4 className="font-medium text-gray-900 mb-1">Location</h4><p className="text-gray-600">{job.location}</p></div>
              <div><h4 className="font-medium text-gray-900 mb-1">Salary Range</h4><p className="text-gray-600">{formatSalary(job.salary_min, job.salary_max)}</p></div>
              {job.remote_option && <div><h4 className="font-medium text-gray-900 mb-1">Remote Work</h4><p className="text-green-600">Available</p></div>}
            </CardContent>
          </Card>

          {/* Skills */}
          {job.skills?.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Skills Required</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, i) => (
                    <Badge key={i} variant="outline" className="text-blue-600 border-blue-600">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
