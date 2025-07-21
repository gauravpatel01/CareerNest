// insert_user.js
// Run with: mongosh --file insert_user.js

db = db.getSiblingDB('careernest');

// USERS COLLECTION
// Create collection with schema validation
try { db.users.drop(); } catch(e) {}
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "role"],
      properties: {
        name: { bsonType: "string" },
        email: { bsonType: "string" },
        password: { bsonType: "string" },
        role: { enum: ["student", "recruiter"] },
        phone: { bsonType: "string" },
        location: { bsonType: "string" },
        address: {
          bsonType: "object",
          properties: {
            street: { bsonType: "string" },
            city: { bsonType: "string" },
            state: { bsonType: "string" },
            zip: { bsonType: "string" }
          }
        },
        github: { bsonType: "string" },
        linkedin: { bsonType: "string" },
        portfolio: { bsonType: "string" },
        about: { bsonType: "string" },
        image: { bsonType: "string" },
        education_level: { bsonType: "string" },
        field_of_study: { bsonType: "string" },
        graduation_year: { bsonType: "string" },
        skills: { bsonType: "string" },
        experience: { bsonType: "string" },
        bio: { bsonType: "string" },
        collegeName: { bsonType: "string" },
        programme: { bsonType: "string" },
        branch: { bsonType: "string" },
        year: { bsonType: "string" },
        gender: { bsonType: "string" },
        company_name: { bsonType: "string" },
        company_size: { bsonType: "string" },
        industry: { bsonType: "string" },
        job_title: { bsonType: "string" },
        company_website: { bsonType: "string" },
        company_description: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});
db.users.createIndex({ email: 1 }, { unique: true });

db.users.insertOne({
  name: "Student User",
  email: "student@example.com",
  password: "hashed_password_here",
  role: "student",
  phone: "9876543210",
  location: "Student City, Country",
  address: { street: "123 Main St", city: "Student City", state: "State", zip: "123456" },
  github: "https://github.com/student",
  linkedin: "https://linkedin.com/in/student",
  portfolio: "https://studentportfolio.com",
  about: "Motivated student seeking internships.",
  image: "",
  education_level: "Bachelor's",
  field_of_study: "Information Technology",
  graduation_year: "2025",
  skills: "Python, Data Analysis, SQL",
  experience: "Intern at ABC Inc.",
  bio: "Student bio",
  collegeName: "ABC College",
  programme: "B.Tech",
  branch: "CSE",
  year: "2025",
  gender: "Male",
  createdAt: new Date(),
  updatedAt: new Date()
});
db.users.insertOne({
  name: "Recruiter User",
  email: "recruiter@example.com",
  password: "hashed_password_here",
  role: "recruiter",
  phone: "1234567890",
  location: "Recruiter City, Country",
  address: { street: "456 Business Rd", city: "Recruiter City", state: "State", zip: "654321" },
  github: "",
  linkedin: "https://linkedin.com/in/recruiter",
  portfolio: "",
  about: "Recruiter about...",
  image: "",
  company_name: "Acme Corp",
  company_size: "200",
  industry: "Software",
  job_title: "HR Manager",
  company_website: "https://acme.com",
  company_description: "Leading software company.",
  gender: "Female",
  createdAt: new Date(),
  updatedAt: new Date()
});

// JOBS COLLECTION
try { db.jobs.drop(); } catch(e) {}
db.createCollection("jobs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "company", "location"],
      properties: {
        title: { bsonType: "string" },
        company: { bsonType: "string" },
        location: { bsonType: "string" },
        salary_min: { bsonType: "number" },
        salary_max: { bsonType: "number" },
        job_type: { bsonType: "string" },
        experience_level: { bsonType: "string" },
        description: { bsonType: "string" },
        requirements: { bsonType: "array", items: { bsonType: "string" } },
        benefits: { bsonType: "array", items: { bsonType: "string" } },
        skills: { bsonType: "array", items: { bsonType: "string" } },
        remote_option: { bsonType: "bool" },
        posted_by: { bsonType: "string" },
        company_logo: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});
db.jobs.createIndex({ title: 1, company: 1, location: 1 }, { unique: true });
db.jobs.insertOne({
  title: "Frontend Developer",
  company: "Acme Corp",
  location: "Noida",
  salary_min: 400000,
  salary_max: 600000,
  job_type: "Full-time",
  experience_level: "Entry Level",
  description: "Develop and maintain web applications.",
  requirements: ["React", "JavaScript", "HTML", "CSS"],
  benefits: ["Health Insurance", "Paid Time Off"],
  skills: ["React", "JavaScript"],
  remote_option: true,
  posted_by: "recruiter@example.com",
  company_logo: "",
  createdAt: new Date(),
  updatedAt: new Date()
});

// INTERNSHIPS COLLECTION
try { db.internships.drop(); } catch(e) {}
db.createCollection("internships", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "company", "location"],
      properties: {
        title: { bsonType: "string" },
        company: { bsonType: "string" },
        description: { bsonType: "string" },
        location: { bsonType: "string" },
        stipend: { bsonType: "string" },
        duration: { bsonType: "string" },
        requirements: { bsonType: "string" },
        postedAt: { bsonType: "date" }
      }
    }
  }
});
db.internships.createIndex({ title: 1, company: 1, location: 1 }, { unique: true });
db.internships.insertOne({
  title: "Frontend Intern",
  company: "Acme Corp",
  description: "Assist in frontend development.",
  location: "Noida",
  stipend: "₹10,000/month",
  duration: "3 months",
  requirements: "Basic knowledge of React and JavaScript.",
  postedAt: new Date()
});

// APPLICATIONS COLLECTION
try { db.applications.drop(); } catch(e) {}
db.createCollection("applications", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["job_id", "applicant_email"],
      properties: {
        job_id: { bsonType: "string" },
        applicant_email: { bsonType: "string" },
        applicant_name: { bsonType: "string" },
        resume_url: { bsonType: "string" },
        cover_letter: { bsonType: "string" },
        phone: { bsonType: "string" },
        experience: { bsonType: "string" },
        status: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});
db.applications.createIndex({ job_id: 1, applicant_email: 1 }, { unique: true });
db.applications.insertOne({
  job_id: "1", // Use actual job _id in real usage
  applicant_email: "student@example.com",
  applicant_name: "Student User",
  resume_url: "https://example.com/resume.pdf",
  cover_letter: "I am excited to apply!",
  phone: "9876543210",
  experience: "Intern at ABC Inc.",
  status: "pending",
  createdAt: new Date(),
  updatedAt: new Date()
}); 