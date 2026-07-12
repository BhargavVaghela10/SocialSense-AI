import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search,
  Instagram,
  Facebook,
  Linkedin,
  Sparkles,
  RefreshCw,
  TrendingUp,
  Filter,
  AlertCircle,
  FileText,
  Clock,
  Layers,
  ChevronRight,
  Brain,
  Zap
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5001/api';

// Platform visual configuration
const PLATFORM_CONFIG = {
  Instagram: {
    bg: 'bg-pink-50 dark:bg-pink-950/20',
    border: 'border-pink-200 dark:border-pink-900/30',
    text: 'text-pink-600 dark:text-pink-400',
    icon: Instagram
  },
  Facebook: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400',
    icon: Facebook
  },
  LinkedIn: {
    bg: 'bg-sky-50 dark:bg-sky-950/20',
    border: 'border-sky-200 dark:border-sky-900/30',
    text: 'text-sky-600 dark:text-sky-400',
    icon: Linkedin
  }
};

// All available categories (kept sorted, static list for consistent filter)
const ALL_CATEGORIES = [
  'AI', 'Business', 'Career', 'Cloud Computing', 'Cybersecurity',
  'Data Science', 'Education', 'Festivals', 'Food', 'GenAI',
  'Lifestyle', 'Machine Learning', 'Open Source', 'Photography',
  'Python', 'Software Engineering', 'Sports', 'Travel', 'Web Development'
];

// Suggested search queries demonstrating semantic power
const SUGGESTIONS = [
  { label: 'AI Internships', query: 'Artificial Intelligence Internship' },
  { label: 'Healthy Eats', query: 'Healthy delicious recipes' },
  { label: 'Travel & Wanderlust', query: 'Beautiful vacation destinations' },
  { label: 'Career Growth', query: 'How to prepare for coding interviews' },
  { label: 'DevOps & Cloud', query: 'Docker container cloud deployments' }
];

