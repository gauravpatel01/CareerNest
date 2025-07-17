import React, { useState } from "react";
import { ChevronDown, ChevronUp, Search, HelpCircle, Users, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState({});

  const categories = [
    { id: "all", name: "All FAQs", icon: HelpCircle },
    { id: "students", name: "For Students", icon: Users },
    { id: "recruiters", name: "For Recruiters", icon: Briefcase }
  ];

  const faqs = [
    {
      id: 1,
      category: "students",
      question: "How do I create a student account on CareerNest?",
      answer: "Creating a student account is simple! Click on 'Student Sign In' in the header, then select 'Create Account'. Fill in your details including your educational background, skills, and preferences. Make sure to upload a professional resume to increase your chances of getting noticed by recruiters."
    },
    {
      id: 2,
      category: "students",
      question: "Is CareerNest free for job seekers?",
      answer: "Yes, CareerNest is completely free for all job seekers and students. You can browse jobs, apply to positions, create your profile, and use all our features without any cost. We believe everyone deserves access to career opportunities."
    },
    {
      id: 3,
      category: "students",
      question: "How can I improve my chances of getting hired?",
      answer: "To improve your chances: 1) Complete your profile 100% with all details, 2) Upload a professional resume and photo, 3) Add relevant skills and certifications, 4) Write a compelling profile summary, 5) Apply to jobs that match your qualifications, and 6) Follow up on applications when appropriate."
    },
    {
      id: 4,
      category: "students",
      question: "What types of jobs are available in India?",
      answer: "We have opportunities across all major Indian cities including Mumbai, Delhi, Bangalore, Pune, Hyderabad, and Noida. Job types include software development, data analysis, marketing, sales, finance, HR, operations, and many more. Both entry-level positions and internships are available."
    },
    {
      id: 5,
      category: "students",
      question: "How do I know if a company has viewed my application?",
      answer: "You'll receive email notifications when recruiters view your profile or application. You can also check your application status in your dashboard. We provide real-time updates on whether your application is pending, under review, or has been shortlisted."
    },
    {
      id: 6,
      category: "recruiters",
      question: "How can my company start posting jobs on CareerNest?",
      answer: "To start posting jobs, click on 'Recruiter' in the header and create a company account. You'll need to verify your company email and provide basic company information. Once approved, you can post unlimited job listings and access our candidate database."
    },
    {
      id: 7,
      category: "recruiters",
      question: "What are the costs for recruiters?",
      answer: "We offer flexible pricing plans for recruiters. Basic job posting starts at ₹5,000 per month for unlimited job posts. Premium plans include additional features like candidate search, priority listing, and dedicated support. Contact our sales team for custom enterprise solutions."
    },
    {
      id: 8,
      category: "recruiters",
      question: "How can I find the right candidates quickly?",
      answer: "Use our advanced search filters to find candidates by location, skills, experience level, education, and more. You can also set up job alerts to get notified when qualified candidates apply. Our AI-powered matching system suggests the best candidates for your requirements."
    },
    {
      id: 9,
      category: "recruiters",
      question: "Can I schedule interviews through the platform?",
      answer: "Yes! Our integrated interview scheduling tool allows you to coordinate with candidates directly. You can send interview invitations, set up video calls, and manage your entire hiring pipeline from one dashboard."
    },
    {
      id: 10,
      category: "students",
      question: "Are there internship opportunities available?",
      answer: "Absolutely! We have a dedicated internship section with opportunities across various fields. These include paid internships, remote work options, and programs with leading Indian companies. Many internships also offer the possibility of full-time conversion."
    },
    {
      id: 11,
      category: "students",
      question: "How do I prepare for interviews?",
      answer: "We provide interview preparation resources including common questions, tips for different job types, and guidance on presenting yourself professionally. Many companies also provide specific interview guidelines when they shortlist candidates."
    },
    {
      id: 12,
      category: "recruiters",
      question: "What support do you provide for new recruiters?",
      answer: "New recruiters get dedicated onboarding support, including platform training, best practices for job posting, and tips for attracting quality candidates. Our support team is available Monday-Friday, 9AM-6PM IST to help with any questions."
    }
  ];

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = searchTerm === "" || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
            Find answers to common questions about using CareerNest for your career journey
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Categories */}
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                    activeCategory === category.id
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredFaqs.length} of {faqs.length} questions
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <Card key={faq.id} className="border-l-4 border-l-blue-500">
              <CardHeader
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleItem(faq.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-3">
                    <Badge 
                      variant="secondary" 
                      className={`mt-1 ${
                        faq.category === 'students' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {faq.category === 'students' ? 'Students' : 'Recruiters'}
                    </Badge>
                    <CardTitle className="text-left text-lg font-semibold text-gray-900">
                      {faq.question}
                    </CardTitle>
                  </div>
                  {openItems[faq.id] ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              
              {openItems[faq.id] && (
                <CardContent className="pt-0">
                  <div className="pl-20">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No questions found</h3>
            <p className="text-gray-500">Try adjusting your search terms or browse different categories</p>
          </div>
        )}

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 mt-12 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-blue-100 mb-6">
            Our support team is here to help you succeed in your career journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@careernest.in"
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Email Support
            </a>
            <a 
              href="tel:+919876543210"
              className="border border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}