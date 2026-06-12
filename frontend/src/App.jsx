import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import LoginView from './components/LoginView';
import FeedView from './components/FeedView';
import DiscoveryView from './components/DiscoveryView';
import QAView from './components/QAView';
import CommunitiesView from './components/CommunitiesView';
import LibraryView from './components/LibraryView';
import LeaderboardView from './components/LeaderboardView';
import AdminView from './components/AdminView';
import ProfileView from './components/ProfileView';

import {
  initialMockUsers,
  initialMockCommunities,
  initialMockPosts,
  initialMockQuestions,
  initialMockResources
} from './mockData';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://collabsphere-2-bs1e.onrender.com/api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('collab_token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('collab_user')) || null);
  const [view, setView] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // App lists
  const [posts, setPosts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [resources, setResources] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Selections
  const [activeCommunityFilter, setActiveCommunityFilter] = useState(null);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [expertPosts, setExpertPosts] = useState([]);
  
  // Admin listings
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminMetrics, setAdminMetrics] = useState(null);

  // Connection status
  const [apiOnline, setApiOnline] = useState(true);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize client side fallback database
  const initLocalDB = () => {
    if (!localStorage.getItem('collab_users')) {
      localStorage.setItem('collab_users', JSON.stringify(initialMockUsers));
    }
    if (!localStorage.getItem('collab_posts')) {
      localStorage.setItem('collab_posts', JSON.stringify(initialMockPosts));
    }
    if (!localStorage.getItem('collab_questions')) {
      localStorage.setItem('collab_questions', JSON.stringify(initialMockQuestions));
    }
    if (!localStorage.getItem('collab_communities')) {
      localStorage.setItem('collab_communities', JSON.stringify(initialMockCommunities));
    }
    if (!localStorage.getItem('collab_resources')) {
      localStorage.setItem('collab_resources', JSON.stringify(initialMockResources));
    }
  };

  useEffect(() => {
    initLocalDB();
    checkHealthAndLoad();
  }, [token]);

  const checkHealthAndLoad = async () => {
    try {
      const res = await fetch(`${API_BASE.replace('/api', '')}/health`);
      if (res.ok) {
        setApiOnline(true);
        if (token) {
          loadServerData();
        }
      } else {
        throw new Error('Server returned error');
      }
    } catch (err) {
      console.warn("Backend server offline. Switching to interactive client-side Demo Mode.");
      setApiOnline(false);
      loadLocalData();
    }
  };

  // ==========================================
  // SERVER DATA FETCHING
  // ==========================================
  const loadServerData = async () => {
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      // 1. Fetch current profile to check suspension
      const meRes = await fetch(`${API_BASE}/auth/me`, { headers });
      if (meRes.status === 401 || meRes.status === 403) {
        handleLogout();
        return;
      }
      const meData = await meRes.json();
      setUser(meData);
      localStorage.setItem('collab_user', JSON.stringify(meData));

      // 2. Load lists
      const [postsRes, qRes, cRes, rRes, uRes] = await Promise.all([
        fetch(`${API_BASE}/posts`, { headers }),
        fetch(`${API_BASE}/questions`, { headers }),
        fetch(`${API_BASE}/communities`, { headers }),
        fetch(`${API_BASE}/resources`, { headers }),
        fetch(`${API_BASE}/users`, { headers })
      ]);

      setPosts(await postsRes.json());
      setQuestions(await qRes.json());
      setCommunities(await cRes.json());
      setResources(await rRes.json());
      setUsers(await uRes.json());

      // 3. Load admin specific data if user is admin
      if (meData.role === 'admin') {
        const [metricsRes, adminUsersRes] = await Promise.all([
          fetch(`${API_BASE}/admin/metrics`, { headers }),
          fetch(`${API_BASE}/admin/users`, { headers })
        ]);
        setAdminMetrics(await metricsRes.json());
        setAdminUsers(await adminUsersRes.json());
      }
    } catch (err) {
      console.error("Failed to load live data, falling back to Local Storage DB:", err);
      setApiOnline(false);
      loadLocalData();
    }
  };

  // ==========================================
  // LOCAL MOCK DATA FETCHING (OFFLINE DEMO MODE)
  // ==========================================
  const loadLocalData = () => {
    const localUsers = JSON.parse(localStorage.getItem('collab_users'));
    const localPosts = JSON.parse(localStorage.getItem('collab_posts'));
    const localQuestions = JSON.parse(localStorage.getItem('collab_questions'));
    const localCommunities = JSON.parse(localStorage.getItem('collab_communities'));
    const localResources = JSON.parse(localStorage.getItem('collab_resources'));

    // Populate post user objects for offline display
    const postsPopulated = localPosts.map(post => ({
      ...post,
      user: localUsers.find(u => u._id === (post.user?._id || post.user))
    }));

    // Populate question user objects
    const questionsPopulated = localQuestions.map(q => ({
      ...q,
      user: localUsers.find(u => u._id === (q.user?._id || q.user)),
      answers: q.answers?.map(a => ({
        ...a,
        user: localUsers.find(u => u._id === (a.user?._id || a.user))
      }))
    }));

    setPosts(postsPopulated);
    setQuestions(questionsPopulated);
    setCommunities(localCommunities);
    setResources(localResources);
    setUsers(localUsers);

    if (user) {
      const refreshedUser = localUsers.find(u => u._id === user._id) || user;
      setUser(refreshedUser);
      
      // Compute Admin Metrics Locally
      if (refreshedUser.role === 'admin') {
        setAdminUsers(localUsers);
        
        // Department breakdown
        const depts = {};
        localUsers.forEach(u => depts[u.department] = (depts[u.department] || 0) + 1);
        const departmentBreakdown = Object.keys(depts).map(k => ({ _id: k, count: depts[k] }));

        // Branch breakdown
        const branches = {};
        localUsers.forEach(u => branches[u.branch] = (branches[u.branch] || 0) + 1);
        const branchBreakdown = Object.keys(branches).map(k => ({ _id: k, count: branches[k] }));

        // Top skills
        const skillsCount = {};
        localUsers.forEach(u => u.skills?.forEach(s => skillsCount[s] = (skillsCount[s] || 0) + 1));
        const topSkills = Object.keys(skillsCount).map(k => ({ _id: k, count: skillsCount[k] })).sort((a,b) => b.count - a.count).slice(0, 6);

        setAdminMetrics({
          totals: {
            employees: localUsers.length,
            posts: localPosts.length,
            questions: localQuestions.length,
            communities: localCommunities.length
          },
          departmentBreakdown,
          branchBreakdown,
          topSkills,
          topContributors: [...localUsers].sort((a,b) => b.points - a.points).slice(0, 5)
        });
      }
    }
  };

  // ==========================================
  // AUTH OPERATIONS
  // ==========================================
  const handleLogin = async (email, password) => {
    setIsLoading(true);
    setAuthError('');

    if (!apiOnline) {
      // Offline Authentication
      const localUsers = JSON.parse(localStorage.getItem('collab_users'));
      const foundUser = localUsers.find(u => u.email === email);
      if (foundUser && password === 'password123') { // Simple default password for quick demo
        if (foundUser.status === 'suspended') {
          setAuthError('Your account has been suspended by an administrator.');
          setIsLoading(false);
          return;
        }
        setToken('mock-jwt-token-key');
        setUser(foundUser);
        localStorage.setItem('collab_token', 'mock-jwt-token-key');
        localStorage.setItem('collab_user', JSON.stringify(foundUser));
        setIsLoading(false);
      } else {
        setAuthError('Invalid email or password (use password123 for demo)');
        setIsLoading(false);
      }
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setToken(data.token);
      setUser(data);
      localStorage.setItem('collab_token', data.token);
      localStorage.setItem('collab_user', JSON.stringify(data));
    } catch (err) {
      setAuthError(err.message || 'Connection Refused');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (formData) => {
    setIsLoading(true);
    setAuthError('');

    if (!apiOnline) {
      // Offline Registration
      const localUsers = JSON.parse(localStorage.getItem('collab_users'));
      const emailExists = localUsers.find(u => u.email === formData.email);
      if (emailExists) {
        setAuthError('User already exists with this email');
        setIsLoading(false);
        return;
      }

      const newUser = {
        _id: 'u_' + Date.now(),
        ...formData,
        points: 10, // Register bonus
        badges: ['Initiate Contributor'],
        status: 'active',
        role: 'employee',
        profileImage: formData.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(formData.name)}`
      };

      const updatedUsers = [newUser, ...localUsers];
      localStorage.setItem('collab_users', JSON.stringify(updatedUsers));
      
      setToken('mock-jwt-token-key');
      setUser(newUser);
      localStorage.setItem('collab_token', 'mock-jwt-token-key');
      localStorage.setItem('collab_user', JSON.stringify(newUser));
      setIsLoading(false);
      loadLocalData();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setToken(data.token);
      setUser(data);
      localStorage.setItem('collab_token', data.token);
      localStorage.setItem('collab_user', JSON.stringify(data));
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('collab_token');
    localStorage.removeItem('collab_user');
    setView('feed');
  };

  // ==========================================
  // PROFILE UPDATES
  // ==========================================
  const handleUpdateProfile = async (formData) => {
    if (!apiOnline) {
      // Local profile update
      const localUsers = JSON.parse(localStorage.getItem('collab_users'));
      const updatedUsers = localUsers.map(u => {
        if (u._id === user._id) {
          return { ...u, ...formData };
        }
        return u;
      });
      localStorage.setItem('collab_users', JSON.stringify(updatedUsers));
      loadLocalData();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        loadServerData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // KNOWLEDGE POST ACTIONS
  // ==========================================
  const handleSubmitPost = async (postData) => {
    if (!apiOnline) {
      // Local Post Creation
      const localPosts = JSON.parse(localStorage.getItem('collab_posts'));
      const newPost = {
        _id: 'p_' + Date.now(),
        ...postData,
        user: { _id: user._id, name: user.name, profileImage: user.profileImage, department: user.department, branch: user.branch },
        likes: [],
        comments: [],
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('collab_posts', JSON.stringify([newPost, ...localPosts]));
      
      // Award 10 points locally
      awardPointsLocally(user._id, 10);
      loadLocalData();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      });
      if (res.ok) {
        loadServerData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLikePost = async (postId) => {
    if (!apiOnline) {
      const localPosts = JSON.parse(localStorage.getItem('collab_posts'));
      const updated = localPosts.map(p => {
        if (p._id === postId) {
          const likes = p.likes || [];
          const idx = likes.indexOf(user._id);
          if (idx > -1) {
            likes.splice(idx, 1);
          } else {
            likes.push(user._id);
          }
          return { ...p, likes };
        }
        return p;
      });
      localStorage.setItem('collab_posts', JSON.stringify(updated));
      loadLocalData();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadServerData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!apiOnline) {
      const localPosts = JSON.parse(localStorage.getItem('collab_posts'));
      const filtered = localPosts.filter(p => p._id !== postId);
      localStorage.setItem('collab_posts', JSON.stringify(filtered));
      loadLocalData();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadServerData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitComment = async (postId, content) => {
    if (!apiOnline) {
      const localPosts = JSON.parse(localStorage.getItem('collab_posts'));
      const updated = localPosts.map(p => {
        if (p._id === postId) {
          const comments = p.comments || [];
          const newComment = {
            _id: 'co_' + Date.now(),
            user: { _id: user._id, name: user.name, profileImage: user.profileImage },
            name: user.name,
            profileImage: user.profileImage,
            content,
            createdAt: new Date().toISOString()
          };
          return { ...p, comments: [...comments, newComment] };
        }
        return p;
      });
      localStorage.setItem('collab_posts', JSON.stringify(updated));
      awardPointsLocally(user._id, 2);
      loadLocalData();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });
      if (res.ok) {
        loadServerData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!apiOnline) {
      const localPosts = JSON.parse(localStorage.getItem('collab_posts'));
      const updated = localPosts.map(p => {
        if (p._id === postId) {
          return { ...p, comments: p.comments.filter(c => c._id !== commentId) };
        }
        return p;
      });
      localStorage.setItem('collab_posts', JSON.stringify(updated));
      loadLocalData();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadServerData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // Q&A OPERATIONS
  // ==========================================
  const handleSubmitQuestion = async (qData) => {
    if (!apiOnline) {
      const localQuestions = JSON.parse(localStorage.getItem('collab_questions'));
      const newQ = {
        _id: 'q_' + Date.now(),
        ...qData,
        user: { _id: user._id, name: user.name, profileImage: user.profileImage, department: user.department, branch: user.branch },
        upvotes: [],
        answers: [],
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('collab_questions', JSON.stringify([newQ, ...localQuestions]));
      awardPointsLocally(user._id, 5);
      loadLocalData();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(qData)
      });
      if (res.ok) {
        loadServerData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpvoteQuestion = async (qId) => {
    if (!apiOnline) {
      const localQuestions = JSON.parse(localStorage.getItem('collab_questions'));
      const updated = localQuestions.map(q => {
        if (q._id === qId) {
          const upvotes = q.upvotes || [];
          const idx = upvotes.indexOf(user._id);
          if (idx > -1) {
            upvotes.splice(idx, 1);
          } else {
            upvotes.push(user._id);
          }
          return { ...q, upvotes };
        }
        return q;
      });
      localStorage.setItem('collab_questions', JSON.stringify(updated));
      loadLocalData();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/questions/${qId}/upvote`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadServerData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitAnswer = async (qId, content) => {
    if (!apiOnline) {
      const localQuestions = JSON.parse(localStorage.getItem('collab_questions'));
      const updated = localQuestions.map(q => {
        if (q._id === qId) {
          const answers = q.answers || [];
          const newAns = {
            _id: 'a_' + Date.now(),
            user: { _id: user._id, name: user.name, profileImage: user.profileImage, department: user.department, branch: user.branch, points: user.points },
            name: user.name,
            profileImage: user.profileImage,
            content,
            isBestAnswer: false,
            votes: 0,
            createdAt: new Date().toISOString()
          };
          return { ...q, answers: [...answers, newAns] };
        }
        return q;
      });
      localStorage.setItem('collab_questions', JSON.stringify(updated));
      awardPointsLocally(user._id, 5);
      loadLocalData();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/questions/${qId}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });
      if (res.ok) {
        loadServerData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectBestAnswer = async (qId, answerId) => {
    if (!apiOnline) {
      const localQuestions = JSON.parse(localStorage.getItem('collab_questions'));
      let answerUserToReward = null;
      let isNowBest = false;

      const updated = localQuestions.map(q => {
        if (q._id === qId) {
          const answers = q.answers.map(ans => {
            if (ans._id === answerId) {
              ans.isBestAnswer = !ans.isBestAnswer;
              isNowBest = ans.isBestAnswer;
              answerUserToReward = ans.user?._id || ans.user;
            } else {
              ans.isBestAnswer = false;
            }
            return ans;
          });
          return { ...q, answers };
        }
        return q;
      });
      localStorage.setItem('collab_questions', JSON.stringify(updated));
      
      if (answerUserToReward && isNowBest) {
        awardPointsLocally(answerUserToReward, 20);
      }
      loadLocalData();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/questions/${qId}/answers/${answerId}/best`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadServerData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteQuestion = async (qId) => {
    if (!apiOnline) {
      const localQ = JSON.parse(localStorage.getItem('collab_questions'));
      localStorage.setItem('collab_questions', JSON.stringify(localQ.filter(q => q._id !== qId)));
      loadLocalData();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/questions/${qId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadServerData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // COMMUNITIES & RESOURCE OPERATIONS
  // ==========================================
  const handleCreateCommunity = async (cData) => {
    if (!apiOnline) {
      const localC = JSON.parse(localStorage.getItem('collab_communities'));
      const newC = {
        _id: 'c_' + Date.now(),
        ...cData,
        createdBy: { _id: user._id, name: user.name },
        members: [user._id],
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('collab_communities', JSON.stringify([newC, ...localC]));
      loadLocalData();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/communities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cData)
      });
      if (res.ok) {
        loadServerData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinCommunity = async (cId) => {
    if (!apiOnline) {
      const localC = JSON.parse(localStorage.getItem('collab_communities'));
      const updated = localC.map(c => {
        if (c._id === cId) {
          const members = c.members || [];
          const idx = members.indexOf(user._id);
          if (idx > -1) {
            members.splice(idx, 1);
          } else {
            members.push(user._id);
          }
          return { ...c, members };
        }
        return c;
      });
      localStorage.setItem('collab_communities', JSON.stringify(updated));
      loadLocalData();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/communities/${cId}/join`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadServerData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitResource = async (rData) => {
    if (!apiOnline) {
      const localR = JSON.parse(localStorage.getItem('collab_resources'));
      const newR = {
        _id: 'r_' + Date.now(),
        ...rData,
        uploadedBy: { name: user.name, department: user.department, branch: user.branch },
        downloads: 0,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('collab_resources', JSON.stringify([newR, ...localR]));
      awardPointsLocally(user._id, 5);
      loadLocalData();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(rData)
      });
      if (res.ok) {
        loadServerData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadResource = async (resId) => {
    if (!apiOnline) {
      const localR = JSON.parse(localStorage.getItem('collab_resources'));
      const updated = localR.map(r => {
        if (r._id === resId) {
          return { ...r, downloads: (r.downloads || 0) + 1 };
        }
        return r;
      });
      localStorage.setItem('collab_resources', JSON.stringify(updated));
      loadLocalData();
      return;
    }

    try {
      await fetch(`${API_BASE}/resources/${resId}/download`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      loadServerData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteResource = async (resId) => {
    if (!apiOnline) {
      const localR = JSON.parse(localStorage.getItem('collab_resources'));
      localStorage.setItem('collab_resources', JSON.stringify(localR.filter(r => r._id !== resId)));
      loadLocalData();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/resources/${resId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadServerData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // ADMIN BOARD COMMANDS
  // ==========================================
  const handleToggleStatus = async (targetUserId) => {
    if (!apiOnline) {
      const localUsers = JSON.parse(localStorage.getItem('collab_users'));
      const updated = localUsers.map(u => {
        if (u._id === targetUserId) {
          return { ...u, status: u.status === 'active' ? 'suspended' : 'active' };
        }
        return u;
      });
      localStorage.setItem('collab_users', JSON.stringify(updated));
      loadLocalData();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/users/${targetUserId}/status`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadServerData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleRole = async (targetUserId) => {
    if (!apiOnline) {
      const localUsers = JSON.parse(localStorage.getItem('collab_users'));
      const updated = localUsers.map(u => {
        if (u._id === targetUserId) {
          return { ...u, role: u.role === 'admin' ? 'employee' : 'admin' };
        }
        return u;
      });
      localStorage.setItem('collab_users', JSON.stringify(updated));
      loadLocalData();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/users/${targetUserId}/role`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadServerData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePinPost = async (postId) => {
    if (!apiOnline) {
      const localPosts = JSON.parse(localStorage.getItem('collab_posts'));
      const updated = localPosts.map(p => {
        if (p._id === postId) {
          return { ...p, pinned: !p.pinned };
        }
        return p;
      });
      localStorage.setItem('collab_posts', JSON.stringify(updated));
      loadLocalData();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/pin`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadServerData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // HELPERS
  // ==========================================
  const awardPointsLocally = (targetUserId, amount) => {
    const localUsers = JSON.parse(localStorage.getItem('collab_users'));
    const updated = localUsers.map(u => {
      if (u._id === targetUserId) {
        const points = (u.points || 0) + amount;
        
        // Threshold check for badges
        const badges = u.badges || [];
        if (points >= 10 && !badges.includes('Initiate Contributor')) badges.push('Initiate Contributor');
        if (points >= 50 && !badges.includes('Knowledge Champion')) badges.push('Knowledge Champion');
        if (points >= 120 && !badges.includes('Top Mentor')) badges.push('Top Mentor');
        if (points >= 250 && !badges.includes('Intellectual Guru')) badges.push('Intellectual Guru');

        return { ...u, points, badges };
      }
      return u;
    });
    localStorage.setItem('collab_users', JSON.stringify(updated));
  };

  const handleSelectExpert = (expertId) => {
    const selected = users.find(u => u._id === expertId);
    setSelectedExpert(selected);
    const relatedPosts = posts.filter(p => (p.user?._id || p.user) === expertId);
    setExpertPosts(relatedPosts);
  };

  const handleExploreCommunityFeed = (communityId) => {
    setActiveCommunityFilter(communityId);
    setView('feed');
  };

  // ==========================================
  // VIEW ROUTER RENDERER
  // ==========================================
  const renderView = () => {
    switch (view) {
      case 'feed':
        return (
          <FeedView
            posts={posts}
            communities={communities}
            currentUser={user}
            onSubmitPost={handleSubmitPost}
            onLikePost={handleLikePost}
            onDeletePost={handleDeletePost}
            onSubmitComment={handleSubmitComment}
            onDeleteComment={handleDeleteComment}
            activeCommunityFilter={activeCommunityFilter}
            setActiveCommunityFilter={setActiveCommunityFilter}
            searchQuery={searchQuery}
          />
        );
      case 'discovery':
        return (
          <DiscoveryView
            users={users}
            currentUser={user}
            onSelectExpert={handleSelectExpert}
            selectedExpert={selectedExpert}
            expertPosts={expertPosts}
            onCloseModal={() => setSelectedExpert(null)}
          />
        );
      case 'qa':
        return (
          <QAView
            questions={questions}
            currentUser={user}
            onSubmitQuestion={handleSubmitQuestion}
            onUpvoteQuestion={handleUpvoteQuestion}
            onSubmitAnswer={handleSubmitAnswer}
            onSelectBestAnswer={handleSelectBestAnswer}
            onDeleteQuestion={handleDeleteQuestion}
            searchQuery={searchQuery}
          />
        );
      case 'communities':
        return (
          <CommunitiesView
            communities={communities}
            currentUser={user}
            onCreateCommunity={handleCreateCommunity}
            onJoinCommunity={handleJoinCommunity}
            onExploreCommunityFeed={handleExploreCommunityFeed}
          />
        );
      case 'library':
        return (
          <LibraryView
            resources={resources}
            currentUser={user}
            onSubmitResource={handleSubmitResource}
            onDownloadResource={handleDownloadResource}
            onDeleteResource={handleDeleteResource}
            searchQuery={searchQuery}
          />
        );
      case 'leaderboard':
        return (
          <LeaderboardView
            users={users}
            currentUser={user}
          />
        );
      case 'profile':
        return (
          <ProfileView
            user={user}
            onUpdateProfile={handleUpdateProfile}
            error={null}
          />
        );
      case 'admin':
        return (
          <AdminView
            metrics={adminMetrics}
            adminUsers={adminUsers}
            posts={posts}
            onToggleStatus={handleToggleStatus}
            onToggleRole={handleToggleRole}
            onDeletePost={handleDeletePost}
            onPinPost={handlePinPost}
            currentUser={user}
          />
        );
      default:
        return <div className="text-center py-12">Tab under development.</div>;
    }
  };

  if (!token || !user) {
    return (
      <LoginView
        onLogin={handleLogin}
        onRegister={handleRegister}
        error={authError}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex font-sans overflow-x-hidden">
      {/* Mobile Sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - fixed on lg, drawer on mobile */}
      <Sidebar
        user={user}
        activeView={view}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onViewChange={(v) => {
          setView(v);
          setSearchQuery('');
          // Clear sub-modal selections
          setSelectedExpert(null);
        }}
        onLogout={handleLogout}
      />

      {/* Main Container - scrolled */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar
          activeView={view}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          apiOnline={apiOnline}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Dynamic Inner Workspace Content */}
        <main className="p-4 md:p-6 lg:p-8 flex-1 overflow-y-auto max-w-7xl mx-auto w-full lg:w-[calc(100%-16rem)] lg:ml-64">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
