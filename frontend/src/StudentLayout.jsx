import React, { useState, useEffect } from "react";
import { FileText, Briefcase, LayoutDashboard, Send, Bell, Menu, X, Mail, Phone, MapPin, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "./Components/utils";
import { Button } from "@/components/ui/button";
import UserProfileDropdown from "@/components/layout/UserProfileDropdown";

export default function StudentLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, [location.pathname]);

  const checkUser = async () => {
    setIsLoading(true);
    try {
      const jwt = localStorage.getItem('jwt');
      if (jwt) {
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          setUser({
            full_name: "Demo Student",
            email: "student@example.com",
            role: "student"
          });
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    setUser(null);
    setIsLoading(false);
    navigate('/p/home');
  };

  const goToNotifications = () => {
    navigate("/notifications");
  };

  const isActive = (href) => location.pathname === href;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CareerNest</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                to={createPageUrl("Home")}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                to={createPageUrl("Jobs")}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                Jobs
              </Link>
              <Link
                to={createPageUrl("Internships")}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                Internships
              </Link>
              <Link
                to={createPageUrl("editResume")}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive(createPageUrl("editResume"))
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Resume
              </Link>
              <Link
                to={createPageUrl("applications")}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive(createPageUrl("applications"))
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                My Applications
              </Link>
            </nav>

            {/* Auth Buttons and Profile */}
            <div className="hidden md:flex items-center space-x-3">
              {isLoading ? (
                <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : user ? (
                <UserProfileDropdown user={user} onLogout={handleLogout} />
              ) : (
                <>
                  <Link to={createPageUrl("StudentAuth")}>
                    <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                      Student Sign In
                    </Button>
                </Link>
                  <Link to={createPageUrl("RecruiterAuth")}>
                    <Button className="bg-blue-600 hover:bg-blue-700">Recruiter</Button>
                </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to={createPageUrl("Home")}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to={createPageUrl("Jobs")}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Jobs
              </Link>
              <Link
                to={createPageUrl("Internships")}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Internships
              </Link>
              <Link
                to={createPageUrl("editResume")}
                className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                  isActive(createPageUrl("editResume"))
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Resume
              </Link>
                <Link
                to={createPageUrl("applications")}
                  className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                  isActive(createPageUrl("applications"))
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                My Applications
              </Link>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex flex-col space-y-2 px-3">
                  {isLoading ? (
                    <div className="w-full h-10 bg-gray-200 rounded animate-pulse my-2"></div>
                  ) : user ? (
                    <div className="px-1 py-2">
                      <UserProfileDropdown user={user} onLogout={handleLogout} />
                    </div>
                  ) : (
                    <>
                      <Link to={createPageUrl("StudentAuth")}>
                        <Button variant="outline" className="w-full text-blue-600 border-blue-600 hover:bg-blue-50">
                          Student Sign In
                        </Button>
                      </Link>
                      <Link to={createPageUrl("RecruiterAuth")}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Recruiter</Button>
                </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
