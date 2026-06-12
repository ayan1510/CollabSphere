export const initialMockUsers = [
  {
    _id: "u1",
    name: 'Super Admin',
    email: 'admin@test.com',
    role: 'admin',
    department: 'Human Resources',
    skills: ['Policy Administration', 'Talent Management', 'Conflict Resolution', 'HR Analytics'],
    bio: 'HR Manager and Portal Administrator. Reach out for role updates or moderation requests.',
    branch: 'Headquarters',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin',
    points: 120,
    badges: ['Initiate Contributor', 'Knowledge Champion'],
    status: 'active'
  },
  {
    _id: "u2",
    name: 'Ayan Mondal',
    email: 'employee@test.com',
    role: 'employee',
    department: 'Engineering',
    skills: ['React', 'PHP', 'Tailwind CSS', 'AI Integration', 'Node.js'],
    bio: 'Frontend Specialist passionate about building seamless user interfaces and integrating AI models.',
    branch: 'Kolkata Branch',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ayan',
    points: 260,
    badges: ['Initiate Contributor', 'Knowledge Champion', 'Top Mentor', 'Intellectual Guru'],
    status: 'active'
  },
  {
    _id: "u3",
    name: 'Rahul Verma',
    email: 'rahul@test.com',
    role: 'employee',
    department: 'Engineering',
    skills: ['PHP', 'Laravel', 'MySQL', 'MongoDB', 'Docker'],
    bio: 'Backend Tech Lead. Lover of structured code, query optimization, and architectural blueprints.',
    branch: 'Mumbai Branch',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Rahul',
    points: 145,
    badges: ['Initiate Contributor', 'Knowledge Champion', 'Top Mentor'],
    status: 'active'
  },
  {
    _id: "u4",
    name: 'Priya Sharma',
    email: 'priya@test.com',
    role: 'employee',
    department: 'Human Resources',
    skills: ['Onboarding', 'Mentorship', 'Leadership Dev', 'Employee Engagement'],
    bio: 'People Operations Lead. Dedicated to making branch onboarding smooth, continuous, and collaborative.',
    branch: 'Delhi Branch',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Priya',
    points: 65,
    badges: ['Initiate Contributor', 'Knowledge Champion'],
    status: 'active'
  },
  {
    _id: "u5",
    name: 'Jessica Taylor',
    email: 'jessica@test.com',
    role: 'employee',
    department: 'Customer Support',
    skills: ['Customer Relations', 'Escalation Handling', 'CRM Tools', 'Communication'],
    bio: 'Senior Customer Advocate. Specialized in client relationship management and escalations.',
    branch: 'Kolkata Branch',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jessica',
    points: 45,
    badges: ['Initiate Contributor'],
    status: 'active'
  },
  {
    _id: "u6",
    name: 'David Chen',
    email: 'david@test.com',
    role: 'employee',
    department: 'Engineering',
    skills: ['Technical Writing', 'Documentation', 'API Spec', 'Markdown'],
    bio: 'Technical Writer. Believer that clear documentation is the ultimate form of team communication.',
    branch: 'Kolkata Branch',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=David',
    points: 15,
    badges: ['Initiate Contributor'],
    status: 'active'
  },
  {
    _id: "u7",
    name: 'Sarah Jenkins',
    email: 'sarah@test.com',
    role: 'employee',
    department: 'Product Management',
    skills: ['Product Strategy', 'Scrum', 'Wireframing', 'Market Research'],
    bio: 'Product owner for internal tools. Focused on usability and aligning user needs with tech development.',
    branch: 'Delhi Branch',
    profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah',
    points: 8,
    badges: [],
    status: 'active'
  }
];

export const initialMockCommunities = [
  {
    _id: "c1",
    name: 'Tech Pioneers',
    description: 'Sharing latest trends in Javascript, PHP development, CI/CD pipelines, and AI engineering practices.',
    category: 'Engineering',
    createdBy: { _id: "u3", name: 'Rahul Verma' },
    members: ["u2", "u3", "u6"],
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
  },
  {
    _id: "c2",
    name: 'HR & Onboarding Excellence',
    description: 'Discussion board for employee onboarding guides, company policies, and workplace engagement initiatives.',
    category: 'Human Resources',
    createdBy: { _id: "u4", name: 'Priya Sharma' },
    members: ["u1", "u4", "u2"],
    createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString()
  },
  {
    _id: "c3",
    name: 'Customer Success Champions',
    description: 'Hub for sharing customer call templates, dispute management blueprints, and success metrics.',
    category: 'Customer Support',
    createdBy: { _id: "u5", name: 'Jessica Taylor' },
    members: ["u5", "u2", "u4"],
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
  },
  {
    _id: "c4",
    name: 'Product & Design Thinkers',
    description: 'Collaboration space for user research logs, design frameworks, prototyping guidelines, and feedback loops.',
    category: 'Product Management',
    createdBy: { _id: "u7", name: 'Sarah Jenkins' },
    members: ["u7", "u2", "u3"],
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  }
];

