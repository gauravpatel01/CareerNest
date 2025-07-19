// src/Components/Chatbot.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(true); // toggle chatbot visibility
    const [messages, setMessages] = useState([
        {
            from: "bot",
            text: "👋 Hi! What are you looking for?",
            options: ["Post Internship", "Browse Internships", "Build Resume"],
        },
    ]);
    const [input, setInput] = useState("");
    const [stage, setStage] = useState("select-option");

    const [resumeData, setResumeData] = useState({
        name: "",
        contact: "",
        otp: "",
        email: "",
        skills: "",
        education: "",
        experience: "",
    });
    const [currentStep, setCurrentStep] = useState(0);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const resumeQuestions = [
        { key: "email", question: "What's your email address?" },
        { key: "skills", question: "List your skills (comma separated):" },
        { key: "education", question: "Tell me about your education background." },
        { key: "experience", question: "Add your work/internship experience." },
    ];

    const validateInput = (key, value) => {
        switch (key) {
            case "name":
                return /^[A-Za-z\s]{3,50}$/.test(value.trim()) || "Enter a valid full name (only letters, min 3 characters).";
            case "contact":
                return /^[0-9]{10}$/.test(value.trim()) || "Enter valid 10-digit contact number.";
            case "email":
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || "Enter valid email.";
            case "skills":
                return value.trim().length > 0 || "Add at least one skill.";
            case "education":
                return value.trim().length >= 10 || "Add more education detail.";
            case "experience":
                return value.trim().length >= 10 || "Add more experience detail.";
            default:
                return true;
        }
    };

    const handleOptionSelect = (option) => {
        if (option === "Build Resume") {
            setStage("name");
            setMessages((prev) => [
                ...prev,
                { from: "user", text: option },
                { from: "bot", text: "Enter your full name:" },
            ]);
        } else if (option === "Browse Internships") {
            setMessages((prev) => [...prev, { from: "user", text: option }]);
            setTimeout(() => navigate("/p/internships"), 500);
        } else if (option === "Post Internship") {
            setMessages((prev) => [...prev, { from: "user", text: option }]);
            setTimeout(() => navigate("/p/recruiterauth"), 500);
        }
    };


    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);
    // Auto reopen chatbot after close
    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => setIsOpen(true), 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg = { from: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);

        if (stage === "name") {
            const valid = validateInput("name", input);
            if (valid !== true) return botMsg(valid);
            setResumeData((prev) => ({ ...prev, name: input }));
            setStage("contact");
            return botMsg("Enter your 10-digit contact number:");
        }

        if (stage === "contact") {
            const valid = validateInput("contact", input);
            if (valid !== true) return botMsg(valid);
            setResumeData((prev) => ({ ...prev, contact: input }));
            setStage("otp");
            return botMsg("Enter OTP sent to your number (simulate: 1234):");
        }

        if (stage === "otp") {
            if (input !== "1234") return botMsg("❌ Invalid OTP. Try again (hint: 1234)");
            setStage("resume-form");
            setCurrentStep(0);
            return botMsg(resumeQuestions[0].question);
        }

        if (stage === "resume-form") {
            const stepKey = resumeQuestions[currentStep].key;
            const valid = validateInput(stepKey, input);
            if (valid !== true) return botMsg(valid);

            setResumeData((prev) => ({ ...prev, [stepKey]: input }));
            const next = currentStep + 1;

            if (next < resumeQuestions.length) {
                setCurrentStep(next);
                return botMsg(resumeQuestions[next].question);
            } else {
                setStage("complete");
                return botMsg("✅ Resume complete! Click below to download.");
            }
        }

        setInput("");
    };

    const botMsg = (text) => {
        setMessages((prev) => [...prev, { from: "bot", text }]);
        setInput("");
    };

    const downloadResume = () => {
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text("Resume", 20, 20);
        Object.entries(resumeData).forEach(([key, value], i) => {
            if (key !== "otp") doc.text(`${key.toUpperCase()}: ${value}`, 20, 30 + i * 10);
        });
        doc.save("CareerNest_Resume.pdf");
    };

    return (
        <div className="fixed bottom-4 right-4 w-80 bg-white border rounded shadow-lg z-50 flex flex-col">
            {/* Toggle Button / Header */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-600 text-white p-3 font-bold text-sm rounded-t cursor-pointer"
            >
                CareerNest Chatbot {isOpen ? "▲" : "▼"}
            </div>

            {/* Chat Body */}
            {isOpen && (
                <>
                    <div className="p-3 h-72 overflow-y-auto text-sm space-y-2">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`p-2 rounded-md max-w-[90%] ${msg.from === "user" ? "bg-blue-100 text-right ml-auto" : "bg-gray-100 text-left"
                                    }`}
                            >
                                {msg.text}
                                {msg.options && (
                                    <div className="mt-2 space-y-1">
                                        {msg.options.map((opt, idx) => (
                                            <button
                                                key={idx}
                                                className="w-full text-left text-blue-600 border border-blue-500 px-2 py-1 rounded text-xs"
                                                onClick={() => handleOptionSelect(opt)}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {stage === "complete" && (
                            <button
                                onClick={downloadResume}
                                className="mt-3 bg-green-600 text-white px-3 py-2 rounded text-sm"
                            >
                                📄 Download Resume as PDF
                            </button>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Box */}
                    {stage !== "select-option" && stage !== "complete" && (
                        <div className="flex border-t">
                            <input
                                type="text"
                                className="flex-grow px-2 py-1 text-sm border-r"
                                placeholder="Type your message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            />
                            <button className="bg-blue-600 text-white px-3 text-sm" onClick={handleSend}>
                                Send
                            </button>
                        </div>
                    )}
                </>
            )}



        </div>
    );
}
