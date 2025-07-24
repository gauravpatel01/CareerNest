import React, { useState, useEffect } from "react";
import { fetchInternshipsFromAPI, updateInternshipStatus } from "../Services/InternshipApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle, XCircle } from "lucide-react";

import StatCard from "../components/admin/StatCard";
import InternshipTable from "../components/admin/InternshipTable";
import InternshipDetailsModal from "../components/admin/InternshipDetailsModal";
import AdminAuth from "./AdminAuth";

// Admin Dashboard Component
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [internships, setInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchInternships = async () => {
    setIsLoading(true);
    try {
      const data = await fetchInternshipsFromAPI();
      setInternships(data);

      const pending = data.filter((i) => i.status === "pending").length;
      const approved = data.filter((i) => i.status === "approved").length;
      const rejected = data.filter((i) => i.status === "rejected").length;
      setStats({ pending, approved, rejected });
    } catch (error) {
      console.error("Failed to fetch internships:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const adminAuth = localStorage.getItem("admin-auth");
    if (adminAuth === "true") setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchInternships();
    }
  }, [isAuthenticated]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateInternshipStatus(id, status);
      await fetchInternships(); // refresh data after update
      if (isModalOpen) setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleViewDetails = (internship) => {
    setSelectedInternship(internship);
    setIsModalOpen(true);
  };

  if (!isAuthenticated) {
    return <AdminAuth onLogin={() => setIsAuthenticated(true)} />;
  }

  const filteredInternships = (status) => internships.filter((i) => i.status === status);

  return (
    <div className="bg-gray-50/50 min-h-screen">
      {/* Header is in Layout.js */}
      <main className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <StatCard title="Pending Applications" value={stats.pending} icon={Clock} color="text-yellow-500" />
          <StatCard title="Approved Internships" value={stats.approved} icon={CheckCircle} color="text-green-500" />
          <StatCard title="Rejected Applications" value={stats.rejected} icon={XCircle} color="text-red-500" />
        </div>

        {/* Internships Table */}
        <Card>
          <CardHeader>
            <CardTitle>Internship Applications</CardTitle>
            <CardDescription>Review, approve, or reject internship posts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="mb-4">
                <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
              </TabsList>
              <TabsContent value="pending">
                <InternshipTable
                  internships={filteredInternships("pending")}
                  onStatusChange={handleStatusChange}
                  onViewDetails={handleViewDetails}
                />
              </TabsContent>
              <TabsContent value="approved">
                <InternshipTable
                  internships={filteredInternships("approved")}
                  onStatusChange={handleStatusChange}
                  onViewDetails={handleViewDetails}
                />
              </TabsContent>
              <TabsContent value="rejected">
                <InternshipTable
                  internships={filteredInternships("rejected")}
                  onStatusChange={handleStatusChange}
                  onViewDetails={handleViewDetails}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <InternshipDetailsModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        internship={selectedInternship}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
