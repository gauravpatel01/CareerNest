import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./Components/utils";
import { Menu, X, Briefcase, Users, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserProfileDropdown from "@/components/layout/UserProfileDropdown";
// import { User } from "@/entities/User";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, [location.pathname]); // Re-check user status on page navigation

  const checkUser = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (e) {
      setUser(null); // User is not logged in
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    // Reset user state immediately when logout is triggered
    setUser(null);
    setIsLoading(false);
  };

  const navItems = [
    { name: "Home", href: createPageUrl("Home") },
    { name: "Jobs", href: createPageUrl("Jobs") },
    { name: "Internships", href: createPageUrl("Internships") },
    { name: "About", href: createPageUrl("About") },
    { name: "FAQ", href: createPageUrl("FAQ") },
  ];

  const isActive = (href) => location.pathname === href;

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
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons and Profile */}
            <div className="hidden md:flex items-center space-x-3">
              {isLoading ? (
                <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : user || true ? (
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
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex flex-col space-y-2 px-3">
                  {isLoading ? (
                    <div className="w-full h-10 bg-gray-200 rounded animate-pulse my-2"></div>
                  ) : user || true ? (
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

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">CareerNest</span>
              </div>
              <p className="text-gray-400 text-sm">
                India's leading job portal connecting talented students with top companies across major cities.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">For Job Seekers</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link to={createPageUrl("Jobs")} className="hover:text-white transition-colors">
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("Internships")} className="hover:text-white transition-colors">
                    Find Internships
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("StudentAuth")} className="hover:text-white transition-colors">
                    Student Login
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">For Employers</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link to={createPageUrl("RecruiterAuth")} className="hover:text-white transition-colors">
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("RecruiterAuth")} className="hover:text-white transition-colors">
                    Recruiter Login
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("About")} className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>support@careernest.in</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 9876543210</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Mumbai, India</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 CareerNest. All rights reserved. Made with ❤️ in India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
