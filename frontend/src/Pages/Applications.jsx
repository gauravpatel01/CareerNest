import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("jobs");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      // const response = await fetch('/api/applications/recruiter', {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      //   }
      // });
      // const data = await response.json();
      // setApplications(data.applications);
      // setJobs(data.jobs);
      // setInternships(data.internships);

      // Mock data for now
      const mockApplications = [
        {
          id: 1,
          type: "job",
          job_id: 1,
          job_title: "Frontend Developer",
          company_name: "TechCorp",
          applicant_name: "John Doe",
          applicant_email: "john.doe@email.com",
          applicant_phone: "+91 9876543210",
          resume_url: "/resume1.pdf",
          cover_letter: "I am excited to apply for this position...",
          status: "pending",
          applied_date: "2024-01-15",
          experience: "3 years",
          skills: ["React", "JavaScript", "TypeScript"],
          location: "Mumbai",
          salary_expectation: "₹8-12 LPA",
        },
        {
          id: 2,
          type: "internship",
          internship_id: 1,
          job_title: "Software Engineering Intern",
          company_name: "TechCorp",
          applicant_name: "Jane Smith",
          applicant_email: "jane.smith@email.com",
          applicant_phone: "+91 9876543211",
          resume_url: "/resume2.pdf",
          cover_letter: "I am a final year student looking for internship opportunities...",
          status: "accepted",
          applied_date: "2024-01-14",
          experience: "Student",
          skills: ["Python", "Java", "SQL"],
          location: "Bangalore",
          duration: "6 months",
        },
        {
          id: 3,
          type: "job",
          job_id: 2,
          job_title: "Backend Developer",
          company_name: "TechCorp",
          applicant_name: "Mike Johnson",
          applicant_email: "mike.johnson@email.com",
          applicant_phone: "+91 9876543212",
          resume_url: "/resume3.pdf",
          cover_letter: "I have 5 years of experience in backend development...",
          status: "rejected",
          applied_date: "2024-01-13",
          experience: "5 years",
          skills: ["Node.js", "Python", "MongoDB"],
          location: "Delhi",
          salary_expectation: "₹12-18 LPA",
        },
      ];

      setApplications(mockApplications);
      setJobs(mockApplications.filter((app) => app.type === "job"));
      setInternships(mockApplications.filter((app) => app.type === "internship"));
    } catch (error) {
      console.error("Error loading applications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/applications/${applicationId}/status`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      //   },
      //   body: JSON.stringify({ status: newStatus })
      // });

      // Update local state
      setApplications((prev) => prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app)));

      // Update jobs/internships arrays
      if (selectedTab === "jobs") {
        setJobs((prev) => prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app)));
      } else {
        setInternships((prev) => prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app)));
      }

      setShowModal(false);
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Pending" },
      accepted: { color: "bg-green-100 text-green-800", text: "Accepted" },
      rejected: { color: "bg-red-100 text-red-800", text: "Rejected" },
      shortlisted: { color: "bg-blue-100 text-blue-800", text: "Shortlisted" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  const ApplicationModal = ({ application, onClose, onStatusUpdate }) => {
    if (!application) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50">
        <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">{application.job_title}</h2>
                <p className="text-sm sm:text-base text-gray-600">{application.company_name}</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 self-start sm:self-auto">
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Applicant Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium">{application.applicant_name}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{application.applicant_email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{application.applicant_phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{application.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Applied: {new Date(application.applied_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Application Details</h3>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Experience:</span> {application.experience}
                  </div>
                  <div>
                    <span className="font-medium">Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {application.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {application.salary_expectation && (
                    <div>
                      <span className="font-medium">Salary Expectation:</span> {application.salary_expectation}
                    </div>
                  )}
                  {application.duration && (
                    <div>
                      <span className="font-medium">Duration:</span> {application.duration}
                    </div>
                  )}
                  <div className="mt-3">{getStatusBadge(application.status)}</div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Cover Letter</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{application.cover_letter}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => onStatusUpdate(application.id, "accepted")}
                className="bg-green-600 hover:bg-green-700"
                disabled={application.status === "accepted"}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Accept Application
              </Button>
              <Button
                onClick={() => onStatusUpdate(application.id, "rejected")}
                variant="destructive"
                disabled={application.status === "rejected"}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject Application
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Button>
              <Button variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600">Manage applications for your job postings and internships</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter((app) => app.status === "pending").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Accepted</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter((app) => app.status === "accepted").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter((app) => app.status === "rejected").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="jobs" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Job Applications ({jobs.length})
                </TabsTrigger>
                <TabsTrigger value="internships" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Internship Applications ({internships.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="jobs" className="mt-6">
                {jobs.length > 0 ? (
                  <div className="space-y-4">
                    {jobs.map((application) => (
                      <div key={application.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-gray-900">{application.job_title}</h3>
                                <p className="text-sm text-gray-600">{application.company_name}</p>
                              </div>
                              {getStatusBadge(application.status)}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{application.applicant_name}</span>
                              </div>
                              <div className="flex items-center">
                                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{application.applicant_email}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{application.location}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{new Date(application.applied_date).toLocaleDateString()}</span>
                              </div>
                            </div>

                            <div className="mt-3">
                              <div className="flex flex-wrap gap-1">
                                {application.skills.slice(0, 3).map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {application.skills.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{application.skills.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              onClick={() => {
                                setSelectedApplication(application);
                                setShowModal(true);
                              }}
                              variant="outline"
                              size="sm"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                            {application.status === "pending" && (
                              <>
                                <Button
                                  onClick={() => handleStatusUpdate(application.id, "accepted")}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  onClick={() => handleStatusUpdate(application.id, "rejected")}
                                  variant="destructive"
                                  size="sm"
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No job applications yet</h3>
                    <p className="text-gray-500">
                      Applications will appear here when candidates apply to your job postings
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="internships" className="mt-6">
                {internships.length > 0 ? (
                  <div className="space-y-4">
                    {internships.map((application) => (
                      <div key={application.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-gray-900">{application.job_title}</h3>
                                <p className="text-sm text-gray-600">{application.company_name}</p>
                              </div>
                              {getStatusBadge(application.status)}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{application.applicant_name}</span>
                              </div>
                              <div className="flex items-center">
                                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{application.applicant_email}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{application.location}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{new Date(application.applied_date).toLocaleDateString()}</span>
                              </div>
                            </div>

                            <div className="mt-3">
                              <div className="flex flex-wrap gap-1">
                                {application.skills.slice(0, 3).map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {application.skills.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{application.skills.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              onClick={() => {
                                setSelectedApplication(application);
                                setShowModal(true);
                              }}
                              variant="outline"
                              size="sm"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                            {application.status === "pending" && (
                              <>
                                <Button
                                  onClick={() => handleStatusUpdate(application.id, "accepted")}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  onClick={() => handleStatusUpdate(application.id, "rejected")}
                                  variant="destructive"
                                  size="sm"
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No internship applications yet</h3>
                    <p className="text-gray-500">
                      Applications will appear here when candidates apply to your internship postings
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Application Detail Modal */}
      {showModal && selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          onClose={() => {
            setShowModal(false);
            setSelectedApplication(null);
          }}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}
