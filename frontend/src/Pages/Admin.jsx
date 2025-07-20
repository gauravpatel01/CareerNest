import React, { useState, useEffect } from 'react';
import { fetchInternshipsFromAPI, updateInternshipStatus } from "../Services/InternshipApi";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Briefcase, Clock, CheckCircle, XCircle } from 'lucide-react';

import StatCard from '../components/admin/StatCard';
import InternshipTable from '../components/admin/InternshipTable';
import InternshipDetailsModal from '../components/admin/InternshipDetailsModal';

// Dummy Login Component
function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Dummy validation
    setTimeout(() => {
      if (email === 'admin@careernest.com' && password === '1234') {
        onLogin();
      } else {
        setError('Invalid credentials. Use email : admin@careernest.com and password : 1234');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-sm mx-auto shadow-lg">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                 <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-indigo-600" />
                 </div>
            </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Enter your details to access the admin panel.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <p className="text-xs text-center text-gray-500 pt-2">
              Note: This is a demo login. Real authentication is handled by the platform.
            </p>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


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

    const pending = data.filter(i => i.status === 'pending').length;
    const approved = data.filter(i => i.status === 'approved').length;
    const rejected = data.filter(i => i.status === 'rejected').length;
    setStats({ pending, approved, rejected });
  } catch (error) {
    console.error("Failed to fetch internships:", error);
  }
  setIsLoading(false);
};


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
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const filteredInternships = (status) => internships.filter(i => i.status === status);

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
                    <InternshipTable internships={filteredInternships('pending')} onStatusChange={handleStatusChange} onViewDetails={handleViewDetails} />
                  </TabsContent>
                  <TabsContent value="approved">
                    <InternshipTable internships={filteredInternships('approved')} onStatusChange={handleStatusChange} onViewDetails={handleViewDetails} />
                  </TabsContent>
                  <TabsContent value="rejected">
                    <InternshipTable internships={filteredInternships('rejected')} onStatusChange={handleStatusChange} onViewDetails={handleViewDetails} />
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