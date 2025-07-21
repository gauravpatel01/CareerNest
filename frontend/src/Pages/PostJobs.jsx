import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const locations = ["Noida", "Delhi", "Pune", "Mumbai", "Bangalore", "Hyderabad"];

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    location: "",
    stipend: "",
    duration: "",
    description: "",
    requirements: [],
    skills: [],
    remote_option: false,
  });

  const [recruiter, setRecruiter] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const jwt = localStorage.getItem('jwt');
    if (!user || !jwt || user.role !== 'recruiter') {
      navigate('/p/recruiterauth');
    } else {
      setRecruiter(user);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (e, key) => {
    const items = e.target.value.split(",").map((item) => item.trim());
    setForm((prev) => ({ ...prev, [key]: items }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recruiter) {
      alert('Only recruiters can post internships. Please log in as a recruiter.');
      navigate('/p/recruiterauth');
      return;
    }

    const payload = {
      ...form,
      posted_by: recruiter.email,
      company: recruiter.company_name,
      // Add more recruiter info if needed
    };

    try {
      // Replace with your backend internship creation endpoint
      await axios.post("/api/internships/create", payload);
      navigate("/p/internships");
    } catch (error) {
      console.error("Internship creation failed", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Post a New Internship</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block mb-1 font-medium">
            Internship Title
          </label>
          <Input id="title" name="title" value={form.title} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="location" className="block mb-1 font-medium">
            Location
          </label>
          <select
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select location</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="stipend" className="block mb-1 font-medium">
            Stipend (₹)
          </label>
          <Input type="text" id="stipend" name="stipend" value={form.stipend} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="duration" className="block mb-1 font-medium">
            Duration
          </label>
          <Input type="text" id="duration" name="duration" value={form.duration} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="description" className="block mb-1 font-medium">
            Description
          </label>
          <Textarea id="description" name="description" value={form.description} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="requirements" className="block mb-1 font-medium">
            Requirements (comma separated)
          </label>
          <Input
            id="requirements"
            name="requirements"
            value={form.requirements.join(", ")}
            onChange={(e) => handleArrayChange(e, "requirements")}
          />
        </div>

        <div>
          <label htmlFor="skills" className="block mb-1 font-medium">
            Skills (comma separated)
          </label>
          <Input
            id="skills"
            name="skills"
            value={form.skills.join(", ")}
            onChange={(e) => handleArrayChange(e, "skills")}
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="remote_option"
            checked={form.remote_option}
            onCheckedChange={(checked) => setForm((prev) => ({ ...prev, remote_option: checked }))}
          />
          <label htmlFor="remote_option" className="font-medium">
            Remote Option Available
          </label>
        </div>

        <Button variant="default" className="bg-blue-500 hover:bg-blue-600 w-full">
          Post Internship
        </Button>
      </form>
    </div>
  );
}
