
import React, { useState, useEffect } from "react";
import ApplicationApi from "../Services/ApplicationApi";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ApplicationFilters from "../components/applications/ApplicationFilters";
import ApplicationList from "../components/applications/ApplicationList";
import ApplicationDetails from "../components/applications/ApplicationDetails";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("-created_date");
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    loadApplications();
  }, [sortBy]);

  useEffect(() => {
    filterAndSortApplications();
  }, [applications, searchTerm, statusFilter, typeFilter]);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await ApplicationApi.list();
      setApplications(data);
    } catch (error) {
      console.error("Error loading applications:", error);
    }
    setIsLoading(false);
  };

  const filterAndSortApplications = () => {
    let filtered = [...applications];

    if (searchTerm) {
      filtered = filtered.filter((app) =>
        (app.student_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.position_title || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((app) => app.position_type === typeFilter);
    }

    setFilteredApplications(filtered);
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await ApplicationApi.update(applicationId, { status: newStatus });
      const updatedApplications = applications.map((app) =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      );
      setApplications(updatedApplications);

      if (selectedApplication?.id === applicationId) {
        setSelectedApplication((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleSelectionChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (isChecked) => {
    setSelectedIds(isChecked ? filteredApplications.map((app) => app.id) : []);
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedIds.length === 0) return;

    setIsLoading(true);
    try {
      const updates = selectedIds.map((id) =>
        ApplicationApi.update(id, { status })
      );
      await Promise.all(updates);
      setSelectedIds([]);
      await loadApplications();
    } catch (error) {
      console.error("Error during bulk update:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600 mt-1">Manage and review student applications</p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name or position..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <ApplicationFilters
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            </div>
          </CardContent>
        </Card>

        {selectedIds.length > 0 && (
          <Card className="mb-4 bg-indigo-50 border-indigo-200 shadow-md">
            <CardContent className="p-4 flex items-center justify-between">
              <p className="font-medium text-indigo-800">
                {selectedIds.length} application(s) selected.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium mr-2">Bulk Actions:</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatusUpdate("shortlisted")}
                >
                  Shortlist
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkStatusUpdate("rejected")}
                >
                  Reject
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setSelectedIds([])}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="w-full">
          <ApplicationList
            applications={filteredApplications}
            isLoading={isLoading}
            onSelectApplication={setSelectedApplication}
            onStatusUpdate={handleStatusUpdate}
            selectedApplication={selectedApplication}
            selectedIds={selectedIds}
            onSelectionChange={handleSelectionChange}
            onSelectAll={handleSelectAll}
          />
        </div>
      </div>

      <Dialog
        open={!!selectedApplication}
        onOpenChange={(isOpen) => !isOpen && setSelectedApplication(null)}
      >
        <DialogContent className="max-w-2xl p-0">
          {selectedApplication && (
            <div className="max-h-[90vh] overflow-y-auto">
              <DialogHeader className="p-6 pb-4">
                <DialogTitle>Application Details</DialogTitle>
              </DialogHeader>
              <div className="px-6 pb-6">
                <ApplicationDetails
                  application={selectedApplication}
                  onStatusUpdate={handleStatusUpdate}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
