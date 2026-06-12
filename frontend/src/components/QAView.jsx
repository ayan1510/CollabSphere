import React, { useState } from 'react';
import * as Icons from 'lucide-react';

export default function QAView({
  questions,
  currentUser,
  onSubmitQuestion,
  onUpvoteQuestion,
  onSubmitAnswer,
  onSelectBestAnswer,
  onDeleteQuestion,
  searchQuery
}) {
  const [showAskModal, setShowAskModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsString, setTagsString] = useState('');
  
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [answerContent, setAnswerContent] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState('');

  const handleAskSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsString
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onSubmitQuestion({ title, content, tags });
    
    setTitle('');
    setContent('');
    setTagsString('');
    setShowAskModal(false);
  };

  const handleAnswerSubmit = (e, qId) => {
    e.preventDefault();
    if (!answerContent.trim()) return;
    onSubmitAnswer(qId, answerContent);
    setAnswerContent('');
  };

  // Compile all unique tags in the database for the tag-filtering toolbar
  const allTagsSet = new Set();
  questions.forEach((q) => {
    if (q.tags) {
      q.tags.forEach(t => allTagsSet.add(t));
    }
  });
  const allTags = Array.from(allTagsSet);

  // Question Filters
  const filteredQuestions = questions.filter(q => {
    // Tag filter
    if (selectedTagFilter && !q.tags?.includes(selectedTagFilter)) return false;

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchTitle = q.title.toLowerCase().includes(query);
      const matchContent = q.content.toLowerCase().includes(query);
      const matchAuthor = q.user?.name.toLowerCase().includes(query);
      const matchTags = q.tags?.some(t => t.toLowerCase().includes(query));
      if (!matchTitle && !matchContent && !matchAuthor && !matchTags) return false;
    }
    return true;
  });

  const activeQuestion = questions.find(q => q._id === expandedQuestionId);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Search and Tag Filtering Header */}
      <div className="glass-card p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Tags quick links */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <span className="text-3xs text-slate-400 font-bold uppercase tracking-wider mr-2">Quick Tags:</span>
          <button
            onClick={() => setSelectedTagFilter('')}
            className={`px-2 py-0.5 rounded-full text-3xs font-semibold uppercase tracking-wider ${
              selectedTagFilter === ''
                ? 'bg-brand-600 border border-brand-500/30 text-white'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Threads
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTagFilter(tag)}
              className={`px-2 py-0.5 rounded-full text-3xs font-semibold uppercase tracking-wider ${
                selectedTagFilter === tag
                  ? 'bg-brand-600 border border-brand-500/30 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Ask Question trigger button */}
        <button
          onClick={() => setShowAskModal(true)}
          className="w-full md:w-auto px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition-colors shadow"
        >
          <Icons.HelpCircle className="w-4 h-4" />
          <span>Ask a Question (+5 pts)</span>
        </button>
      </div>

      {/* Main List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
            <Icons.HelpCircle className="w-10 h-10 text-slate-600" />
            <h3 className="text-sm font-bold text-slate-400">No questions found</h3>
            <p className="text-xs text-slate-500">Try broadening your search or ask a question to seed the forum!</p>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const hasUpvoted = q.upvotes?.includes(currentUser._id);
            const hasBestAnswer = q.answers?.some(a => a.isBestAnswer);

            return (
              <div
                key={q._id}
                onClick={() => setExpandedQuestionId(q._id)}
                className={`glass-card p-5 hover:border-brand-500/20 cursor-pointer transition-all duration-200 flex items-start gap-4 ${
                  hasBestAnswer ? 'border-l-4 border-l-emerald-500' : ''
                }`}
              >
                {/* Score votes column */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpvoteQuestion(q._id);
                  }}
                  className={`flex flex-col items-center p-2 rounded-lg border bg-slate-950/45 hover:bg-slate-800/80 transition-colors w-12 flex-shrink-0 ${
                    hasUpvoted ? 'border-brand-500/40 text-brand-400' : 'border-slate-850 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icons.ChevronUp className="w-4.5 h-4.5" />
                  <span className="text-xs font-bold mt-0.5">{q.upvotes?.length || 0}</span>
                </div>

                {/* Details column */}
                <div className="flex-1 min-w-0 text-left space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-3xs text-slate-400">
                      Asked by <span className="font-semibold text-slate-300">{q.user?.name}</span> • {q.user?.department}
                    </span>
                    <span className="text-4xs text-slate-550">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors">
                    {q.title}
                  </h3>

                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {q.content}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {q.tags?.map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 bg-slate-900 border border-slate-850 text-slate-400 text-4xs font-medium rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Answers count badge */}
                    <span className={`px-2 py-0.5 text-3xs font-semibold rounded-full flex items-center space-x-1 border ${
                      hasBestAnswer 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : q.answers?.length > 0
                        ? 'bg-slate-900 border-slate-800 text-slate-300'
                        : 'bg-transparent border-transparent text-slate-500'
                    }`}>
                      {hasBestAnswer ? (
                        <>
                          <Icons.CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Solved</span>
                        </>
                      ) : (
                        <span>{q.answers?.length || 0} answers</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Ask Question overlay Modal */}
      {showAskModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex items-center justify-center p-4">
          <form
            onSubmit={handleAskSubmit}
            className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden animate-slide-up space-y-4"
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-800/60">
              <span className="text-sm font-bold text-white flex items-center space-x-2">
                <Icons.HelpCircle className="w-4.5 h-4.5 text-brand-400" />
                <span>Ask the Community</span>
              </span>
              <button
                type="button"
                onClick={() => setShowAskModal(false)}
                className="text-slate-500 hover:text-white"
              >
                <Icons.X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div>
              <label className="block text-slate-400 text-3xs font-bold uppercase tracking-wider mb-1">Question Title</label>
              <input
                type="text"
                required
                placeholder="e.g., What is the manual escalation protocol for accounts approval?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-3xs font-bold uppercase tracking-wider mb-1">Details</label>
              <textarea
                required
                rows="5"
                placeholder="Describe what you are trying to solve, background details, and what help is needed..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-brand-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-3xs font-bold uppercase tracking-wider mb-1">Topic Tags (comma separated)</label>
              <input
                type="text"
                placeholder="e.g., Escalation, Finance-Ops, Tutorial"
                value={tagsString}
                onChange={(e) => setTagsString(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800/40">
              <button
                type="button"
                onClick={() => setShowAskModal(false)}
                className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 text-xs text-slate-400 rounded-lg hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg flex items-center space-x-1"
              >
                <Icons.Send className="w-3.5 h-3.5" />
                <span>Submit Question (+5 pts)</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expanded Question Thread Modal */}
      {activeQuestion && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden animate-slide-up max-h-[85vh] overflow-y-auto space-y-6">
            {/* Close */}
            <button
              onClick={() => setExpandedQuestionId(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <Icons.X className="w-5 h-5" />
            </button>

            {/* Question Card */}
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={activeQuestion.user?.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(activeQuestion.user?.name || '')}`}
                    alt={activeQuestion.user?.name}
                    className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{activeQuestion.user?.name}</h4>
                    <span className="text-4xs text-slate-500 block">
                      {activeQuestion.user?.department} • {activeQuestion.user?.branch}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {/* Delete Option */}
                  {(activeQuestion.user?._id === currentUser._id || activeQuestion.user === currentUser._id || currentUser.role === 'admin') && (
                    <button
                      onClick={() => {
                        onDeleteQuestion(activeQuestion._id);
                        setExpandedQuestionId(null);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded"
                      title="Delete Thread"
                    >
                      <Icons.Trash className="w-4 h-4" />
                    </button>
                  )}
                  <span className="text-4xs text-slate-500">{new Date(activeQuestion.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-base font-bold text-white">{activeQuestion.title}</h2>
                <p className="text-xs text-slate-350 leading-relaxed whitespace-pre-wrap">{activeQuestion.content}</p>
              </div>

              <div className="flex flex-wrap gap-1">
                {activeQuestion.tags?.map((t) => (
                  <span key={t} className="px-1.5 py-0.5 bg-slate-950 border border-slate-850 text-slate-400 text-4xs font-medium rounded">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Answers Tally */}
            <div className="border-t border-slate-800/80 pt-5 space-y-4 text-left">
              <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
                <Icons.MessageSquare className="w-4.5 h-4.5 text-brand-400" />
                <span>Answers ({activeQuestion.answers?.length || 0})</span>
              </h3>

              {/* Answers list */}
              <div className="space-y-3.5">
                {!activeQuestion.answers || activeQuestion.answers.length === 0 ? (
                  <div className="p-4 bg-slate-950/30 border border-slate-850 rounded-xl text-center text-slate-500 text-xs">
                    No replies yet. Be the first to answer and support your colleague!
                  </div>
                ) : (
                  activeQuestion.answers.map((answer) => {
                    const isQuestionAuthor = activeQuestion.user?._id === currentUser._id || activeQuestion.user === currentUser._id;
                    return (
                      <div
                        key={answer._id}
                        className={`p-4 rounded-xl border flex flex-col sm:flex-row gap-4 items-start ${
                          answer.isBestAnswer
                            ? 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.02)]'
                            : 'bg-slate-950/40 border-slate-850'
                        }`}
                      >
                        {/* Profile left within answer */}
                        <div className="flex items-center sm:flex-col sm:items-start gap-2.5 sm:w-28 flex-shrink-0">
                          <img
                            src={answer.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(answer.name)}`}
                            alt={answer.name}
                            className="w-8 h-8 rounded-full border border-slate-800 bg-slate-800"
                          />
                          <div className="min-w-0 sm:w-full">
                            <span className="block text-xs font-bold text-slate-200 truncate">{answer.name}</span>
                            <span className="block text-4xs text-slate-500 truncate">
                              {answer.user?.department || 'Employee'}
                            </span>
                          </div>
                        </div>

                        {/* Content right within answer */}
                        <div className="flex-1 text-left min-w-0 space-y-3">
                          <p className="text-xs text-slate-350 leading-relaxed whitespace-pre-wrap">{answer.content}</p>

                          <div className="flex items-center justify-between text-4xs text-slate-550 pt-2 border-t border-slate-850/50">
                            <span>Answered on {new Date(answer.createdAt).toLocaleDateString()}</span>
                            
                            {/* Best Answer toggles */}
                            <div className="flex items-center space-x-2">
                              {answer.isBestAnswer && (
                                <span className="flex items-center space-x-1 text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                  <Icons.Check className="w-3 h-3" />
                                  <span>Best Answer</span>
                                </span>
                              )}

                              {isQuestionAuthor && (
                                <button
                                  onClick={() => onSelectBestAnswer(activeQuestion._id, answer._id)}
                                  className={`px-2 py-1 rounded text-3xs font-semibold transition-colors flex items-center space-x-0.5 ${
                                    answer.isBestAnswer
                                      ? 'text-slate-500 hover:text-slate-400 bg-slate-900 border border-slate-800'
                                      : 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/15'
                                  }`}
                                >
                                  <Icons.CheckCircle2 className="w-3 h-3" />
                                  <span>{answer.isBestAnswer ? 'Unmark Best' : 'Accept Best Answer'}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Submit Answer form */}
              <form onSubmit={(e) => handleAnswerSubmit(e, activeQuestion._id)} className="space-y-3 pt-4 border-t border-slate-800/80">
                <label className="block text-slate-400 text-3xs font-bold uppercase tracking-wider">Provide your Answer</label>
                <textarea
                  required
                  rows="3.5"
                  placeholder="Share a solution, guideline, documentation link, or recommend a template... (+5 pts)"
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-brand-500 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-all shadow"
                  >
                    <Icons.MessageSquareQuote className="w-3.5 h-3.5" />
                    <span>Post Answer (+5 pts)</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
