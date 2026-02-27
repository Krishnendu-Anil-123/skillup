import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  Link, 
  useNavigate 
} from 'react-router-dom';
import { supabase } from './lib/supabase';
import { 
  User as UserIcon, 
  Search, 
  PlusCircle, 
  MessageSquare, 
  Trophy, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Shield,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { User, Offer, Discussion, HelpRequest, ENGINEERING_SKILLS, DEPARTMENTS } from './types';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Navbar = ({ user, onLogout }: { user: User | null, onLogout: () => void }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white">S</div>
          SKILLUP
        </Link>
        {user ? (
          <div className="flex items-center gap-6">
            <Link to="/profile" className="flex items-center gap-2 hover:text-zinc-600 transition-colors">
              <UserIcon size={18} />
              <span className="font-medium hidden sm:inline">{user.username}</span>
            </Link>
            <button onClick={onLogout} className="text-zinc-500 hover:text-red-600 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="brutal-btn py-2 px-4 text-sm">LOGIN</Link>
        )}
      </div>
    </nav>
  );
};

const AuthPage = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    department: DEPARTMENTS[0]
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        // Login - query users table for matching username and password
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', formData.username)
          .eq('password', formData.password)
          .single();

        if (error) {
          setError('Invalid Credentials');
        } else {
          localStorage.setItem('user', JSON.stringify(data));
          onLogin(data);
          navigate('/');
        }
      } else {
        // Register - insert new user
        const { data, error } = await supabase
          .from('users')
          .insert([{
            username: formData.username,
            email: formData.email,
            password: formData.password,
            department: formData.department
          }])
          .select()
          .single();

        if (error) {
          setError(error.message);
        } else {
          alert('Registered Successfully');
          setIsLogin(true);
          setFormData({ username: '', password: '', email: '', department: DEPARTMENTS[0] });
        }
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-4 pt-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md brutal-card p-8"
      >
        <h2 className="text-3xl font-black mb-6 tracking-tight">
          {isLogin ? 'WELCOME BACK' : 'JOIN SKILLUP'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Username</label>
            <input 
              type="text" 
              required
              className="w-full p-3 border-2 border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
            />
          </div>
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">College Email</label>
                <input 
                  type="email" 
                  required
                  className="w-full p-3 border-2 border-zinc-900 focus:outline-none"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Department</label>
                <select 
                  className="w-full p-3 border-2 border-zinc-900 focus:outline-none"
                  value={formData.department}
                  onChange={e => setFormData({...formData, department: e.target.value})}
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </>
          )}
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full p-3 border-2 border-zinc-900 focus:outline-none"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          {error && <p className="text-red-600 text-sm font-bold">{error}</p>}
          <button type="submit" className="w-full brutal-btn mt-4">
            {isLogin ? 'LOGIN' : 'REGISTER'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 font-bold underline"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Link to="/offer" className="group">
          <div className="brutal-card p-10 h-full bg-emerald-50 hover:bg-emerald-100 transition-colors flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mb-6">
                <PlusCircle size={32} />
              </div>
              <h2 className="text-4xl font-black mb-4">I OFFER</h2>
              <p className="text-zinc-600 text-lg">Share your expertise and earn credits. Help your peers grow while building your mentor profile.</p>
            </div>
            <div className="mt-8 flex items-center gap-2 font-bold group-hover:translate-x-2 transition-transform">
              START SHARING <ArrowRight size={20} />
            </div>
          </div>
        </Link>

        <Link to="/explore" className="group">
          <div className="brutal-card p-10 h-full bg-indigo-50 hover:bg-indigo-100 transition-colors flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center text-white mb-6">
                <Search size={32} />
              </div>
              <h2 className="text-4xl font-black mb-4">I EXPLORE</h2>
              <p className="text-zinc-600 text-lg">Discover new skills, book sessions with top mentors, and level up your engineering game.</p>
            </div>
            <div className="mt-8 flex items-center gap-2 font-bold group-hover:translate-x-2 transition-transform">
              START LEARNING <ArrowRight size={20} />
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <Shield size={24} />, label: 'Anonymous Doubts', path: '/discussions', color: 'bg-orange-100' },
          { icon: <Trophy size={24} />, label: 'Inter-Dept Quiz', path: '/quiz', color: 'bg-yellow-100' },
          { icon: <Zap size={24} />, label: 'Project Help', path: '/help', color: 'bg-purple-100' },
          { icon: <UserIcon size={24} />, label: 'My Profile', path: '/profile', color: 'bg-blue-100' },
        ].map((item, i) => (
          <Link key={i} to={item.path}>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={cn("brutal-card p-6 flex flex-col items-center text-center gap-3", item.color)}
            >
              <div className="p-3 bg-white rounded-xl border-2 border-zinc-900">
                {item.icon}
              </div>
              <span className="font-bold text-sm uppercase tracking-tight">{item.label}</span>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const OfferPage = ({ user }: { user: User }) => {
  const [formData, setFormData] = useState({
    skill_name: '',
    category: ENGINEERING_SKILLS[0],
    credits: 5,
    description: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('offers')
      .insert([{ ...formData, user_id: user.id }]);
    if (!error) {
      navigate('/explore');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-32 pb-20">
      <div className="brutal-card p-8 bg-white">
        <h2 className="text-3xl font-black mb-8">CREATE AN OFFER</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Skill Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g. React.js Basics"
                className="w-full p-3 border-2 border-zinc-900 focus:outline-none"
                value={formData.skill_name}
                onChange={e => setFormData({...formData, skill_name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Category</label>
              <select 
                className="w-full p-3 border-2 border-zinc-900 focus:outline-none"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {ENGINEERING_SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Required Credits</label>
            <input 
              type="number" 
              min="1"
              max="50"
              required
              className="w-full p-3 border-2 border-zinc-900 focus:outline-none"
              value={formData.credits}
              onChange={e => setFormData({...formData, credits: parseInt(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Description</label>
            <textarea 
              rows={4}
              required
              placeholder="What will you teach? What are the prerequisites?"
              className="w-full p-3 border-2 border-zinc-900 focus:outline-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full brutal-btn">POST OFFER</button>
        </form>
      </div>
    </div>
  );
};

const ExplorePage = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchOffers = async () => {
      const { data } = await supabase
        .from('offers')
        .select('*, users(username)');
      if (data) setOffers(data);
    };
    fetchOffers();
  }, []);

  const filteredOffers = filter === 'All' ? offers : offers.filter(o => o.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <h2 className="text-4xl font-black">EXPLORE SKILLS</h2>
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          <button 
            onClick={() => setFilter('All')}
            className={cn("px-4 py-2 font-bold border-2 border-zinc-900 whitespace-nowrap", filter === 'All' ? "bg-zinc-900 text-white" : "bg-white")}
          >
            ALL
          </button>
          {ENGINEERING_SKILLS.map(s => (
            <button 
              key={s}
              onClick={() => setFilter(s)}
              className={cn("px-4 py-2 font-bold border-2 border-zinc-900 whitespace-nowrap", filter === s ? "bg-zinc-900 text-white" : "bg-white")}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredOffers.map(offer => (
          <motion.div 
            layout
            key={offer.id} 
            className="brutal-card p-6 bg-white flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black uppercase px-2 py-1 bg-zinc-100 border border-zinc-900">
                  {offer.category}
                </span>
                <span className="font-black text-emerald-600">{offer.credits} CR</span>
              </div>
              <h3 className="text-xl font-black mb-2">{offer.skill_name}</h3>
              <p className="text-zinc-600 text-sm mb-4 line-clamp-3">{offer.description}</p>
            </div>
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-200 border border-zinc-900 flex items-center justify-center font-black text-xs">
                  {offer.username[0].toUpperCase()}
                </div>
                <span className="text-xs font-bold">{offer.username}</span>
              </div>
              <button className="text-xs font-black underline hover:no-underline">BOOK SESSION</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const DiscussionPage = () => {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: "user" as const, content: input };
    setMessages([...messages, userMessage]);
    
    // Save to Supabase
    await supabase
      .from('discussions')
      .insert([{ content: input }]);
    
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-900 text-white pt-16">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-xl p-3 rounded-xl ${
              msg.role === "user"
                ? "bg-green-600 ml-auto"
                : "bg-neutral-800"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-neutral-700">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            className="flex-1 p-3 rounded-lg bg-neutral-800 text-white placeholder-neutral-400 focus:outline-none"
            placeholder="Type message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit"
            className="brutal-btn py-3 px-6"
          >
            SEND
          </button>
        </form>
      </div>
    </div>
  );
};

const ProfilePage = ({ user, onUpdate }: { user: User, onUpdate: (u: User) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    personal_email: user.personal_email || '',
    skills: user.skills || '',
    projects: user.projects || ''
  });

  const growthData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 1200 },
  ];

  const mentorData = [
    { name: 'Jan', value: 100 },
    { name: 'Feb', value: 250 },
    { name: 'Mar', value: 200 },
    { name: 'Apr', value: 450 },
    { name: 'May', value: 700 },
  ];

  const handleSave = async () => {
    const { error } = await supabase
      .from('users')
      .update(formData)
      .eq('id', user.id);
    if (!error) {
      onUpdate({ ...user, ...formData });
      setIsEditing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="brutal-card p-8 bg-white text-center">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-zinc-100 border-4 border-zinc-900 flex items-center justify-center">
              <UserIcon size={64} />
            </div>
            <h2 className="text-3xl font-black mb-1">{user.username}</h2>
            <p className="text-zinc-500 font-bold uppercase text-xs mb-6">{user.department}</p>
            <div className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase">Registered Email</label>
                <p className="font-bold text-sm">{user.email}</p>
              </div>
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase">Personal Email</label>
                {isEditing ? (
                  <input 
                    className="w-full p-2 border-2 border-zinc-900 text-sm"
                    value={formData.personal_email}
                    onChange={e => setFormData({...formData, personal_email: e.target.value})}
                  />
                ) : (
                  <p className="font-bold text-sm">{user.personal_email || 'Not set'}</p>
                )}
              </div>
            </div>
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="w-full brutal-btn mt-8"
            >
              {isEditing ? 'SAVE PROFILE' : 'EDIT PROFILE'}
            </button>
          </div>

          <div className="brutal-card p-6 bg-zinc-900 text-white">
            <h3 className="font-black mb-4 flex items-center gap-2">
              <Zap size={18} className="text-yellow-400" /> SKILL WALLET
            </h3>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs font-bold text-zinc-400">Available Credits</p>
                <p className="text-4xl font-black">1240</p>
              </div>
              <button className="text-xs font-black underline">REDEEM</button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="brutal-card p-6 bg-white">
              <h3 className="font-black mb-6 uppercase text-sm">Growth Curve</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#18181b" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="brutal-card p-6 bg-white">
              <h3 className="font-black mb-6 uppercase text-sm">Mentor Curve</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mentorData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="brutal-card p-8 bg-white">
            <h3 className="text-2xl font-black mb-6">SKILLS & PROJECTS</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase mb-2">My Skills</label>
                {isEditing ? (
                  <textarea 
                    className="w-full p-4 border-2 border-zinc-900 focus:outline-none"
                    rows={3}
                    value={formData.skills}
                    onChange={e => setFormData({...formData, skills: e.target.value})}
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(user.skills || 'Add your skills...').split(',').map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-zinc-100 border border-zinc-900 font-bold text-xs uppercase">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-2">Projects / Internships</label>
                {isEditing ? (
                  <textarea 
                    className="w-full p-4 border-2 border-zinc-900 focus:outline-none"
                    rows={4}
                    value={formData.projects}
                    onChange={e => setFormData({...formData, projects: e.target.value})}
                  />
                ) : (
                  <p className="text-zinc-600 whitespace-pre-line">{user.projects || 'No projects listed yet.'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuizPage = () => (
  <div className="max-w-7xl mx-auto px-4 pt-32 pb-20 text-center">
    <div className="brutal-card p-20 bg-yellow-50">
      <Trophy size={64} className="mx-auto mb-6 text-yellow-600" />
      <h2 className="text-5xl font-black mb-4">INTER-DEPT COMPETITION</h2>
      <p className="text-xl text-zinc-600 mb-8 max-w-2xl mx-auto">
        Compete with other departments in technical quizzes and debates. 
        Win massive credits and bragging rights for your department.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="brutal-card p-8 bg-white">
          <h3 className="text-2xl font-black mb-4">LIVE QUIZ</h3>
          <p className="text-zinc-500 mb-6">Next Event: Friday, 4:00 PM</p>
          <button className="brutal-btn w-full">REGISTER NOW</button>
        </div>
        <div className="brutal-card p-8 bg-white">
          <h3 className="text-2xl font-black mb-4">DEBATE BATTLE</h3>
          <p className="text-zinc-500 mb-6">Next Event: Saturday, 2:00 PM</p>
          <button className="brutal-btn w-full">JOIN QUEUE</button>
        </div>
      </div>
    </div>
  </div>
);

const HelpPage = ({ user }: { user: User }) => {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', type: 'Hackathon', description: '' });

  const fetchHelp = async () => {
    const { data } = await supabase
      .from('help_requests')
      .select('*');
    if (data) setRequests(data);
  };
  useEffect(fetchHelp, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('help_requests')
      .insert([{ ...formData, user_id: user.id }]);
    if (!error) {
      setShowForm(false);
      fetchHelp();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-4xl font-black">PROJECT & HACKATHON HELP</h2>
        <button onClick={() => setShowForm(true)} className="brutal-btn">REQUEST HELP</button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm"
          >
            <div className="brutal-card p-8 bg-white w-full max-w-xl">
              <h3 className="text-2xl font-black mb-6">REQUEST HELP</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Title</label>
                  <input 
                    className="w-full p-3 border-2 border-zinc-900" 
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Type</label>
                  <select 
                    className="w-full p-3 border-2 border-zinc-900"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option>Hackathon</option>
                    <option>Mini Project</option>
                    <option>Final Year Project</option>
                    <option>Internship Help</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Description</label>
                  <textarea 
                    className="w-full p-3 border-2 border-zinc-900" 
                    rows={4}
                    required
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 p-3 font-bold border-2 border-zinc-900">CANCEL</button>
                  <button type="submit" className="flex-1 brutal-btn">SUBMIT</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requests.map(req => (
          <div key={req.id} className="brutal-card p-6 bg-white">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black uppercase px-2 py-1 bg-purple-100 border border-zinc-900">
                {req.type}
              </span>
              <span className="text-xs font-bold text-zinc-400">BY {req.username}</span>
            </div>
            <h3 className="text-xl font-black mb-2">{req.title}</h3>
            <p className="text-zinc-600 text-sm mb-6">{req.description}</p>
            <button className="w-full brutal-btn py-2 text-sm">OFFER HELP</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('skillup_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('skillup_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('skillup_user');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('skillup_user', JSON.stringify(updatedUser));
  };

  return (
    <Router>
      <div className="min-h-screen">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <AuthPage onLogin={handleLogin} />} />
          <Route path="/offer" element={user ? <OfferPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/explore" element={user ? <ExplorePage /> : <Navigate to="/login" />} />
          <Route path="/discussions" element={user ? <DiscussionPage /> : <Navigate to="/login" />} />
          <Route path="/quiz" element={user ? <QuizPage /> : <Navigate to="/login" />} />
          <Route path="/help" element={user ? <HelpPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <ProfilePage user={user} onUpdate={handleUpdateUser} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}
