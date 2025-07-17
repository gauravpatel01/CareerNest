import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Executive"];
const locations = ["Noida", "Delhi", "Pune", "Mumbai", "Bangalore", "Hyderabad"];

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    location: "",
    salary_min: "",
    salary_max: "",
    job_type: "Full-time",
    experience_level: "Entry Level",
    description: "",
    requirements: [],
    benefits: [],
    skills: [],
    remote_option: false,
  });

  const [recruiter, setRecruiter] = useState(null);

  //   useEffect(() => {
  //     const email = localStorage.getItem("email");
  //     if (!email) return;

  //     axios
  //       .get(`/api/recruiter/profile?email=${email}`)
  //       .then((res) => setRecruiter(res.data))
  //       .catch((err) => console.error("Failed to load recruiter info", err));
  //   }, []);

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
    if (!recruiter) return;

    const payload = {
      ...form,
      salary_min: Number(form.salary_min),
      salary_max: Number(form.salary_max),
      posted_by: recruiter.email,
      company: recruiter.company_name,
      company_logo: recruiter.company_logo,
    };

    try {
      await axios.post("/api/jobs/create", payload);
      navigate("/recruiterdashboard");
    } catch (error) {
      console.error("Job creation failed", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block mb-1 font-medium">
            Job Title
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="salary_min" className="block mb-1 font-medium">
              Salary Min (₹)
            </label>
            <Input type="number" id="salary_min" name="salary_min" value={form.salary_min} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="salary_max" className="block mb-1 font-medium">
              Salary Max (₹)
            </label>
            <Input type="number" id="salary_max" name="salary_max" value={form.salary_max} onChange={handleChange} />
          </div>
        </div>

        <div>
          <label htmlFor="job_type" className="block mb-1 font-medium">
            Job Type
          </label>
          <select
            id="job_type"
            name="job_type"
            value={form.job_type}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            {jobTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="experience_level" className="block mb-1 font-medium">
            Experience Level
          </label>
          <select
            id="experience_level"
            name="experience_level"
            value={form.experience_level}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            {experienceLevels.map((level) => (
              <option key={level}>{level}</option>
            ))}
          </select>
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
          <label htmlFor="benefits" className="block mb-1 font-medium">
            Benefits (comma separated)
          </label>
          <Input
            id="benefits"
            name="benefits"
            value={form.benefits.join(", ")}
            onChange={(e) => handleArrayChange(e, "benefits")}
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

        <Button variant="default" className="bg-blue-500 hover:bg-blue-600 h w-full">
          Post Job
        </Button>
      </form>
    </div>
  );
}
