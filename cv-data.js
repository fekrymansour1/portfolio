/* ============================================================
   cv-data.js
   Single source of truth for all CV content.
   - Used to render the page sections
   - Used to ground the chatbot's system prompt (chatbot only
     answers from this object — see chatbot.js)
   Edit this file whenever the CV changes; nothing else needs
   to change for the content to update everywhere.
   ============================================================ */

const CV_DATA = {
  name: "Fekry Nabil Mohamed Mansour",
  role: "Computer Engineer · AI Systems & Automation",
  location: "Doha, Qatar",
  bornNote: "Born in Doha",
  email: "fekry.n.mansour@gmail.com",
  phone: "+974 5536 3197",
  linkedin: "https://www.linkedin.com/in/fekrymansour1",
  github: "https://github.com/fekrymansour1",
  photo: "images/profile.jpg",

  summary:
    "Computer Engineering graduate from Qatar University with Highest Academic Distinction, focused on AI agents, automation workflows, and embedded systems. Builds practical AI-powered tools — from RAG chatbots to workflow automation — and has hands-on experience teaching programming and mentoring students.",

  education: [
    {
      school: "Qatar University",
      location: "Qatar",
      degree: "Bachelor of Science in Computer Engineering",
      details: [
        "Grade: 3.6 / 4.0 GPA",
        "Dean's List: 2023 – 2025",
        "Graduated with Highest Academic Distinction in Qatar Secondary Education (99.75%)"
      ]
    }
  ],

  experience: [
    {
      org: "Qatar University",
      role: "Instructor Assistant",
      url: "https://www.qu.edu.qa/en-us/Colleges/ArtsSciences/deans-office/cas-success-oasis/Pages/default.aspx",
      bullets: [
        "Provide academic and technical support to undergraduate students in Python and Java programming courses, assisting in labs and practical sessions",
        "Collaborate with faculty to deliver course materials, supervise hands-on activities, and improve student engagement",
        "Contributed 200+ working hours to instructional support, mentoring, and academic project assistance"
      ]
    },
    {
      org: "CamelCodeQA",
      role: "Assistant Trainer",
      url: "https://camelcodeqa.com/team",
      bullets: [
        "Delivered technology training programs for children covering AI, robotics, and game development fundamentals",
        "Mentored 20+ students through hands-on programming projects, strengthening problem-solving and computational thinking skills",
        "Supported seasonal bootcamps and summer camps while collaborating with instructors to enhance lesson plans and classroom activities"
      ]
    }
  ],

  projects: [
    {
      name: "AI Workflow Automation Systems",
      bullets: [
        "Developed AI-driven automation systems for workflow orchestration using Python, n8n, and cross-platform integrations, enabling programmatic account management and Excel-based process automation",
        "Built AI-powered chatbots using LangChain and RAG with Supabase for data storage and vector search, enabling intelligent retrieval of company-specific knowledge and automated internal support"
      ]
    },
    {
      name: "Student Management System",
      bullets: [
        "Designed and implemented a Python-based system to manage student records, courses, and grades using structured and object-oriented data handling",
        "Developed persistent storage using Python file I/O and implemented data validation to ensure data integrity, consistency, and error handling"
      ]
    },
    {
      name: "Shipment Management System",
      bullets: [
        "Engineered Java-based shipment management functionalities, including updating shipment records, modifying shipping methods, and handling payment processing",
        "Developed reporting modules to generate actionable insights, supporting data-driven decision-making"
      ]
    },
    {
      name: "Fitness Mobile Application (MIT App Inventor)",
      bullets: [
        "Built a mobile fitness application with a focus on usability and interactive design using MIT App Inventor",
        "Achieved 1st place in a high school competition for innovation, functionality, and implementation"
      ]
    }
  ],

  skills: {
    "Programming": ["Python", "JavaScript", "Java", "C", "HTML5", "CSS", "Bash"],
    "Tools & Frameworks": ["Claude Code", "LangChain", "LlamaIndex (RAG)", "n8n", "Apple Shortcuts", "FastAPI", "Cisco Packet Tracer", "Docker", "Google Colab"],
    "Hardware & IoT": ["Raspberry Pi", "Arduino", "NVIDIA Jetson AGX Orin Developer Kit", "ESP32", "Embedded Systems", "Microcontrollers", "Sensors & Actuators", "IoT Protocols"],
    "Operating Systems": ["Ubuntu OS", "macOS", "Windows", "Raspberry Pi OS"],
    "Other Skills": ["Fast typing", "Microsoft Office (Advanced)", "Video Editing", "Photoshop", "AI Agents", "Odoo"]
  },

  certifications: [
    { name: "Technical Support Fundamentals", issuer: "Coursera" },
    { name: "Claude 101", issuer: "Anthropic" },
    { name: "Claude Code 101", issuer: "Anthropic" },
    { name: "Claude Code in Action", issuer: "Anthropic" },
    { name: "Introduction to Model Context Protocol", issuer: "Anthropic" },
    { name: "AI Fluency: Framework & Foundations", issuer: "Anthropic" },
    { name: "CCNA Introduction to Networks", issuer: "Cisco" },
    { name: "Pricing Fundamentals", issuer: "Dr. Ehab Muslim" },
    { name: "SWOT Analysis", issuer: "Dr. Ehab Muslim" },
    { name: "Effective Sales Skills", issuer: "Dr. Ehab Muslim" },
    { name: "Google Digital Skills Program", issuer: "Google Skills" }
  ]
};

/* Flattens CV_DATA into plain text — this is what gets fed to the
   chatbot as its ONLY source of knowledge about Fekry. */
function buildCVContext() {
  const d = CV_DATA;
  let lines = [];

  lines.push(`Name: ${d.name}`);
  lines.push(`Role: ${d.role}`);
  lines.push(`Location: ${d.location} (${d.bornNote})`);
  lines.push(`Email: ${d.email}`);
  lines.push(`Phone: ${d.phone}`);
  lines.push(`LinkedIn: ${d.linkedin}`);
  lines.push("");
  lines.push(`Summary: ${d.summary}`);
  lines.push("");

  lines.push("EDUCATION");
  d.education.forEach(e => {
    lines.push(`- ${e.degree}, ${e.school}, ${e.location}`);
    e.details.forEach(det => lines.push(`  • ${det}`));
  });
  lines.push("");

  lines.push("WORK EXPERIENCE");
  d.experience.forEach(e => {
    lines.push(`- ${e.role} at ${e.org}`);
    e.bullets.forEach(b => lines.push(`  • ${b}`));
  });
  lines.push("");

  lines.push("PROJECTS");
  d.projects.forEach(p => {
    lines.push(`- ${p.name}`);
    p.bullets.forEach(b => lines.push(`  • ${b}`));
  });
  lines.push("");

  lines.push("SKILLS");
  Object.entries(d.skills).forEach(([category, items]) => {
    lines.push(`- ${category}: ${items.join(", ")}`);
  });
  lines.push("");

  lines.push("CERTIFICATIONS");
  d.certifications.forEach(c => lines.push(`- ${c.name} (${c.issuer})`));

  return lines.join("\n");
}
