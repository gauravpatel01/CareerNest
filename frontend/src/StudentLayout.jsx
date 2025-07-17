import React, { useState } from "react";
import { FileText, Briefcase, LayoutDashboard, Send, Bell, Menu, X, Mail, Phone, MapPin, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "./Components/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdownmenu";

export default function StudentLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = {
    name: "Shivam Prakash", // Replace with dynamic user data
  };
  const firstLetter = user?.name?.charAt(0).toUpperCase() || "?";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/p/home");
  };

  const goToNotifications = () => {
    navigate("/notifications");
  };

  const navItems = [
    { name: "Dashboard", href: createPageUrl("studentdashboard") },
    { name: "Resume", href: createPageUrl("editResume") },
    { name: "Internships", href: createPageUrl("Internship") },
    { name: "My Applications", href: createPageUrl("applications") },
    { name: "FAQs", href: createPageUrl("FAQs") },
    { name: "Logout", href: "#", onClick: handleLogout },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto sm:px-2 ">
          <div className="flex justify-between items-center h-16">
            <Link to={createPageUrl("Home")} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CareerNest</span>
            </Link>
            {/* nav buttons  */}
            <div className="hidden md:flex items-center space-x-3">
              <nav className="flex items-center gap-6 text-sm font-medium text-blue-900">
                <Link to={createPageUrl("studentdashboard")} className="flex items-center gap-1">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <Link to={createPageUrl("editresume")} className="flex items-center gap-1">
                  <FileText className="w-4 h-4" /> Resume
                </Link>
                <Link to={createPageUrl("internship")} className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" /> Internships
                </Link>
                <Link to={createPageUrl("applications")} className="flex items-center gap-1">
                  <Send className="w-4 h-4" /> My Applications
                </Link>
                <button onClick={goToNotifications} className="relative p-2 text-gray-600 hover:text-blue-600">
                  <Bell className="w-5 h-5" />
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="bg-blue-900 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold hover:opacity-80 transition">
                      {firstLetter}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>
            </div>
            {/* Mobile Menu Button */}
            <Button
              aria-label="Toggle mobile menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault(); // Stop the default anchor navigation
                      item.onClick(); // Call logout function
                    }
                    setMobileMenuOpen(false);
                  }}
                  className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-200"></div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
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
