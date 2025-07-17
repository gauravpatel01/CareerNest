import React, { useState, useEffect } from "react";
// import { Job } from "../Entities/Job.json";
import { Link } from "react-router-dom";
import { createPageUrl } from "../Components/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, GraduationCap, Clock, IndianRupee, Filter, Calendar } from "lucide-react";
import JobCard from "../Components/jobs/JobCard"
import LoadingSpinner from "../Components/common/LoadingSpinner";

export default function Internships() {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");

  useEffect(() => {
    loadInternships();
  }, []);

  useEffect(() => {
    filterInternships();
  }, [internships, searchTerm, locationFilter, durationFilter]);

 const loadInternships = async () => {
  try {
    const response = await fetch("https://app.base44.com/api/apps/687508e8c02e10285e949016/entities/Job", {
      headers: {
        "api_key": "fc6a61ef692346c9b3d1d0749378bd8e",
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    const internshipJobs = data.filter((job) => job.job_type === "Internship");
    setInternships(internshipJobs);
  } catch (error) {
    console.error("Error loading internships:", error);
  } finally {
    setIsLoading(false);
  }
};

  const filterInternships = () => {
    let filtered = internships;

    if (searchTerm) {
      filtered = filtered.filter(internship =>
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter !== "all") {
      filtered = filtered.filter(internship => internship.location === locationFilter);
    }

    setFilteredInternships(filtered);
  };

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-green-600 to-teal-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Start Your Career Journey
            </h1>
            <p className="text-xl text-green-100 mb-8">
              Currently {internships.length}+ internship opportunities available
            </p>
            <div className="flex items-center justify-center space-x-6 text-green-100">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5" />
                <span>Student Friendly</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Flexible Duration</span>
              </div>
              <div className="flex items-center space-x-2">
                <IndianRupee className="w-5 h-5" />
                <span>Paid Opportunities</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search internships or companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
                <SelectItem value="Pune">Pune</SelectItem>
                <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                <SelectItem value="Noida">Noida</SelectItem>
              </SelectContent>
            </Select>

            <Select value={durationFilter} onValueChange={setDurationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Durations</SelectItem>
                <SelectItem value="1-3">1-3 Months</SelectItem>
                <SelectItem value="3-6">3-6 Months</SelectItem>
                <SelectItem value="6+">6+ Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">
              Showing {filteredInternships.length} internships
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <Select defaultValue="newest">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="stipend">Stipend</SelectItem>
                <SelectItem value="company">Company</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Internship Listings */}
        <div className="grid gap-6">
          {filteredInternships.length > 0 ? (
            filteredInternships.map((internship) => (
              <JobCard key={internship.id} job={internship} isInternship={true} />
            ))
          ) : (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No internships found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setLocationFilter("all");
                  setDurationFilter("all");
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-teal-700 rounded-xl p-8 mt-12 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Can't find the right internship?</h2>
          <p className="text-green-100 mb-6">
            Create your profile and get notified when new internships matching your preferences are posted
          </p>
          <Link to={createPageUrl("StudentAuth")}>
            <Button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold">
              Create Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}