function App() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [isSearching, setIsSearching] = useState(false);

  // On mount: check backend health, then fetch all posts
  useEffect(() => {
    checkBackendHealth();
    fetchAllPosts();
  }, []);

  const checkBackendHealth = async () => {
    try {
      await axios.get(`${API_BASE_URL}/health`);
      setBackendStatus('online');
    } catch {
      setBackendStatus('offline');
    }
  };

  const fetchAllPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/posts`);
      setPosts(response.data);
      setIsSearching(false);
      setActiveQuery('');
    } catch {
      setError('Failed to load posts. Make sure the backend Flask server is running on port 5001.');
      setBackendStatus('offline');
    } finally {
      setIsLoading(false);
    }
  };

  // Perform semantic search
  const handleSearch = async (e, queryOverride) => {
    if (e) e.preventDefault();
    const query = (queryOverride !== undefined ? queryOverride : searchQuery).trim();

    if (!query) {
      fetchAllPosts();
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsSearching(true);
    setActiveQuery(query);

    try {
      const response = await axios.get(`${API_BASE_URL}/search`, {
        params: { q: query }
      });
      setPosts(response.data.results);
      setBackendStatus('online');
    } catch {
      setError('Error executing semantic search. Please check your backend connection.');
      setBackendStatus('offline');
    } finally {
      setIsLoading(false);
    }
  };

  // Run a suggestion query
  const handleSuggestion = (item) => {
    setSearchQuery(item.query);
    handleSearch(null, item.query);
  };

  // Clear search and go back to all posts
  const handleClear = () => {
    setSearchQuery('');
    fetchAllPosts();
  };

  // Client-side filtering by platform and category
  const filteredPosts = posts.filter((post) => {
    const platformMatch = selectedPlatform === 'All' || post.platform === selectedPlatform;
    const categoryMatch = selectedCategory === 'All' || post.category === selectedCategory;
    return platformMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/20 text-slate-800 dark:text-slate-200 transition-colors duration-300 relative overflow-x-hidden">

      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute top-0 left-1/4 w-96 h-96 bg-indigo-300/20 dark:bg-indigo-900/10 rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 w-96 h-96 bg-purple-300/20 dark:bg-purple-900/10 rounded-full blur-3xl -z-10" />

      {/* ─── Header ─── */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/50 dark:border-slate-800/50 px-6 py-4 flex items-center justify-between shadow-sm">

        {/* Left: Logo & Title */}
        <div className="flex items-center space-x-4">
          <img src="/logo.jpg" alt="SocialSense-AI Logo" className="w-12 h-12 md:w-14 md:h-14 object-contain rounded-2xl shadow-sm bg-white p-1" />
          <div className="flex flex-col justify-center">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent m-0 leading-none">
              SocialSense-AI
            </h1>
            <p className="text-[10px] md:text-[11px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              Semantic Search Engine
            </p>
          </div>
        </div>

        {/* Right: Premium Feature Badges */}
        <div className="hidden lg:flex items-center space-x-3">

          <div className="group flex items-center px-3 py-1.5 rounded-full bg-white/40 hover:bg-white/80 dark:bg-slate-900/40 dark:hover:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300 cursor-default backdrop-blur-md">
            <Search size={13} className="text-indigo-500 mr-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-white bg-clip-text text-transparent">Semantic Search</span>
          </div>

          <div className="group flex items-center px-3 py-1.5 rounded-full bg-white/40 hover:bg-white/80 dark:bg-slate-900/40 dark:hover:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300 cursor-default backdrop-blur-md">
            <Brain size={13} className="text-purple-500 mr-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-white bg-clip-text text-transparent">Sentence Transformers</span>
          </div>

          <div className="group flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-50/80 to-purple-50/80 hover:from-indigo-100 hover:to-purple-100 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm hover:shadow-md transition-all duration-300 cursor-default backdrop-blur-md">
            <Zap size={13} className="text-amber-500 mr-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">AI Powered</span>
          </div>

        </div>

      </header>

      {/* ─── Main ─── */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">

        {/* Hero banner */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 font-display">
            Intelligent Semantic Search
          </h2>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-600 dark:text-slate-400">
            A lightweight NLP-powered search platform. Finds Instagram, Facebook, and LinkedIn posts
            that match the{' '}
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">semantic meaning</span>{' '}
            of your query — not just exact keywords.
          </p>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ─── Left sidebar ─── */}
          <div className="lg:col-span-1 space-y-6">

            {/* Search box */}
            <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Search size={16} className="text-indigo-500" />
                Search Social Posts
              </h3>

              <form onSubmit={handleSearch} className="space-y-3">
                <div className="relative">
                  <input
                    id="search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Machine Learning Jobs..."
                    className="w-full pl-4 pr-14 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  id="search-button"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 text-white font-medium rounded-xl text-sm transition-all shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <RefreshCw className="animate-spin h-4 w-4" />
                  ) : (
                    <>
                      <Search size={15} />
                      <span>Search Post</span>
                    </>
                  )}
                </button>
              </form>

              {isSearching && (
                <button
                  onClick={handleClear}
                  className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium rounded-xl text-xs transition-all"
                >
                  ← Back to All Posts
                </button>
              )}
            </div>

            {/* Semantic demo suggestions */}
            <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-500" />
                Try Semantic Demo
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Click a suggestion to see how the AI finds conceptually related posts without exact keyword matches.
              </p>
              <div className="flex flex-col gap-2 pt-1">
                {SUGGESTIONS.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestion(item)}
                    className="w-full text-left px-3 py-2 bg-slate-50 dark:bg-slate-950 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 border border-slate-200 dark:border-slate-800 rounded-xl text-xs transition-all flex items-center justify-between group"
                  >
                    <span className="truncate">{item.label}</span>
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ─── Right results panel ─── */}
          <div className="lg:col-span-3 space-y-6">

            {/* Filter bar */}
            <div className="bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              {/* Result count / active query indicator */}
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                <Layers size={14} className="text-indigo-500 shrink-0" />
                <span>Showing</span>
                <span className="font-semibold text-slate-900 dark:text-white">{filteredPosts.length} posts</span>
                {activeQuery && (
                  <>
                    <span>matching</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-medium max-w-[180px] truncate">
                      &ldquo;{activeQuery}&rdquo;
                    </span>
                  </>
                )}
              </div>

              {/* Dropdowns */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Filter size={12} className="text-slate-400 shrink-0" />
                  <span className="text-slate-500">Platform:</span>
                  <select
                    id="platform-filter"
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                  >
                    <option value="All">All Platforms</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="LinkedIn">LinkedIn</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Category:</span>
                  <select
                    id="category-filter"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 max-w-[130px] text-slate-800 dark:text-slate-200"
                  >
                    <option value="All">All Categories</option>
                    {ALL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-2xl flex items-start gap-3 text-rose-800 dark:text-rose-400">
                <AlertCircle className="shrink-0 mt-0.5" size={18} />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Loading spinner */}
            {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center gap-4">
                <div className="relative h-12 w-12">
                  <div className="h-12 w-12 rounded-full border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 animate-spin" />
                  <Sparkles size={14} className="text-purple-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Computing semantic similarity…
                </p>
              </div>

            ) : filteredPosts.length === 0 ? (

              /* Empty state */
              <div className="flex flex-col items-center justify-center text-center py-24 bg-white dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl px-8 gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500">
                  <Search size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">No matching posts found</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    {isSearching
                      ? 'Try a broader query or reset to browse all posts.'
                      : 'Adjust the category or platform filter to find posts.'}
                  </p>
                </div>
                {(isSearching || selectedPlatform !== 'All' || selectedCategory !== 'All') && (
                  <button
                    onClick={() => {
                      setSelectedPlatform('All');
                      setSelectedCategory('All');
                      if (isSearching) handleClear();
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                  >
                    Reset Filters
                  </button>
                )}
              </div>

            ) : (

              /* Posts grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredPosts.map((post) => {
                  const platConfig = PLATFORM_CONFIG[post.platform];
                  const PlatformIcon = platConfig?.icon ?? null;

                  return (
                    <article
                      key={post.id}
                      className="bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group"
                    >
                      {/* Card header: author + platform badge */}
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-3">

                          {/* Avatar + name + date */}
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={post.profileImage}
                              alt={post.author}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 shrink-0"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=6366f1&color=fff&size=150`;
                              }}
                            />
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                {post.author}
                              </h4>
                              <div className="text-[10px] text-slate-400 flex items-center gap-1 font-medium mt-0.5">
                                <Clock size={10} />
                                <span>{post.date}</span>
                              </div>
                            </div>
                          </div>

                          {/* Platform badge */}
                          {platConfig && (
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${platConfig.bg} ${platConfig.text} border ${platConfig.border}`}>
                              {PlatformIcon && <PlatformIcon size={10} />}
                              {post.platform}
                            </span>
                          )}
                        </div>

                        {/* Caption */}
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {post.caption}
                        </p>
                      </div>

                      {/* Card footer: category */}
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                          <FileText size={11} />
                          <span>
                            Category:{' '}
                            <span className="text-indigo-500 dark:text-indigo-400 font-semibold">
                              {post.category}
                            </span>
                          </span>
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer className="mt-20 py-8 border-t border-slate-200/50 dark:border-slate-800/50 glass-panel text-center text-xs text-slate-400 dark:text-slate-500">
        <p className="font-semibold text-slate-500 dark:text-slate-400">SocialSense-AI</p>
        <p className="mt-1">Semantic Search powered by Sentence Transformers</p>
      </footer>

    </div>
  );
}

export default App;
