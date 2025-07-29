import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { fetchInternships } from "../Services/InternshipApi";

export default function ManageInternships() {
  const [internships, setInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recruiter, setRecruiter] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const jwt = localStorage.getItem("jwt");
    if (!user || !jwt || user.role !== "recruiter") {
      navigate("/p/recruiterauth");
    } else {
      setRecruiter(user);
      loadInternships(user.email);
    }
    // eslint-disable-next-line
  }, []);

  const loadInternships = async (email) => {
    setIsLoading(true);
    try {
      const data = await fetchInternships({ posted_by: email });
      setInternships(data);
    } catch (error) {
      console.error("Error loading internships:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (internshipId) => {
    // Only allow valid MongoDB ObjectId (24 hex chars)
    if (!internshipId || typeof internshipId !== 'string' || internshipId.length !== 24) {
      alert("Invalid internship ID. Cannot delete.");
      return;
    }
    try {
      const res = await fetch(`/api/internships/${internshipId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (res.ok) {
        setInternships((prev) => prev.filter((internship) => internship._id !== internshipId));
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete internship.");
      }
    } catch (error) {
      alert("Failed to delete internship.");
    }
  };

  const handleView = (internship) => {
    setSelectedInternship(internship);
    setShowDetails(true);
  };

  const handleEdit = (internship) => {
    if (internship._id && internship._id.length === 24) {
      navigate(`/p/edit-internship/${internship._id}`);
    } else {
      alert("Invalid internship ID. Cannot edit.");
    }
  };

  const handleGoBack = () => {
    navigate(-1); // 👈 go to previous page
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-6 sm:py-8">

         {/* ⬅️ Back Button */}
      <button
        onClick={handleGoBack}
        className="flex items-center text-sm text-blue-600 hover:underline mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Go Back
      </button>
      
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center sm:text-left">Manage Internships</h1>
          <Link to="/p/post-internships">
            <Button className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto flex items-center justify-center">
              <Plus className="w-4 h-4 mr-2" />
              Post New Internship
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Your Internship Postings</CardTitle>
          </CardHeader>
          <CardContent>
            {internships.length > 0 ? (
              <div className="space-y-4">
                {internships.map((internship) => (
                  <div
                    key={internship._id || internship.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4 sm:gap-0"
                  >
                    <div className="w-full sm:w-auto">
                      <h3 className="font-semibold text-gray-900 text-lg">{internship.title}</h3>
                      <p className="text-sm text-gray-600">
                        {internship.location} • {internship.duration}
                      </p>
                      <Badge
                        className={
                          internship.status === "approved" ? "bg-green-100 text-green-800" : 
                          internship.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                          "bg-gray-100 text-gray-800"
                        }
                      >
                        {internship.status}
                      </Badge>
                    </div>
                    <div className="flex w-full sm:w-auto gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(internship)}
                        className="flex-1 sm:flex-none"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(internship)}
                        className="flex-1 sm:flex-none"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 flex-1 sm:flex-none"
                        onClick={() => handleDelete(internship._id)}
                        disabled={!internship._id || internship._id.length !== 24}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No internships posted yet</h3>
                <p className="text-gray-500 mb-4">Start by posting your first internship to attract candidates</p>
                <Link to="/p/post-internships">
                  <Button className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto flex items-center justify-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Post Your First Internship
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
        {showDetails && selectedInternship && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedInternship.title}</h2>
                <Button variant="outline" size="sm" onClick={() => setShowDetails(false)}>
                  ✕
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <strong>Company:</strong> {selectedInternship.company}
                </div>
                <div>
                  <strong>Location:</strong> {selectedInternship.location}
                </div>
                <div>
                  <strong>Duration:</strong> {selectedInternship.duration}
                </div>
                <div>
                  <strong>Stipend:</strong> {selectedInternship.stipend}
                </div>
                <div>
                  <strong>Description:</strong> {selectedInternship.description}
                </div>
                {selectedInternship.requirements && (
                  <div>
                    <strong>Requirements:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {selectedInternship.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedInternship.skills && (
                  <div>
                    <strong>Skills:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {selectedInternship.skills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <strong>Status:</strong> 
                  <Badge className="ml-2">
                    {selectedInternship.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}