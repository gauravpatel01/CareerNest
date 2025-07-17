import React, { useState } from "react";
// import { User } from "@/entities/User";
import { Link } from "react-router-dom";
import { createPageUrl } from "../Components/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Eye, EyeOff, AlertCircle, Mail, Phone } from "lucide-react";

export default function RecruiterAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginMethod, setLoginMethod] = useState("email"); // "email" or "phone"
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
      window.location.href = createPageUrl("RecruiterDashboard");
    } catch (error) {
      setError("Google login failed. Please try again.");
      console.error("Google login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      if (loginMethod === "email") {
        if (!formData.email || !formData.password) {
          setError("Please fill in all required fields");
          return;
        }
      } else { // loginMethod === "phone"
        if (!formData.phone) {
          setError("Please enter your phone number");
          return;
        }
      }
      
      // In a real app, this would validate against your auth system based on loginMethod
      await User.login();
      window.location.href = createPageUrl("RecruiterDashboard");
    } catch (error) {
      setError(loginMethod === "email" ? "Invalid email or password" : "Phone login failed. Please try again.");
      console.error("Login error:", error);
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
      
      // First login with Google or directly sign up based on implementation
      await User.login(); // Simulate registration/login
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
    alert("Password reset instructions would be sent to your email");
  };

  if (!isLogin) {
    // Sign Up Form
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join CareerNest as a Recruiter
            </h1>
            <p className="text-gray-600">
              Start posting jobs and connect with top talent across India
            </p>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-center">
                <div className="flex justify-center space-x-1 mb-4">
                  <button
                    onClick={() => setIsLogin(true)}
                    className="px-6 py-2 rounded-lg font-medium transition-colors text-gray-600 hover:text-indigo-600"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className="px-6 py-2 rounded-lg font-medium transition-colors bg-indigo-600 text-white"
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

              <form onSubmit={handleSignUp} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
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
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // New Clean Sign In Form
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <Link to={createPageUrl("Home")} className="flex items-center text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-lg">Back</span>
        </Link>

        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back Recruiter!</h1>
          <p className="text-gray-600">Welcome back! Please enter your details.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        {/* Login Method Toggle */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setLoginMethod("email")}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md font-medium transition-colors ${
              loginMethod === "email" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Mail className="w-4 h-4 mr-2" />
            Email
          </button>
          <button
            onClick={() => setLoginMethod("phone")}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md font-medium transition-colors ${
              loginMethod === "phone" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Phone className="w-4 h-4 mr-2" />
            Phone
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email/Phone Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {loginMethod === "email" ? "Email" : "Phone Number"}
            </label>
            <Input
              name={loginMethod === "email" ? "email" : "phone"}
              type={loginMethod === "email" ? "email" : "tel"}
              value={loginMethod === "email" ? formData.email : formData.phone}
              onChange={handleInputChange}
              placeholder={loginMethod === "email" ? "Enter your email" : "Enter your phone number"}
              className="h-12"
              required
            />
          </div>

          {/* Password Input (only for email login) */}
          {loginMethod === "email" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="h-12 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          {/* Forgot Password */}
          {loginMethod === "email" && (
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Forgot password
              </button>
            </div>
          )}

          {/* Login Button */}
          <Button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 h-12 rounded-lg font-medium"
          >
            {isLoading ? (
              loginMethod === "phone" ? "Sending OTP..." : "Signing in..."
            ) : (
              loginMethod === "phone" ? "Send OTP" : "Login"
            )}
          </Button>

          {/* Google Sign In */}
          <Button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            variant="outline"
            className="w-full py-3 h-12 rounded-lg font-medium border-gray-300 hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => setIsLogin(false)}
              className="font-semibold text-gray-900 hover:text-indigo-600"
            >
              Sign up for free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
