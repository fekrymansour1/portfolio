/* ============================================================
   data.js
   Public CV data used by the portfolio assistant.
   No API keys or secrets belong in this file.
   ============================================================ */

const CV_DATA = Object.freeze({
  name: "Fekry Nabil Mohamed Mansour",
  displayName: "Fekry Mansour",
  location: "Doha, Qatar",
  bornIn: "Doha",
  email: "fekry.n.mansour@gmail.com",
  phone: "+974 5536 3197",
  linkedin: "https://www.linkedin.com/in/fekrymansour1/",
  github: "https://github.com/fekrymansour1",

  education: [
    {
      institution: "Qatar University",
      country: "Qatar",
      degree: "Bachelor of Science in Computer Engineering",
      years: "2022–2026",
      gpa: "3.6 / 4.0",
      deanList: "2023–2025",
      secondaryDistinction: "Graduated with Highest Academic Distinction in Qatar Secondary Education with a score of 99.75% in 2022"
    }
  ],

  experience: [
    {
      organization: "Primary Health Care Corporation (PHCC)",
      location: "Al Sadd, Qatar",
      title: "ICT Intern, ICT Department",
      years: "2026",
      details: [
        "Rotated across five ICT sections: Network, Systems, Cybersecurity, Database, and Applications.",
        "Assisted with network troubleshooting, system administration, user accounts, and hardware/software support.",
        "Gained exposure to cybersecurity practices, access control, database management, and enterprise applications."
      ]
    },
    {
      organization: "Qatar University",
      location: "Doha, Qatar",
      title: "Instructor Assistant",
      years: "2023–2026",
      details: [
        "Provide academic and technical support to undergraduate students in Python and Java programming courses, assisting in labs and practical sessions.",
        "Collaborate with faculty to deliver course materials, supervise hands-on activities, and improve student engagement.",
        "Contributed 200+ working hours to instructional support, mentoring, and academic project assistance."
      ]
    },
    {
      organization: "Qatar University",
      location: "Doha, Qatar",
      title: "Special Needs Support Assistant",
      details: [
        "Provided 250+ hours of academic support, attending classes to take and organize notes, transcribe lectures, and assist with course materials.",
        "Used AI tools, shortcuts, and automation to accelerate notetaking, organize information, and simplify access to academic resources.",
        "Created structured academic documents and materials while providing clear, patient communication and individualized support to students."
      ]
    },
    {
      organization: "CamelCodeQA",
      location: "Education City, Qatar",
      title: "Assistant Trainer",
      years: "2024–2026",
      details: [
        "Delivered technology training programs for children covering AI, robotics, and game development fundamentals.",
        "Mentored 20+ students through hands-on programming projects, strengthening problem-solving and computational thinking skills.",
        "Supported seasonal bootcamps and summer camps while collaborating with instructors to enhance lesson plans and classroom activities."
      ]
    }
  ],

  projects: [
    {
      title: "AI Companion for Dementia Patients (Senior Project)",
      details: [
        "Building an offline bilingual (Arabic/English) AI voice companion on NVIDIA Jetson AGX Orin that talks with dementia patients about their family photos.",
        "Architected a real-time speech pipeline integrating speech-to-text, local LLMs, and text-to-speech, streaming replies sentence by sentence for natural, low-latency conversations.",
        "Optimized inference for all three models using GGUF quantization and CUDA acceleration, achieving 13x faster speech generation on edge hardware.",
        "Developed photo understanding with vision-language and face recognition models, and implemented AI guardrails grounding answers in family data to reduce hallucinations."
      ]
    },
    {
      title: "AI-Powered Developer Portfolio",
      details: [
        "Engineered and deployed a production-ready AI portfolio platform on GitHub Pages, integrating Fanar API, Qatar's large language model (LLM), an agent-based CV assistant, serverless infrastructure, and visitor analytics.",
        "Architected a secure, serverless AI backend using Cloudflare Workers, implementing AI guardrails and response validation to protect API credentials, restrict outputs to trusted CV data, mitigate hallucinations, and improve response reliability.",
        "Built visitor and traffic-source analytics to measure user engagement and identify how visitors discover the platform."
      ]
    },
    {
      title: "AI Workflow Automation Systems",
      details: [
        "Developed AI-driven automation systems for workflow orchestration using Python, n8n, and cross-platform integrations, enabling programmatic account management and Excel-based process automation.",
        "Built AI-powered chatbots using LangChain and RAG with Supabase for data storage and vector search, enabling intelligent retrieval of company-specific knowledge and automated internal support."
      ]
    },
    {
      title: "Student & Shipment Management Systems",
      details: [
        "Developed Python- and Java-based management systems for handling student records, courses, grades, shipment records, shipping methods, and payment processing.",
        "Implemented persistent data storage, validation, and error handling to maintain data integrity and reliable system operations.",
        "Developed reporting modules to generate actionable insights and support data-driven decision-making."
      ]
    },
    {
      title: "Fitness Mobile Application (MIT App Inventor)",
      details: [
        "Built a mobile fitness application with a focus on usability and interactive design using MIT App Inventor.",
        "Achieved 1st place in a high school competition for innovation, functionality, and implementation."
      ]
    }
  ],

  skills: {
    programming: ["Python", "JavaScript", "Java", "C", "HTML5", "CSS", "Bash", "Assembly"],
    toolsAndFrameworks: ["Claude Code", "LangChain", "LangGraph", "LlamaIndex (RAG)", "n8n", "Apple Shortcuts", "FastAPI", "REST APIs", "MCP (Model Context Protocol)", "Docker", "Google Colab", "Cisco Packet Tracer", "Git", "GitHub", "Cloudflare", "Fanar API", "Hugging Face", "Ollama", "vLLM", "llama.cpp", "Speech-to-Text (Whisper, Cohere Transcribe)", "Model Quantization (GGUF)", "AI Agents"],
    hardwareAndIoT: ["Raspberry Pi", "Arduino", "NVIDIA Jetson AGX Orin Developer Kit", "ESP32", "Embedded Systems", "Microcontrollers", "Sensors & Actuators", "IoT Protocols"],
    operatingSystems: ["Ubuntu OS", "macOS", "Windows", "Raspberry Pi OS"],
    other: ["Fast Typing", "Microsoft Office (Advanced)", "Video Editing", "Photoshop", "Odoo"]
  },

  cvDownload: "The full CV (PDF) can be downloaded with the Download CV button at the top of the portfolio.",

  certifications: [
    "Foundation: Introduction to Deep Agents — LangChain (Oct 2026)",
    "Oracle AI — Oracle, Meeza Academy (Sep 2026)",
    "Claude Code in Action — Anthropic (Aug 2026)",
    "Introduction to Model Context Protocol — Anthropic (Aug 2026)",
    "Claude Code 101 — Anthropic (Aug 2026)",
    "AI Fluency: Framework & Foundations — Anthropic (Aug 2026)",
    "Claude 101 — Anthropic (Aug 2026)",
    "CCNA: Introduction to Networks — Cisco (Dec 2024)",
    "Effective Sales Skills — Dr. Ehab Muslim (Apr 2021)",
    "Technical Support Fundamentals — Coursera (Sep 2020)",
    "SWOT Analysis — Dr. Ehab Muslim (Sep 2020)",
    "Pricing Fundamentals — Dr. Ehab Muslim (Jul 2020)",
    "Google Digital Skills Program — Google Skills (May 2020)"
  ]
});

