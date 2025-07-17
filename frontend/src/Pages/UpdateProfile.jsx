import React, { useState } from "react";
import { Input } from "../Components/ui/input";
import { Button } from "../Components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../Components/ui/select";

export default function UpdateProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    programme: "",
    branch: "",
    year: "",
    collegeName: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    github: "",
    linkedin: "",
    portfolio: "",
    about: "",
    image: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleSelectChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfile((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Profile:", profile);
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8 font-sans">
        {/* Upload Image */}
        <div className="flex flex-col items-center gap-3">
          {/* Image Preview Container */}
          <div
            className="relative group cursor-pointer"
            onClick={() => document.getElementById("profilePicInput").click()}
          >
            {/* Avatar Circle */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-[3px] border-blue-500 shadow-xl transition duration-300 transform hover:scale-105 ring-4 ring-blue-100">
              {previewUrl ? (
                <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 text-gray-500 font-medium">
                  Upload
                </div>
              )}
            </div>

            {/* Hover Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1 rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity">
              Click to Change
            </div>
          </div>

          {/* Hidden File Input */}
          <input type="file" id="profilePicInput" accept="image/*" onChange={handleImageChange} className="hidden" />
          {/* Optional: Hint Text */}
          <p className="text-sm text-gray-500">Tap the photo to upload or update</p>
        </div>

        <h1 className="text-3xl font-bold text-center text-blue-800 mt-6 mb-6">📝 Update Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Image */}
          <div></div>

          {/* Demographic Info */}
          <div>
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Demographic Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="name" value={profile.name} onChange={handleChange} placeholder="Full Name" />
              <Input name="email" value={profile.email} onChange={handleChange} placeholder="Email" />
              <Input name="phone" value={profile.phone} onChange={handleChange} placeholder="Phone Number" />
              <Select onValueChange={(val) => handleSelectChange("gender", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Address Info */}
          <div>
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="street" value={profile.address.street} onChange={handleAddressChange} placeholder="Street" />
              <Input name="city" value={profile.address.city} onChange={handleAddressChange} placeholder="City" />
              <Input name="state" value={profile.address.state} onChange={handleAddressChange} placeholder="State" />
              <Input name="zip" value={profile.address.zip} onChange={handleAddressChange} placeholder="ZIP Code" />
            </div>
          </div>

          {/* College Info */}
          <div>
            <h2 className="text-xl font-semibold text-blue-600 mb-2">College Details</h2>
            <Input
              name="collegeName"
              value={profile.collegeName}
              onChange={handleChange}
              placeholder="College Name"
              className="mb-3"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select onValueChange={(val) => handleSelectChange("programme", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Programme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B.Tech">B.Tech</SelectItem>
                  <SelectItem value="M.Tech">M.Tech</SelectItem>
                  <SelectItem value="MBA">MBA</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(val) => handleSelectChange("branch", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="ECE">ECE</SelectItem>
                  <SelectItem value="ME">ME</SelectItem>
                  <SelectItem value="EE">EE</SelectItem>
                  <SelectItem value="CE">CE</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(val) => handleSelectChange("year", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Passing Year" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(6)].map((_, i) => {
                    const year = 2025 + i;
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Social Media Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="github" value={profile.github} onChange={handleChange} placeholder="GitHub Profile" />
              <Input name="linkedin" value={profile.linkedin} onChange={handleChange} placeholder="LinkedIn Profile" />
              <Input
                name="portfolio"
                value={profile.portfolio}
                onChange={handleChange}
                placeholder="Portfolio Website"
              />
            </div>
          </div>

          {/* About Me */}
          <div>
            <h2 className="text-xl font-semibold text-blue-600 mb-2">About Me</h2>
            <textarea
              name="about"
              value={profile.about}
              onChange={handleChange}
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write about yourself (max 200 characters)"
              maxLength={200}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Save Profile
          </Button>
        </form>
      </div>
    </div>
  );
}
