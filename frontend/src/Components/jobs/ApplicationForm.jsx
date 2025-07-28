import React, { useState } from "react";
// import { Application } from "@/entities/Application";
// import { User } from "@/entities/User";
// import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ApplicationForm({ job, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    applicant_name: "",
    applicant_email: "",
    phone: "",
    experience: "",
    cover_letter: "",
    resume_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const navigate = useNavigate();

  // Authorization check
  const userStr = localStorage.getItem("user");
  let user = null;
  try {
    user = userStr && userStr !== "undefined" ? JSON.parse(userStr) : null;
  } catch (e) {
    user = null;
  }
  const jwt = localStorage.getItem("jwt");
  const isStudent = user && jwt && user.role === "student";

  if (!isStudent) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Apply for {job.title}</CardTitle>
          <p className="text-center text-gray-600">
            at {job.company} • {job.location}
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600 mb-4 font-semibold">
            You must be logged in as a student to apply for this internship.
          </div>
          <div className="flex justify-center">
            <Button onClick={() => navigate("/p/studentauth")}>Login as Student</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await UploadFile({ file });
      setFormData({
        ...formData,
        resume_url: result.file_url,
      });
      setUploadedFileName(file.name);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if user is logged in
      const user = await User.me();

      await Application.create({
        job_id: job.id,
        applicant_email: formData.applicant_email || user.email,
        applicant_name: formData.applicant_name || user.full_name,
        phone: formData.phone,
        experience: formData.experience,
        cover_letter: formData.cover_letter,
        resume_url: formData.resume_url,
      });

      onSuccess("Application submitted successfully!");
    } catch (error) {
      console.error("Error submitting application:", error);
      // If user not logged in, redirect to login
      if (error.message?.includes("not authenticated")) {
        await User.loginWithRedirect(window.location.href);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Apply for {job.title}</CardTitle>
        <p className="text-center text-gray-600">
          at {job.company} • {job.location}
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <Input
                name="applicant_name"
                value={formData.applicant_name}
                onChange={handleInputChange}
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <Input
                name="applicant_email"
                type="email"
                value={formData.applicant_email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 9876543210" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
              <Input
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="e.g., 2 years, Fresher"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Resume Link (Google Drive) *</label>
            <Input
              name="resume_url"
              value={formData.resume_url}
              onChange={handleInputChange}
              placeholder="Paste your Google Drive resume link here"
              required
              type="url"
              pattern="https://drive.google.com/.*"
            />
            <p className="text-xs text-gray-500 mt-2">
              Please provide a shareable Google Drive link to your resume (make sure it is accessible).
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter</label>
            <Textarea
              name="cover_letter"
              value={formData.cover_letter}
              onChange={handleInputChange}
              placeholder="Tell us why you're interested in this position and what makes you a great fit..."
              rows={5}
            />
          </div>

          <div className="flex space-x-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.resume_url}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
