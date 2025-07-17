
import React, { useState } from "react";
// import { User } from "@/entities/User";
import { Link } from "react-router-dom";
import { createPageUrl } from "../Components/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Mail, User as UserIcon, Phone, MapPin, Users, Briefcase, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function RecruiterAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState("email"); // "email" or "phone"
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    company_name: "",
    company_size: "",
    industry: "",
    location: "",
    job_title: "",
    company_website: "",
    company_description: ""
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      await User.login();
      // Redirect to recruiter dashboard after successful login
      window.location.href = createPageUrl("RecruiterDashboard");
    } catch (error) {
      setError("Google login failed. Please try again.");
      console.error("Google login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      if (!formData.email || !formData.password) {
        setError("Please fill in all required fields");
        return;
      }
      
      // In a real app, this would validate against your auth system
      await User.login();
      window.location.href = createPageUrl("RecruiterDashboard");
    } catch (error) {
      setError("Invalid email or password");
      console.error("Email login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      if (!formData.phone) {
        setError("Please enter your phone number");
        return;
      }
      
      // Simulate phone login
      await User.login();
      window.location.href = createPageUrl("RecruiterDashboard");
    } catch (error) {
      setError("Phone login failed. Please try again.");
      console.error("Phone login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      if (!formData.full_name || !formData.email || !formData.company_name) {
        setError("Please fill in all required fields");
        return;
      }
      
      if (formData.password !== formData.confirm_password) {
        setError("Passwords do not match");
        return;
      }
      
      // First login with Google
      await User.login();
      // Then update profile with additional data
      await User.updateMyUserData({
        ...formData,
        user_type: "recruiter"
      });
      window.location.href = createPageUrl("RecruiterDashboard");
    } catch (error) {
      setError("Sign up failed. Please try again.");
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setError("");
    // In a real app, this would send a reset email
    alert("Password reset instructions would be sent to your email");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? "Welcome Back, Recruiter!" : "Join CareerNest as a Recruiter"}
          </h1>
          <p className="text-gray-600">
            {isLogin 
              ? "Sign in to manage your job postings and find great candidates" 
              : "Start posting jobs and connect with top talent across India"
            }
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">
              <div className="flex justify-center space-x-1 mb-4">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    isLogin ? "bg-indigo-600 text-white" : "text-gray-600 hover:text-indigo-600"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    !isLogin ? "bg-indigo-600 text-white" : "text-gray-600 hover:text-indigo-600"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}

            {isLogin ? (
              <div className="space-y-6">
                {/* Google Login */}
                <div className="text-center">
                  <Button 
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full bg-red-600 hover:bg-red-700 py-3 text-lg mb-4"
                  >
                    {isLoading ? "Signing In..." : "Continue with Google"}
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or sign in with</span>
                  </div>
                </div>

                {/* Auth Method Selection */}
                <div className="flex justify-center space-x-4 mb-4">
                  <button
                    onClick={() => setAuthMethod("email")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      authMethod === "email" ? "bg-indigo-600 text-white" : "text-gray-600 hover:text-indigo-600"
                    }`}
                  >
                    Email
                  </button>
                  <button
                    onClick={() => setAuthMethod("phone")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      authMethod === "phone" ? "bg-indigo-600 text-white" : "text-gray-600 hover:text-indigo-600"
                    }`}
                  >
                    Phone
                  </button>
                </div>

                {/* Email Login Form */}
                {authMethod === "email" && (
                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your work email"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <Button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 py-3"
                    >
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                )}

                {/* Phone Login Form */}
                {authMethod === "phone" && (
                  <form onSubmit={handlePhoneLogin} className="space-y-4">
                    <div>
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 9876543210"
                        required
                      />
                    </div>
                    <Button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 py-3"
                    >
                      {isLoading ? "Sending OTP..." : "Send OTP"}
                    </Button>
                  </form>
                )}

                {/* Forgot Password */}
                <div className="text-center">
                  <button
                    onClick={handleForgotPassword}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    Forgot your password?
                  </button>
                </div>
                
                <div className="text-center pt-6 border-t">
                  <p className="text-gray-600">
                    New to CareerNest?{" "}
                    <button
                      onClick={() => setIsLogin(false)}
                      className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Create recruiter account
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <UserIcon className="w-5 h-5 mr-2" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Work Email *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@company.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 9876543210"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title
                      </label>
                      <Input
                        name="job_title"
                        value={formData.job_title}
                        onChange={handleInputChange}
                        placeholder="e.g., HR Manager, Talent Acquisition"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Fields */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Account Security
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <Input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Enter password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password *
                      </label>
                      <Input
                        name="confirm_password"
                        type={showPassword ? "text" : "password"}
                        value={formData.confirm_password}
                        onChange={handleInputChange}
                        placeholder="Confirm password"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Company Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name *
                      </label>
                      <Input
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleInputChange}
                        placeholder="Enter company name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Size
                      </label>
                      <Select value={formData.company_size} onValueChange={(value) => handleSelectChange("company_size", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-1000">201-1000 employees</SelectItem>
                          <SelectItem value="1000+">1000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry
                      </label>
                      <Select value={formData.industry} onValueChange={(value) => handleSelectChange("industry", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="Retail">Retail</SelectItem>
                          <SelectItem value="Consulting">Consulting</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Location
                      </label>
                      <Select value={formData.location} onValueChange={(value) => handleSelectChange("location", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mumbai">Mumbai</SelectItem>
                          <SelectItem value="Delhi">Delhi</SelectItem>
                          <SelectItem value="Bangalore">Bangalore</SelectItem>
                          <SelectItem value="Pune">Pune</SelectItem>
                          <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                          <SelectItem value="Noida">Noida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Website
                    </label>
                    <Input
                      name="company_website"
                      value={formData.company_website}
                      onChange={handleInputChange}
                      placeholder="https://www.company.com"
                    />
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Description
                    </label>
                    <Textarea
                      name="company_description"
                      value={formData.company_description}
                      onChange={handleInputChange}
                      placeholder="Brief description of your company and what you do..."
                      rows={3}
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 text-lg"
                >
                  {isLoading ? "Creating Account..." : "Create Recruiter Account"}
                </Button>

                <div className="text-center pt-4 border-t">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsLogin(true)}
                      className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quality Candidates</h3>
            <p className="text-sm text-gray-600">Access to verified student profiles and experienced professionals</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Easy Job Posting</h3>
            <p className="text-sm text-gray-600">Post jobs quickly and manage applications from one dashboard</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Pan-India Reach</h3>
            <p className="text-sm text-gray-600">Find talent across all major Indian cities</p>
          </div>
        </div>
      </div>
    </div>
  );
}