import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Post from './models/Post.js';
import Question from './models/Question.js';
import Community from './models/Community.js';
import Resource from './models/Resource.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/knowledge_sharing');
    console.log('Connected to database for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Post.deleteMany();
    await Question.deleteMany();
    await Community.deleteMany();
    await Resource.deleteMany();

    console.log('Cleaned database.');

    // 1. Seed Users (passwords will be hashed via Mongoose pre-save hook)
    const users = await User.create([
      {
        name: 'Super Admin',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin',
        department: 'Human Resources',
        skills: ['Policy Administration', 'Talent Management', 'Conflict Resolution', 'HR Analytics'],
        bio: 'HR Manager and Portal Administrator. Reach out for role updates or moderation requests.',
        branch: 'Headquarters',
        profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin',
        points: 120,
        badges: ['Initiate Contributor', 'Knowledge Champion'],
      },
      {
        name: 'Ayan Mondal',
        email: 'employee@test.com', // Primary demo account
        password: 'password123',
        role: 'employee',
        department: 'Engineering',
        skills: ['React', 'PHP', 'Tailwind CSS', 'AI Integration', 'Node.js'],
        bio: 'Frontend Specialist passionate about building seamless user interfaces and integrating AI models.',
        branch: 'Kolkata Branch',
        profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ayan',
        points: 260,
        badges: ['Initiate Contributor', 'Knowledge Champion', 'Top Mentor', 'Intellectual Guru'],
      },
      {
        name: 'Rahul Verma',
        email: 'rahul@test.com',
        password: 'password123',
        role: 'employee',
        department: 'Engineering',
        skills: ['PHP', 'Laravel', 'MySQL', 'MongoDB', 'Docker'],
        bio: 'Backend Tech Lead. Lover of structured code, query optimization, and architectural blueprints.',
        branch: 'Mumbai Branch',
        profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Rahul',
        points: 145,
        badges: ['Initiate Contributor', 'Knowledge Champion', 'Top Mentor'],
      },
      {
        name: 'Priya Sharma',
        email: 'priya@test.com',
        password: 'password123',
        role: 'employee',
        department: 'Human Resources',
        skills: ['Onboarding', 'Mentorship', 'Leadership Dev', 'Employee Engagement'],
        bio: 'People Operations Lead. Dedicated to making branch onboarding smooth, continuous, and collaborative.',
        branch: 'Delhi Branch',
        profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Priya',
        points: 65,
        badges: ['Initiate Contributor', 'Knowledge Champion'],
      },
      {
        name: 'Jessica Taylor',
        email: 'jessica@test.com',
        password: 'password123',
        role: 'employee',
        department: 'Customer Support',
        skills: ['Customer Relations', 'Escalation Handling', 'CRM Tools', 'Communication'],
        bio: 'Senior Customer Advocate. Specialized in client relationship management and escalations.',
        branch: 'Kolkata Branch',
        profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jessica',
        points: 45,
        badges: ['Initiate Contributor'],
      },
      {
        name: 'David Chen',
        email: 'david@test.com',
        password: 'password123',
        role: 'employee',
        department: 'Engineering',
        skills: ['Technical Writing', 'Documentation', 'API Spec', 'Markdown'],
        bio: 'Technical Writer. Believer that clear documentation is the ultimate form of team communication.',
        branch: 'Kolkata Branch',
        profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=David',
        points: 15,
        badges: ['Initiate Contributor'],
      },
      {
        name: 'Sarah Jenkins',
        email: 'sarah@test.com',
        password: 'password123',
        role: 'employee',
        department: 'Product Management',
        skills: ['Product Strategy', 'Scrum', 'Wireframing', 'Market Research'],
        bio: 'Product owner for internal tools. Focused on usability and aligning user needs with tech development.',
        branch: 'Delhi Branch',
        profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah',
        points: 8,
        badges: [],
      },
      {
        name: 'Sanjita Das',
        email: 'sanjita@test.com',
        password: 'password123',
        role: 'employee',
        department: 'Human Resources',
        skills: ['Talent Acquisition', 'Employee Relations', 'Performance Management', 'HR Compliance'],
        bio: 'HR Specialist. Dedicated to fostering a positive workplace culture and connecting great talent with our engineering teams.',
        branch: 'Kolkata Branch',
        profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sanjita',
        points: 210,
        badges: ['Initiate Contributor', 'Knowledge Champion'],
      },
    ]);

    const adminUser = users[0];
    const ayan = users[1];
    const rahul = users[2];
    const priya = users[3];
    const jessica = users[4];
    const david = users[5];
    const sarah = users[6];
    const sanjita = users[7];

    console.log('Seeded Users.');

    // 2. Seed Communities
    const communities = await Community.create([
      {
        name: 'Tech Pioneers',
        description: 'Sharing latest trends in Javascript, PHP development, CI/CD pipelines, and AI engineering practices.',
        category: 'Engineering',
        createdBy: rahul._id,
        members: [ayan._id, rahul._id, david._id],
      },
      {
        name: 'HR & Onboarding Excellence',
        description: 'Discussion board for employee onboarding guides, company policies, and workplace engagement initiatives.',
        category: 'Human Resources',
        createdBy: priya._id,
        members: [adminUser._id, priya._id, ayan._id, sanjita._id],
      },
      {
        name: 'Customer Success Champions',
        description: 'Hub for sharing customer call templates, dispute management blueprints, and success metrics.',
        category: 'Customer Support',
        createdBy: jessica._id,
        members: [jessica._id, ayan._id, priya._id],
      },
      {
        name: 'Product & Design Thinkers',
        description: 'Collaboration space for user research logs, design frameworks, prototyping guidelines, and feedback loops.',
        category: 'Product Management',
        createdBy: users[6]._id,
        members: [users[6]._id, ayan._id, rahul._id],
      },
    ]);

    const techCommunity = communities[0];
    const hrCommunity = communities[1];
    const csCommunity = communities[2];

    console.log('Seeded Communities.');

    // 3. Seed Posts
    const posts = await Post.create([
      {
        user: adminUser._id,
        title: '🌟 Welcome to the New Knowledge Sharing Portal!',
        content: 'This ecosystem is designed to help connect expertise, branch out departmental learnings, and reward peers. Feel free to search experts, join community discussion tags, post success stories, and earn contributor badges!',
        category: 'General',
        pinned: true,
        likes: [ayan._id, rahul._id, priya._id],
        comments: [
          {
            user: ayan._id,
            name: 'Ayan Mondal',
            profileImage: ayan.profileImage,
            content: 'Incredible platform! Ready to share React and PHP recipes.',
          },
          {
            user: priya._id,
            name: 'Priya Sharma',
            profileImage: priya.profileImage,
            content: 'Our onboarding material is now fully integrated into the Communities section!',
          },
        ],
      },
      {
        user: ayan._id,
        title: 'How We Reduced Customer Response Time by 40% with AI Automation',
        content: 'We integrated an LLM semantic router to pre-classify and auto-suggest responses for general client complaints. By caching common solutions in our CRM backend, agents can answer escalation tickets in half the time. Happy to share our technical middleware code with anyone interested!',
        category: 'Success Story',
        community: techCommunity._id,
        likes: [rahul._id, jessica._id, david._id],
        comments: [
          {
            user: jessica._id,
            name: 'Jessica Taylor',
            profileImage: jessica.profileImage,
            content: 'This made a huge difference for our support agents, Ayan! Thanks for the tool.',
          },
        ],
      },
      {
        user: rahul._id,
        title: 'PHP 8.3 Features & Performance Optimization Tips',
        content: 'If you are building services in Core PHP or Laravel, make sure to look at Readonly Classes, Typed Constants, and the new json_validate() function. In our benchmark, upgrading PHP from 8.1 to 8.3 decreased memory allocation overhead by 18% on user session lookups.',
        category: 'Best Practice',
        community: techCommunity._id,
        likes: [ayan._id, david._id],
      },
      {
        user: priya._id,
        title: 'New Branch Onboarding Blueprint (Q3 Refresh)',
        content: 'We have consolidated the branch checklist for office leads. The updated file lists equipment setups, HR system logins, and initial department intro schedules. Let’s ensure every remote recruit is assigned a learning buddy from day one.',
        category: 'Best Practice',
        community: hrCommunity._id,
        likes: [adminUser._id],
      },
      {
        user: jessica._id,
        title: 'How to Handle Refund Escalations for Major Clients',
        content: 'Lessons learned from recent transaction disputes: always confirm bank verification logs before initiating API credits. When client communication is critical, utilize the pre-approved email templates in our knowledge repository.',
        category: 'Lesson Learned',
        community: csCommunity._id,
        likes: [ayan._id],
      },
      {
        user: david._id,
        title: 'Importance of Writing Clean API Specifications First',
        content: 'Before writing any backend code in Node.js or PHP, define the JSON contracts in OpenAPI/Swagger format first. This lets frontend teams mock APIs immediately and prevents 80% of integration-day conflicts.',
        category: 'Lesson Learned',
        likes: [rahul._id, ayan._id],
      },
      {
        user: sanjita._id,
        title: 'Workplace Wellness Initiatives for Q3',
        content: 'We are launching new employee wellness programs this quarter, including weekly mindfulness sessions, mental health workshops, and ergonomic workspace reviews. Check out the wellness resources available in our library or reach out if you would like to be a wellness champion for your branch!',
        category: 'General',
        community: hrCommunity._id,
        likes: [ayan._id, priya._id],
        comments: [
          {
            user: ayan._id,
            name: 'Ayan Mondal',
            profileImage: ayan.profileImage,
            content: 'This is a great initiative! The mindfulness sessions will be very helpful.',
          }
        ]
      },
    ]);

    console.log('Seeded Posts.');

    // 4. Seed Questions
    const questions = await Question.create([
      {
        user: jessica._id,
        title: 'How do we handle refund escalation when the transaction is over 90 days?',
        content: 'We have a client requesting a ledger reimbursement for a payment made in March. The standard banking gateway rejects direct refund APIs after 90 days. What is the manual escalation protocol to get accounts approval?',
        tags: ['Refunds', 'Escalations', 'Finance-Ops'],
        upvotes: [ayan._id, priya._id],
        answers: [
          {
            user: adminUser._id,
            name: 'Super Admin',
            profileImage: adminUser.profileImage,
            content: 'You need to download the Account Reimbursement Form (available in the Resource Library templates), fill in the gateway transaction ID, and submit it to Finance-Approvals. They will process it as a bank wire within 3 business days.',
            isBestAnswer: true,
            votes: 5,
            createdAt: new Date(Date.now() - 3600000 * 2),
          },
          {
            user: priya._id,
            name: 'Priya Sharma',
            profileImage: priya.profileImage,
            content: 'Make sure to loop the account manager in the email thread to speed up internal approvals.',
            isBestAnswer: false,
            votes: 1,
            createdAt: new Date(Date.now() - 1800000),
          },
        ],
      },
      {
        user: ayan._id,
        title: 'What is the best way to handle concurrent database writes in MongoDB?',
        content: 'We are experiencing write conflicts when updating user gamification points under high session activity. Should we rely on MongoDB transactions, or utilize atomic increment operations (`$inc`)?',
        tags: ['MongoDB', 'Performance', 'Concurrency'],
        upvotes: [rahul._id],
        answers: [
          {
            user: rahul._id,
            name: 'Rahul Verma',
            profileImage: rahul.profileImage,
            content: 'For simple numerical adjustments (like points), always use MongoDB atomic operations like `$inc` directly. It avoids transaction locking overhead and handles concurrency natively at the document level. Use transactions only when updating multiple documents simultaneously.',
            isBestAnswer: true,
            votes: 4,
            createdAt: new Date(Date.now() - 3600000 * 4),
          },
        ],
      },
      {
        user: rahul._id,
        title: 'How do I authenticate external webhooks in a PHP backend securely?',
        content: 'We are setting up Stripe payment webhook events. How do we verify that incoming API requests are legitimately from Stripe and not spoofed by malicious clients?',
        tags: ['PHP', 'Security', 'Webhooks'],
        upvotes: [ayan._id, david._id],
        answers: [
          {
            user: ayan._id,
            name: 'Ayan Mondal',
            profileImage: ayan.profileImage,
            content: 'You should verify the request header signature. Stripe sends a signature header (`Stripe-Signature`). In your PHP backend, read the raw request payload (`file_get_contents("php://input")`) and compute the HMAC-SHA256 signature with your shared webhook secret, then compare it. Better yet, use the Stripe SDK: `\Stripe\Webhook::constructEvent($payload, $sigHeader, $webhookSecret)`.',
            isBestAnswer: true,
            votes: 6,
            createdAt: new Date(Date.now() - 3600000 * 10),
          },
        ],
      },
      {
        user: david._id,
        title: 'Where can I find the official company slide deck and doc templates?',
        content: 'I need to write a proposal for a new client project. Is there a central drive or repository where the official brand presentations and slide templates are stored?',
        tags: ['Templates', 'Branding', 'Resources'],
        upvotes: [sanjita._id],
        answers: [
          {
            user: sanjita._id,
            name: 'Sanjita Das',
            profileImage: sanjita.profileImage,
            content: 'Hi David! You can find all approved corporate presentations and brand templates directly under the Resources tab. I have also uploaded the latest employee handbook there as a reference.',
            isBestAnswer: true,
            votes: 5,
            createdAt: new Date(Date.now() - 3600000),
          }
        ],
      },
    ]);

    console.log('Seeded Questions.');

    // 5. Seed Resources
    await Resource.create([
      {
        title: 'Corporate Presentation Template (2026 Edition)',
        description: 'Official slide deck including company overview, brand colors, fonts, and slide templates for external proposals.',
        type: 'presentation',
        url: 'https://docs.google.com/presentation/d/1official-company-template-demo/edit',
        uploadedBy: adminUser._id,
        downloads: 42,
      },
      {
        title: 'Branch Onboarding Guide Checklist (PDF)',
        description: 'Complete step-by-step checklist guide for welcoming new hires, setting up workspace laptops, and organizing introductions.',
        type: 'pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedBy: priya._id,
        downloads: 18,
      },
      {
        title: 'Financial Escalation & Reimbursement Request Form',
        description: 'Excel spreadsheet template used to escalate transactions older than 90 days to finance accounts department.',
        type: 'template',
        url: 'https://github.com/microsoft/excel-templates-demo/raw/main/template.xlsx',
        uploadedBy: adminUser._id,
        downloads: 27,
      },
      {
        title: 'Video Guide: Deploying Services with Docker & CI/CD',
        description: 'A 15-minute screen recording tutorial explaining how to configure Dockerfiles and GitHub actions for automated service deployments.',
        type: 'video',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        uploadedBy: rahul._id,
        downloads: 35,
      },
      {
        title: 'API Specification Style Guidelines',
        description: 'Standard guidelines for writing clean REST API specifications, URI formats, error codes, and pagination practices.',
        type: 'pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedBy: david._id,
        downloads: 9,
      },
      {
        title: 'Employee Handbook & Code of Conduct (2026)',
        description: 'Comprehensive guide to company policies, remote work guidelines, communication standards, and employee benefits.',
        type: 'pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedBy: sanjita._id,
        downloads: 54,
      },
    ]);

    console.log('Seeded Resources.');
    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