function buildCVContext() {
  const lines = [
    `Name: ${CV_DATA.name}`,
    `Location: ${CV_DATA.location}`,
    `Born in: ${CV_DATA.bornIn}`,
    `Email: ${CV_DATA.email}`,
    `Phone: ${CV_DATA.phone}`,
    `LinkedIn: ${CV_DATA.linkedin}`,
    `GitHub: ${CV_DATA.github}`,
    `CV: ${CV_DATA.cvDownload}`,
    "",
    "EDUCATION"
  ];

  for (const item of CV_DATA.education) {
    lines.push(`- ${item.institution}, ${item.country}`);
    lines.push(`- ${item.degree} (${item.years})`);
    lines.push(`- Grade: ${item.gpa} GPA`);
    lines.push(`- Dean’s List: ${item.deanList}`);
    lines.push(`- ${item.secondaryDistinction}`);
  }

  lines.push("", "WORK EXPERIENCE");
  for (const item of CV_DATA.experience) {
    const years = item.years ? ` (${item.years})` : "";
    lines.push(`${item.organization}, ${item.location} — ${item.title}${years}`);
    item.details.forEach((detail) => lines.push(`- ${detail}`));
    lines.push("");
  }

  lines.push("PROJECTS");
  for (const project of CV_DATA.projects) {
    lines.push(project.title);
    project.details.forEach((detail) => lines.push(`- ${detail}`));
    lines.push("");
  }

  lines.push("SKILLS");
  lines.push(`- Programming: ${CV_DATA.skills.programming.join(", ")}`);
  lines.push(`- Tools & Frameworks: ${CV_DATA.skills.toolsAndFrameworks.join(", ")}`);
  lines.push(`- Hardware & IoT: ${CV_DATA.skills.hardwareAndIoT.join(", ")}`);
  lines.push(`- Operating Systems: ${CV_DATA.skills.operatingSystems.join(", ")}`);
  lines.push(`- Other Skills: ${CV_DATA.skills.other.join(", ")}`);

  lines.push("", "LICENSES & CERTIFICATIONS");
  CV_DATA.certifications.forEach((item) => lines.push(`- ${item}`));

  return lines.join("\n");
}

const CV_CONTEXT = buildCVContext();
