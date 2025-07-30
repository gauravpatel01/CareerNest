import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/Components/common/ToastContext";
import { updateInternship } from "../Services/InternshipApi";

const locations = ["Noida", "Delhi", "Pune", "Mumbai", "Bangalore", "Hyderabad"];
const durations = ["1 month", "2 months", "3 months", "6 months", "1 year"];

export default function EditInternship() {
  const [form, setForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { internshipId } = useParams();
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    if (internshipId) {
      loadInternship(internshipId);
    } else {
      navigate("/p/manage-internships");
    }
    // eslint-disable-next-line
  }, [internshipId]);

  const loadInternship = async (internshipId) => {
    setIsLoading(true);
    try {
      const jwt = localStorage.getItem("jwt");
      const response = await fetch(`/api/internships/${internshipId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to load internship");
      }
      const data = await response.json();
      setForm(data);
    } catch (error) {
      console.error("Error loading internship:", error);
      showError("Failed to load internship details");
      navigate("/p/manage-internships");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, key) => {
    const items = e.target.value.split(",").map((item) => item.trim());
    setForm((prev) => ({ ...prev, [key]: items }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateInternship(internshipId, form);
      setSuccess(true);
      showSuccess("Internship updated successfully!");
      setTimeout(() => navigate("/p/manage-internships"), 1200);
    } catch (error) {
      console.error("Error updating internship:", error);
      showError("Failed to update internship");
    }
  };

  const handleGoBack = () => {
    navigate("/p/manage-internships");
  };

  if (isLoading || !form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading internship details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" onClick={handleGoBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Manage Internships
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Internship</h1>
            <p className="text-gray-600">Update your internship details</p>
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
            Internship updated successfully! Redirecting...
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block mb-2 font-medium text-gray-700">
                    Internship Title *
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={form.title || ""}
                    onChange={handleChange}
                    required
                    className="w-full"
                    placeholder="e.g., Frontend Developer Intern"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block mb-2 font-medium text-gray-700">
                    Company Name *
                  </label>
                  <Input
                    id="company"
                    name="company"
                    value={form.company || ""}
                    onChange={handleChange}
                    required
                    className="w-full"
                    placeholder="e.g., Tech Corp"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block mb-2 font-medium text-gray-700">
                    Location *
                  </label>
                  <Select
                    value={form.location || ""}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, location: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="duration" className="block mb-2 font-medium text-gray-700">
                    Duration *
                  </label>
                  <Select
                    value={form.duration || ""}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, duration: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map((duration) => (
                        <SelectItem key={duration} value={duration}>
                          {duration}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="stipend" className="block mb-2 font-medium text-gray-700">
                    Stipend *
                  </label>
                  <Input
                    id="stipend"
                    name="stipend"
                    value={form.stipend || ""}
                    onChange={handleChange}
                    required
                    className="w-full"
                    placeholder="e.g., ₹10,000/month"
                  />
                </div>

                <div>
                  <label htmlFor="skills" className="block mb-2 font-medium text-gray-700">
                    Skills Required
                  </label>
                  <Input
                    id="skills"
                    name="skills"
                    value={Array.isArray(form.skills) ? form.skills.join(", ") : form.skills || ""}
                    onChange={(e) => handleArrayChange(e, "skills")}
                    className="w-full"
                    placeholder="e.g., React, JavaScript, HTML, CSS"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block mb-2 font-medium text-gray-700">
                  Description *
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description || ""}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full"
                  placeholder="Describe the internship role, responsibilities, and what the intern will learn..."
                />
              </div>

              <div>
                <label htmlFor="requirements" className="block mb-2 font-medium text-gray-700">
                  Requirements *
                </label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  value={form.requirements || ""}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full"
                  placeholder="List the qualifications, skills, and experience required for this internship..."
                />
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={handleGoBack} className="px-6">
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600 px-6" disabled={success}>
                  Update Internship
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