export const initialMockPosts = [
  {
    _id: "p1",
    user: {
      _id: "u1",
      name: 'Super Admin',
      profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin',
      department: 'Human Resources',
      branch: 'Headquarters',
      role: 'admin'
    },
    title: '🌟 Welcome to the New Knowledge Sharing Portal!',
    content: 'This ecosystem is designed to help connect expertise, branch out departmental learnings, and reward peers. Feel free to search experts, join community discussion tags, post success stories, and earn contributor badges!',
    category: 'General',
    pinned: true,
    likes: ["u2", "u3", "u4"],
    comments: [
      {
        _id: "co1",
        user: { _id: "u2", name: 'Ayan Mondal', profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ayan' },
        name: 'Ayan Mondal',
        profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ayan',
        content: 'Incredible platform! Ready to share React and PHP recipes.',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        _id: "co2",
        user: { _id: "u4", name: 'Priya Sharma', profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Priya' },
        name: 'Priya Sharma',
        profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Priya',
        content: 'Our onboarding material is now fully integrated into the Communities section!',
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    _id: "p2",
    user: {
      _id: "u2",
      name: 'Ayan Mondal',
      profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ayan',
      department: 'Engineering',
      branch: 'Kolkata Branch',
      role: 'employee'
    },
    title: 'How We Reduced Customer Response Time by 40% with AI Automation',
    content: 'We integrated an LLM semantic router to pre-classify and auto-suggest responses for general client complaints. By caching common solutions in our CRM backend, agents can answer escalation tickets in half the time. Happy to share our technical middleware code with anyone interested!',
    category: 'Success Story',
    community: "c1",
    likes: ["u3", "u5", "u6"],
    comments: [
      {
        _id: "co3",
        user: { _id: "u5", name: 'Jessica Taylor', profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jessica' },
        name: 'Jessica Taylor',
        profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jessica',
        content: 'This made a huge difference for our support agents, Ayan! Thanks for the tool.',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    _id: "p3",
    user: {
      _id: "u3",
      name: 'Rahul Verma',
      profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Rahul',
      department: 'Engineering',
      branch: 'Mumbai Branch',
      role: 'employee'
    },
    title: 'PHP 8.3 Features & Performance Optimization Tips',
    content: 'If you are building services in Core PHP or Laravel, make sure to look at Readonly Classes, Typed Constants, and the new json_validate() function. In our benchmark, upgrading PHP from 8.1 to 8.3 decreased memory allocation overhead by 18% on user session lookups.',
    category: 'Best Practice',
    community: "c1",
    likes: ["u2", "u6"],
    comments: [],
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    _id: "p4",
    user: {
      _id: "u4",
      name: 'Priya Sharma',
      profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Priya',
      department: 'Human Resources',
      branch: 'Delhi Branch',
      role: 'employee'
    },
    title: 'New Branch Onboarding Blueprint (Q3 Refresh)',
    content: 'We have consolidated the branch checklist for office leads. The updated file lists equipment setups, HR system logins, and initial department intro schedules. Let’s ensure every remote recruit is assigned a learning buddy from day one.',
    category: 'Best Practice',
    community: "c2",
    likes: ["u1"],
    comments: [],
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString()
  }
];

export const initialMockQuestions = [
  {
    _id: "q1",
    user: {
      _id: "u5",
      name: 'Jessica Taylor',
      profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jessica',
      department: 'Customer Support',
      branch: 'Kolkata Branch'
    },
    title: 'How do we handle refund escalation when the transaction is over 90 days?',
    content: 'We have a client requesting a ledger reimbursement for a payment made in March. The standard banking gateway rejects direct refund APIs after 90 days. What is the manual escalation protocol to get accounts approval?',
    tags: ['Refunds', 'Escalations', 'Finance-Ops'],
    upvotes: ["u2", "u4"],
    answers: [
      {
        _id: "a1",
        user: {
          _id: "u1",
          name: 'Super Admin',
          profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin',
          department: 'Human Resources',
          branch: 'Headquarters',
          points: 120
        },
        name: 'Super Admin',
        profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin',
        content: 'You need to download the Account Reimbursement Form (available in the Resource Library templates), fill in the gateway transaction ID, and submit it to Finance-Approvals. They will process it as a bank wire within 3 business days.',
        isBestAnswer: true,
        votes: 5,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        _id: "a2",
        user: {
          _id: "u4",
          name: 'Priya Sharma',
          profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Priya',
          department: 'Human Resources',
          branch: 'Delhi Branch',
          points: 65
        },
        name: 'Priya Sharma',
        profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Priya',
        content: 'Make sure to loop the account manager in the email thread to speed up internal approvals.',
        isBestAnswer: false,
        votes: 1,
        createdAt: new Date(Date.now() - 1800000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    _id: "q2",
    user: {
      _id: "u2",
      name: 'Ayan Mondal',
      profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ayan',
      department: 'Engineering',
      branch: 'Kolkata Branch'
    },
    title: 'What is the best way to handle concurrent database writes in MongoDB?',
    content: 'We are experiencing write conflicts when updating user gamification points under high session activity. Should we rely on MongoDB transactions, or utilize atomic increment operations (`$inc`)?',
    tags: ['MongoDB', 'Performance', 'Concurrency'],
    upvotes: ["u3"],
    answers: [
      {
        _id: "a3",
        user: {
          _id: "u3",
          name: 'Rahul Verma',
          profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Rahul',
          department: 'Engineering',
          branch: 'Mumbai Branch',
          points: 145
        },
        name: 'Rahul Verma',
        profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Rahul',
        content: 'For simple numerical adjustments (like points), always use MongoDB atomic operations like `$inc` directly. It avoids transaction locking overhead and handles concurrency natively at the document level. Use transactions only when updating multiple documents simultaneously.',
        isBestAnswer: true,
        votes: 4,
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    _id: "q3",
    user: {
      _id: "u6",
      name: 'David Chen',
      profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=David',
      department: 'Engineering',
      branch: 'Kolkata Branch'
    },
    title: 'Where can I find the official company slide deck and doc templates?',
    content: 'I need to write a proposal for a new client project. Is there a central drive or repository where the official brand presentations and slide templates are stored?',
    tags: ['Templates', 'Branding', 'Resources'],
    upvotes: [],
    answers: [],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

export const initialMockResources = [
  {
    _id: "r1",
    title: 'Corporate Presentation Template (2026 Edition)',
    description: 'Official slide deck including company overview, brand colors, fonts, and slide templates for external proposals.',
    type: 'presentation',
    url: 'https://docs.google.com/presentation/d/1official-company-template-demo/edit',
    uploadedBy: { name: 'Super Admin', department: 'Human Resources', branch: 'Headquarters' },
    downloads: 42,
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
  },
  {
    _id: "r2",
    title: 'Branch Onboarding Guide Checklist (PDF)',
    description: 'Complete step-by-step checklist guide for welcoming new hires, setting up workspace laptops, and organizing introductions.',
    type: 'pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploadedBy: { name: 'Priya Sharma', department: 'Human Resources', branch: 'Delhi Branch' },
    downloads: 18,
    createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString()
  },
  {
    _id: "r3",
    title: 'Financial Escalation & Reimbursement Request Form',
    description: 'Excel spreadsheet template used to escalate transactions older than 90 days to finance accounts department.',
    type: 'template',
    url: 'https://github.com/microsoft/excel-templates-demo/raw/main/template.xlsx',
    uploadedBy: { name: 'Super Admin', department: 'Human Resources', branch: 'Headquarters' },
    downloads: 27,
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
  },
  {
    _id: "r4",
    title: 'Video Guide: Deploying Services with Docker & CI/CD',
    description: 'A 15-minute screen recording tutorial explaining how to configure Dockerfiles and GitHub actions for automated service deployments.',
    type: 'video',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    uploadedBy: { name: 'Rahul Verma', department: 'Engineering', branch: 'Mumbai Branch' },
    downloads: 35,
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  }
];
