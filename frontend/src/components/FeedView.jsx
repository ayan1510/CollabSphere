import React, { useState } from 'react';
import * as Icons from 'lucide-react';

export default function FeedView({
  posts,
  communities,
  currentUser,
  onSubmitPost,
  onLikePost,
  onDeletePost,
  onSubmitComment,
  onDeleteComment,
  activeCommunityFilter,
  setActiveCommunityFilter,
  searchQuery
}) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [community, setCommunity] = useState('');
  const [linksString, setLinksString] = useState('');
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState(null);
  const [commentContent, setCommentContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const links = linksString
      .split(',')
      .map(l => l.trim())
      .filter(l => l.length > 0 && (l.startsWith('http://') || l.startsWith('https://')));

    onSubmitPost({ title, content, category, community: community || null, links });
    
    // Reset Form
    setTitle('');
    setContent('');
    setCategory('General');
    setCommunity('');
    setLinksString('');
    setShowCreateForm(false);
  };

  const handleCommentSubmit = (e, postId) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    onSubmitComment(postId, commentContent);
    setCommentContent('');
  };

  const toggleComments = (postId) => {
    if (expandedCommentsPostId === postId) {
      setExpandedCommentsPostId(null);
    } else {
      setExpandedCommentsPostId(postId);
    }
  };

  // Filter posts based on category selection, active community click, or navigation search query
  const filteredPosts = posts.filter(post => {
    // 1. Community filter
    if (activeCommunityFilter) {
      if (post.community !== activeCommunityFilter) return false;
    }
    // 2. Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(query);
      const matchContent = post.content.toLowerCase().includes(query);
      const matchAuthor = post.user?.name.toLowerCase().includes(query);
      const matchCategory = post.category.toLowerCase().includes(query);
      if (!matchTitle && !matchContent && !matchAuthor && !matchCategory) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Active Community Filter Header */}
      {activeCommunityFilter && (
        <div className="p-4 bg-slate-900 border border-brand-500/20 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-600/10 rounded-lg text-brand-400">
              <Icons.Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-3xs text-slate-400 font-bold uppercase tracking-wider">Filtered by interest circle</span>
              <h3 className="text-sm font-bold text-white">
                {communities.find(c => c._id === activeCommunityFilter)?.name || 'Interest Group Feed'}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setActiveCommunityFilter(null)}
            className="flex items-center space-x-1 px-3 py-1 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-xs text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <Icons.X className="w-3.5 h-3.5" />
            <span>Show General Feed</span>
          </button>
        </div>
      )}

      {/* Share Knowledge Widget */}
      <div className="glass-card p-4 md:p-5 relative overflow-hidden">
        {!showCreateForm ? (
          <div className="flex items-center space-x-4">
            <img
              src={currentUser.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(currentUser.name)}`}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800"
            />
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex-1 bg-slate-950/50 hover:bg-slate-900 border border-slate-800/80 rounded-xl px-4 py-2.5 text-left text-xs text-slate-500 hover:text-slate-400 font-medium transition-all"
            >
              Share an experience, playbook, or success story...
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800/60">
              <span className="text-sm font-bold text-white flex items-center space-x-2">
                <Icons.PenTool className="w-4 h-4 text-brand-400" />
                <span>Share Knowledge</span>
              </span>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="text-slate-500 hover:text-slate-300"
              >
                <Icons.X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-slate-400 text-3xs font-bold uppercase tracking-wider mb-1">Post Title</label>
              <input
                type="text"
                required
                placeholder="e.g., How we solved core memory leaks in our backend daemon"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-3xs font-bold uppercase tracking-wider mb-1">Description / Content</label>
              <textarea
                required
                rows="4"
                placeholder="Detail your experience, steps, results, and what others can learn..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-brand-500 transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-3xs font-bold uppercase tracking-wider mb-1">Category Type</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-500"
                >
                  <option value="General">General Category</option>
                  <option value="Best Practice">Best Practice</option>
                  <option value="Lesson Learned">Lesson Learned</option>
                  <option value="Success Story">Success Story</option>
                  <option value="Customer Insight">Customer Insight</option>
                  <option value="Industry Knowledge">Industry Knowledge</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-3xs font-bold uppercase tracking-wider mb-1">Post Inside Interest Circle (Optional)</label>
                <select
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-500"
                >
                  <option value="">None (Publish to General Feed)</option>
                  {communities.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-3xs font-bold uppercase tracking-wider mb-1">Reference Links (comma separated HTTP/HTTPS URLs)</label>
              <input
                type="text"
                placeholder="e.g., https://github.com/my-repo, https://medium.com/clean-code"
                value={linksString}
                onChange={(e) => setLinksString(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            <div className="flex justify-end space-x-2.5 pt-2 border-t border-slate-800/40">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 text-xs text-slate-400 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg shadow flex items-center space-x-1.5 transition-colors"
              >
                <Icons.Send className="w-3.5 h-3.5" />
                <span>Publish (+10 pts)</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Feed Stream */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
            <Icons.Layers className="w-10 h-10 text-slate-600" />
            <h3 className="text-sm font-bold text-slate-400">No knowledge posts found</h3>
            <p className="text-xs text-slate-500 max-w-sm">No knowledge has been published under these filters yet. Be the first to publish a playbook!</p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const hasLiked = post.likes?.includes(currentUser._id);
            return (
              <div
                key={post._id}
                className={`glass-card p-5 transition-all duration-200 ${
                  post.pinned 
                    ? 'border-l-4 border-l-purple-500 bg-brand-950/10 border-brand-500/20 shadow-[0_0_20px_rgba(139,92,246,0.04)]' 
                    : ''
                }`}
              >
                {/* Post Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={post.user?.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(post.user?.name || '')}`}
                      alt={post.user?.name}
                      className="w-10 h-10 rounded-full border border-slate-800 bg-slate-800"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-white">{post.user?.name || 'Anonymous User'}</span>
                        {post.user?.role === 'admin' && (
                          <span className="px-1.5 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-3xs font-extrabold uppercase rounded">Admin</span>
                        )}
                        <span className="text-3xs text-slate-500">
                          {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <span className="text-3xs text-slate-400 block mt-0.5">
                        {post.user?.department} • {post.user?.branch}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Category Tag */}
                    <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 text-3xs font-semibold rounded-full uppercase tracking-wider">
                      {post.category}
                    </span>
                    
                    {/* Pin label if pinned */}
                    {post.pinned && (
                      <span className="flex items-center space-x-1 text-purple-400 text-3xs font-bold uppercase tracking-wider px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded-full">
                        <Icons.Pin className="w-2.5 h-2.5" />
                        <span>Pinned</span>
                      </span>
                    )}

                    {/* Delete option */}
                    {(post.user?._id === currentUser._id || currentUser.role === 'admin') && (
                      <button
                        onClick={() => onDeletePost(post._id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                        title="Delete Post"
                      >
                        <Icons.Trash className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Post Body */}
                <div className="mt-4 space-y-3.5">
                  <h3 className="text-base font-bold text-white">{post.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>

                  {/* Attachment links */}
                  {post.links && post.links.length > 0 && (
                    <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1.5">
                      <span className="block text-slate-400 text-3xs font-bold uppercase tracking-wider">Resource References</span>
                      <div className="space-y-1">
                        {post.links.map((link, idx) => (
                          <a
                            key={idx}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-400 hover:text-brand-300 text-xs font-medium flex items-center space-x-1 truncate"
                          >
                            <Icons.ExternalLink className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{link}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Engagement Metrics */}
                <div className="flex items-center space-x-5 mt-5 pt-3 border-t border-slate-800/50 text-slate-400 text-xs font-semibold">
                  <button
                    onClick={() => onLikePost(post._id)}
                    className={`flex items-center space-x-1.5 hover:text-white transition-colors focus:outline-none ${
                      hasLiked ? 'text-red-400 hover:text-red-300' : ''
                    }`}
                  >
                    <Icons.Heart className={`w-4 h-4 ${hasLiked ? 'fill-red-400' : ''}`} />
                    <span>{post.likes?.length || 0} Likes</span>
                  </button>

                  <button
                    onClick={() => toggleComments(post._id)}
                    className="flex items-center space-x-1.5 hover:text-white transition-colors focus:outline-none"
                  >
                    <Icons.MessageCircle className="w-4 h-4" />
                    <span>{post.comments?.length || 0} Comments</span>
                  </button>

                  {post.community && (
                    <div className="flex-1 flex justify-end">
                      <span className="text-3xs text-brand-400 font-semibold uppercase tracking-wider flex items-center space-x-1">
                        <Icons.Tag className="w-2.5 h-2.5" />
                        <span>Inside Tech circle</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Comments Section Drawer */}
                {expandedCommentsPostId === post._id && (
                  <div className="mt-4 pt-4 border-t border-slate-800/40 space-y-4 animate-fade-in bg-slate-950/20 p-3 rounded-lg border border-slate-800/30">
                    <span className="block text-xs font-bold text-white">Discussion</span>
                    
                    {/* Add Comment Form */}
                    <form onSubmit={(e) => handleCommentSubmit(e, post._id)} className="flex items-center space-x-2">
                      <input
                        type="text"
                        required
                        placeholder="Write a supportive reply or feedback... (+2 pts)"
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 text-white rounded-lg px-3.5 py-1.5 text-xs focus:outline-none focus:border-brand-500"
                      />
                      <button
                        type="submit"
                        className="p-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors"
                      >
                        <Icons.Send className="w-3.5 h-3.5" />
                      </button>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-3 pt-2">
                      {!post.comments || post.comments.length === 0 ? (
                        <span className="block text-center text-slate-500 text-xs py-2">No comments yet. Start the conversation!</span>
                      ) : (
                        post.comments.map((comment) => (
                          <div key={comment._id} className="flex space-x-3 text-xs bg-slate-900/50 p-2.5 rounded-lg border border-slate-850">
                            <img
                              src={comment.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(comment.name)}`}
                              alt={comment.name}
                              className="w-7 h-7 rounded-full border border-slate-800 bg-slate-800"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-200">{comment.name}</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-4xs text-slate-500">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </span>
                                  {(comment.user?._id === currentUser._id || comment.user === currentUser._id || currentUser.role === 'admin') && (
                                    <button
                                      onClick={() => onDeleteComment(post._id, comment._id)}
                                      className="text-slate-500 hover:text-rose-400"
                                      title="Delete comment"
                                    >
                                      <Icons.X className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                              <p className="text-slate-300 mt-1 leading-normal">{comment.content}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
