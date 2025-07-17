import { useEffect, useState } from "react";
import LoadingSpinner from "../Components/common/LoadingSpinner";
import MyApplicationCard from "@/Components/jobs/MyApplicationCard";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const email = localStorage.getItem("email") || "shivam@email.com"; // Replace accordingly

  useEffect(() => {
    async function fetchApplications() {
      const url = "https://app.base44.com/api/apps/687508e8c02e10285e949016/entities/Application";

      try {
        const response = await fetch(url, {
          headers: {
            api_key: "fc6a61ef692346c9b3d1d0749378bd8e",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch applications.");

        const data = await response.json();
        setApplications(data);
      } catch (err) {
        console.error(err.message);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, [email]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 text-blue-900">My Applications</h1>

      {applications.length > 0 ? (
        <div className="grid gap-6">
          {applications.map((app) => (
            <MyApplicationCard key={app.id} app={app} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">No applications found.</div>
      )}
    </div>
  );
}
