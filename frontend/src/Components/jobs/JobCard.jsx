import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, IndianRupee, Building, Users } from "lucide-react";

export default function JobCard({ job, isInternship = false }) {
  const formatSalary = (min, max) => {
    if (!min && !max) return "Salary not disclosed";
    if (min && max) {
      return isInternship
        ? `₹${(min / 1000).toFixed(1)}K - ₹${(max / 1000).toFixed(1)}K`
        : `₹${(min / 100000).toFixed(1)}L - ₹${(max / 100000).toFixed(1)}L`;
    }
    return min
      ? isInternship
        ? `₹${(min / 1000).toFixed(1)}K+`
        : `₹${(min / 100000).toFixed(1)}L+`
      : isInternship
      ? `Up to ₹${(max / 1000).toFixed(1)}K`
      : `Up to ₹${(max / 100000).toFixed(1)}L`;
  };

  // Helper to format stipend in thousands (K)
  const formatStipend = (stipend) => {
    if (!stipend) return '';
    // Extract numeric part from stipend string
    const match = stipend.toString().replace(/,/g, '').match(/\d+/);
    if (match) {
      const value = parseInt(match[0], 10);
      if (!isNaN(value)) {
        return `₹${(value / 1000).toFixed(1)}K`;
      }
    }
    return stipend; // fallback to original if not a number
  };

  const getExperienceBadgeColor = (level) => {
    switch (level) {
      case "Entry Level":
        return "bg-green-100 text-green-800";
      case "Mid Level":
        return "bg-blue-100 text-blue-800";
      case "Senior Level":
        return "bg-purple-100 text-purple-800";
      case "Executive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {job.company_logo && (
              <img
                src={job.company_logo}
                alt={job.company}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-1">
                {job.title}
              </CardTitle>
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <Building className="w-4 h-4" />
                <span className="font-medium">{job.company}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {job.location}
                </span>
                {job.remote_option && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Remote Available
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-green-600 font-semibold mb-2">
              <IndianRupee className="w-4 h-4 mr-1" />
              {isInternship && job.stipend ? (
                <span>{formatStipend(job.stipend)}</span>
              ) : (
                <span>{formatSalary(job.salary_min, job.salary_max)}</span>
              )}
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              <span>Posted recently</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={getExperienceBadgeColor(job.experience_level)}>
            {job.experience_level}
          </Badge>
          <Badge variant="secondary">{job.job_type}</Badge>
          {job.skills && job.skills.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="outline" className="text-blue-600 border-blue-600">
              {skill}
            </Badge>
          ))}
          {job.skills && job.skills.length > 3 && (
            <Badge variant="outline" className="text-gray-500">
              +{job.skills.length - 3} more
            </Badge>
          )}
        </div>
        
        {job.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {job.description.substring(0, 150)}...
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {job.benefits && job.benefits.length > 0 && (
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {job.benefits.length} benefits
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <Link to={`/p/job-details/${job._id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
            <Link to={`/p/job-details/${job._id}?apply=true`}>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                {isInternship ? "Apply for Internship" : "Apply Now"}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}