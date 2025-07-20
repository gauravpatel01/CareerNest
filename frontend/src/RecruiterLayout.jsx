import React, { useState, useEffect } from "react";
import { FileText, Briefcase, LayoutDashboard, Send, Bell, Menu, X, Users, Building, Plus, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "./Components/utils";
import { Button } from "@/components/ui/button";
import UserProfileDropdown from "@/components/layout/UserProfileDropdown";

export default function RecruiterLayout({ children }) {
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
      const jwt = localStorage.getItem("jwt");
      if (jwt) {
        const userData = localStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          setUser({
            full_name: "Demo Recruiter",
            email: "recruiter@example.com",
            role: "recruiter",
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
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoading(false);
    navigate("/p/home");
  };

  const navItems = [
    { name: "Dashboard", href: createPageUrl("recruiterdashboard") },
    { name: "Post Jobs", href: createPageUrl("post-jobs") },
    { name: "Manage Jobs", href: createPageUrl("manage-jobs") },
    { name: "Applications", href: createPageUrl("applications") },
    { name: "Analytics", href: createPageUrl("analytics") },
    { name: "Logout", href: "#", onClick: handleLogout },
  ];

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
          <div className="flex flex-wrap justify-between items-center h-16 gap-4">
            <Link to={createPageUrl("Home")} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CareerNest</span>
            </Link>

            <nav className="hidden lg:flex flex-wrap gap-4">
              {["Home", "Jobs", "Internships", "About", "FAQ"].map((page) => (
                <Link
                  key={page}
                  to={createPageUrl(page)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  {page}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
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

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:block lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="sm:block lg:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {["Home", "Jobs", "Internships", "About", "FAQ"].map((page) => (
                <Link
                  key={page}
                  to={createPageUrl(page)}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {page}
                </Link>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex flex-col space-y-2 px-3">
                  {isLoading ? (
                    <div className="w-full h-10 bg-gray-200 rounded animate-pulse my-2"></div>
                  ) : user ? (
                    <UserProfileDropdown user={user} onLogout={handleLogout} />
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

      {/* Main Content with Sidebar */}
      <div className="flex flex-col lg:flex-row bg-white font-sans">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 bg-blue-50 shadow-lg lg:rounded-xl m-0 lg:m-4 p-4 space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800 border-b pb-2">
            <Building className="w-5 h-5" />
            Recruiter Dashboard
          </h2>

          <nav className="space-y-4 text-sm font-semibold text-gray-800">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={item.onClick}
                className={`block bg-white hover:bg-blue-100 p-4 rounded-xl border-l-4 shadow-sm transition-colors duration-200 ${
                  isActive(item.href) ? "border-blue-500 bg-blue-50" : "border-transparent hover:border-blue-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.name === "Dashboard" && <LayoutDashboard className="w-5 h-5" />}
                  {item.name === "Post Jobs" && <Plus className="w-5 h-5" />}
                  {item.name === "Manage Jobs" && <Briefcase className="w-5 h-5" />}
                  {item.name === "Applications" && <Send className="w-5 h-5" />}
                  {item.name === "Analytics" && <FileText className="w-5 h-5" />}
                  {item.name === "Logout" && <LogOut className="w-5 h-5" />}
                  <span>{item.name}</span>
                </div>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 px-2 sm:px-4 py-4 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
