import React, { useState, useEffect } from "react";
// import { User } from "@/entities/User";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User as UserIcon, Settings, HelpCircle, Mail, Shield, Key, Trash2, LogOut, ChevronDown } from "lucide-react";

export default function UserProfileDropdown({ user, onLogout }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await User.logout();
      // Call the onLogout callback to refresh parent state immediately
      if (onLogout) {
        onLogout();
      }
      // No redirect - just stay on current page and show sign-in buttons
    } catch (error) {
      console.error("Error logging out:", error);
      // Still call onLogout to refresh state even if logout fails
      if (onLogout) {
        onLogout();
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleChangePassword = () => {
    // In a real app, this would open a change password modal
    alert("Password change functionality would be implemented here");
  };

  const handleChangeEmail = () => {
    // In a real app, this would open a change email modal
    alert("Email change functionality would be implemented here");
  };

  const handleDeleteAccount = () => {
    // In a real app, this would open a confirmation modal
    const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmed) {
      alert("Account deletion functionality would be implemented here");
    }
  };

  if (!user) {
    return null;
  }

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isStudent = user.user_type === "student";
  const isRecruiter = user.user_type === "recruiter";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 p-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {getUserInitials(user.full_name)}dwdwd
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium text-gray-900">{user.full_name || "User"}</span>
            <span className="text-xs text-gray-500">{isStudent ? "Student" : isRecruiter ? "Recruiter" : "User"}</span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-gray-900">{user.full_name || "User"}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            to={createPageUrl(isRecruiter ? "RecruiterDashboard" : "StudentDashboard")}
            className="flex items-center"
          >
            <UserIcon className="w-4 h-4 mr-2" />
            Your Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs text-gray-500 font-normal">SUPPORT</DropdownMenuLabel>

        <DropdownMenuItem asChild>
          <Link to={createPageUrl("FAQ")} className="flex items-center">
            <HelpCircle className="w-4 h-4 mr-2" />
            Help Center
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a href="mailto:support@careernest.in" className="flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            Contact Us
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs text-gray-500 font-normal">ACCOUNT MANAGEMENT</DropdownMenuLabel>

        <DropdownMenuItem onClick={handleChangePassword} className="flex items-center">
          <Key className="w-4 h-4 mr-2" />
          Change Password
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleChangeEmail} className="flex items-center">
          <Mail className="w-4 h-4 mr-2" />
          Change Email
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleDeleteAccount} className="flex items-center text-red-600">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Account
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut} className="flex items-center text-red-600">
          <LogOut className="w-4 h-4 mr-2" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
