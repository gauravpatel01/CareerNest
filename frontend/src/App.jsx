import React from "react";
import Layout from "./layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import FAQ from "./Pages/FAQ";
import Jobs from "./Pages/Jobs";
import Internships from "./Pages/Internships";
import JobDetails from "./Pages/JobDetails";
import StudentAuth from "./Pages/StudentAuth";
import RecruiterAuth from "./Pages/RecruiterAuth";
import RecruiterDashboard from "./Pages/RecruiterDashboard";
import StudentDashboard from "./Pages/StudentDashboard";
import StudentLayout from "./StudentLAyout";
import ResumeBuilder from "./Pages/ResumeBuilder";
import UpdateProfile from "./Pages/UpdateProfile";
import UploadResume from "./Pages/UploadResume";
import MyApplicationCard from "./Components/jobs/MyApplicationCard";
import MyApplications from "./Pages/MyApplications";
import PostJobs from "./Pages/PostJobs";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout currentPageName="Home">
              <Home />
            </Layout>
          }
        />
        <Route
          path="/p/home"
          element={
            <Layout currentPageName="Home">
              <Home />
            </Layout>
          }
        />
        <Route
          path="/p/jobs"
          element={
            <Layout currentPageName="Jobs">
              <Jobs />
            </Layout>
          }
        />
        <Route
          path="/p/internships"
          element={
            <Layout currentPageName="Internships">
              <Internships />
            </Layout>
          }
        />
        <Route
          path="/p/job-details"
          element={
            <Layout currentPageName="JobDetails">
              <JobDetails />
            </Layout>
          }
        />
        <Route
          path="/p/about"
          element={
            <Layout currentPageName="About">
              <About />
            </Layout>
          }
        />
        <Route
          path="/p/faq"
          element={
            <Layout currentPageName="FAQ">
              <FAQ />
            </Layout>
          }
        />
        <Route
          path="/p/studentauth"
          element={
            <Layout currentPageName="StudentAuth">
              <StudentAuth />
            </Layout>
          }
        />
        <Route
          path="/p/studentdashboard"
          element={
            <StudentLayout currentPageName="StudentDashboard">
              <StudentDashboard />
            </StudentLayout>
          }
        />
        <Route
          path="/p/editresume"
          element={
            <StudentLayout currentPageName="StudentDashboard">
              <ResumeBuilder />
            </StudentLayout>
          }
        />
        <Route
          path="/p/updateprofile"
          element={
            <StudentLayout>
              <UpdateProfile />
            </StudentLayout>
          }
        />
        <Route
          path="/p/help"
          element={
            <StudentLayout currentPageName="FAQ">
              <FAQ />
            </StudentLayout>
          }
        />
        <Route
          path="/p/uploadresume"
          element={
            <StudentLayout>
              <UploadResume />
            </StudentLayout>
          }
        />
        <Route
          path="/p/internship"
          element={
            <StudentLayout>
              <Internships />
            </StudentLayout>
          }
        />
        <Route
          path="/p/FAQs"
          element={
            <StudentLayout>
              <FAQ />
            </StudentLayout>
          }
        />
        <Route
          path="/p/applications"
          element={
            <StudentLayout>
              <MyApplications />
            </StudentLayout>
          }
        />
        <Route
          path="/p/recruiterauth"
          element={
            <Layout currentPageName="RecruiterAuth">
              <RecruiterAuth />
            </Layout>
          }
        />
        <Route
          path="/p/recruiterdashboard"
          element={
            <Layout currentPageName="RecruiterDashboard">
              <RecruiterDashboard />
            </Layout>
          }
        />
        <Route
          path="/p/post-jobs"
          element={
            <Layout>
              <PostJobs />
            </Layout>
          }
        />

        {/* Optional: 404 page fallback */}
        <Route
          path="*"
          element={
            <Layout currentPageName="404">
              <div className="text-center py-20">404 - Page Not Found</div>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}
