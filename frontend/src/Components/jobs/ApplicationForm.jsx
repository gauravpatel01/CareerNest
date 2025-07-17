import React, { useState } from "react";
// import { Application } from "@/entities/Application";
// import { User } from "@/entities/User";
// import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, CheckCircle } from "lucide-react";

export default function ApplicationForm({ job, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    applicant_name: "",
    applicant_email: "",
    phone: "",
    experience: "",
    cover_letter: "",
    resume_url: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
        resume_url: result.file_url
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
        resume_url: formData.resume_url
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
        <CardTitle className="text-2xl text-center">
          Apply for {job.title}
        </CardTitle>
        <p className="text-center text-gray-600">
          at {job.company} • {job.location}
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <Input
                name="applicant_name"
                value={formData.applicant_name}
                onChange={handleInputChange}
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 9876543210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <Input
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="e.g., 2 years, Fresher"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Resume *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {formData.resume_url ? (
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span>{uploadedFileName || "Resume uploaded successfully"}</span>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">
                    {isUploading ? "Uploading..." : "Click to upload your resume"}
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {isUploading ? "Uploading..." : "Choose File"}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, DOC, or DOCX (Max 5MB)
                  </p>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter
            </label>
            <Textarea
              name="cover_letter"
              value={formData.cover_letter}
              onChange={handleInputChange}
              placeholder="Tell us why you're interested in this position and what makes you a great fit..."
              rows={5}
            />
          </div>

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
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