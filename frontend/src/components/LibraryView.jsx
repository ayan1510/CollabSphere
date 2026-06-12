import React, { useState } from 'react';
import * as Icons from 'lucide-react';

export default function LibraryView({
  resources,
  currentUser,
  onSubmitResource,
  onDownloadResource,
  onDeleteResource,
  searchQuery
}) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('pdf');
  const [url, setUrl] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !url.trim()) return;

    onSubmitResource({ title, description, type, url });

    setTitle('');
    setDescription('');
    setType('pdf');
    setUrl('');
    setShowUploadModal(false);
  };

  const getResourceIcon = (resType) => {
    switch (resType) {
      case 'pdf':
        return <Icons.FileText className="w-5 h-5 text-red-400" />;
      case 'video':
        return <Icons.Video className="w-5 h-5 text-blue-400" />;
      case 'template':
        return <Icons.FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
      case 'presentation':
        return <Icons.Presentation className="w-5 h-5 text-amber-400" />;
      default:
        return <Icons.FileCode className="w-5 h-5 text-slate-400" />;
    }
  };

  const handleDownload = (rId, rUrl) => {
    onDownloadResource(rId);
    window.open(rUrl, '_blank', 'noopener,noreferrer');
  };

  // Filters
  const filteredResources = resources.filter(res => {
    // Type filter
    if (selectedTypeFilter && res.type !== selectedTypeFilter) return false;

    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = res.title.toLowerCase().includes(q);
      const matchDesc = res.description.toLowerCase().includes(q);
      const matchAuthor = res.uploadedBy?.name.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchAuthor) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Search and Toolbar */}
      <div className="glass-card p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Categories filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <span className="text-3xs text-slate-400 font-bold uppercase tracking-wider mr-2">Formats:</span>
          <button
            onClick={() => setSelectedTypeFilter('')}
            className={`px-3 py-1 rounded-lg text-3xs font-semibold uppercase tracking-wider ${
              selectedTypeFilter === ''
                ? 'bg-slate-900 border border-brand-500/20 text-brand-400'
                : 'bg-transparent text-slate-400 hover:text-white'
            }`}
          >
            All Resources
          </button>
          <button
            onClick={() => setSelectedTypeFilter('pdf')}
            className={`px-3 py-1 rounded-lg text-3xs font-semibold uppercase tracking-wider flex items-center space-x-1 ${
              selectedTypeFilter === 'pdf'
                ? 'bg-slate-900 border border-brand-500/20 text-brand-400'
                : 'bg-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Icons.FileText className="w-3.5 h-3.5 text-red-400" />
            <span>PDF Guides</span>
          </button>
          <button
            onClick={() => setSelectedTypeFilter('video')}
            className={`px-3 py-1 rounded-lg text-3xs font-semibold uppercase tracking-wider flex items-center space-x-1 ${
              selectedTypeFilter === 'video'
                ? 'bg-slate-900 border border-brand-500/20 text-brand-400'
                : 'bg-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Icons.Video className="w-3.5 h-3.5 text-blue-400" />
            <span>Videos</span>
          </button>
          <button
            onClick={() => setSelectedTypeFilter('template')}
            className={`px-3 py-1 rounded-lg text-3xs font-semibold uppercase tracking-wider flex items-center space-x-1 ${
              selectedTypeFilter === 'template'
                ? 'bg-slate-900 border border-brand-500/20 text-brand-400'
                : 'bg-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Icons.FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Templates</span>
          </button>
          <button
            onClick={() => setSelectedTypeFilter('presentation')}
            className={`px-3 py-1 rounded-lg text-3xs font-semibold uppercase tracking-wider flex items-center space-x-1 ${
              selectedTypeFilter === 'presentation'
                ? 'bg-slate-900 border border-brand-500/20 text-brand-400'
                : 'bg-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Icons.Presentation className="w-3.5 h-3.5 text-amber-400" />
            <span>Decks</span>
          </button>
        </div>

        {/* Upload Resource Button */}
        <button
          onClick={() => setShowUploadModal(true)}
          className="w-full md:w-auto px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition-all shadow"
        >
          <Icons.Upload className="w-4 h-4" />
          <span>Upload File / Link (+5 pts)</span>
        </button>
      </div>

      {/* Grid of Files */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-500 col-span-full flex flex-col items-center justify-center space-y-3">
            <Icons.Folder className="w-10 h-10 text-slate-605" />
            <h3 className="text-sm font-bold text-slate-400">No resources found</h3>
            <p className="text-xs text-slate-500 font-medium">Try changing formats or search terms, or upload a reference file.</p>
          </div>
        ) : (
          filteredResources.map((res) => (
            <div
              key={res._id}
              className="glass-card p-5 hover:border-slate-800 transition-all flex flex-col justify-between text-left group relative"
            >
              <div className="space-y-4">
                {/* File Header */}
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-slate-950/80 border border-slate-850 rounded-xl">
                    {getResourceIcon(res.type)}
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Delete Resource */}
                    {(res.uploadedBy?._id === currentUser._id || res.uploadedBy === currentUser._id || currentUser.role === 'admin') && (
                      <button
                        onClick={() => onDeleteResource(res._id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                        title="Delete Resource"
                      >
                        <Icons.Trash className="w-3.5 h-3.5" />
                      </button>
                    )}
                    
                    <span className="px-2 py-0.5 bg-slate-900 border border-slate-850 text-slate-400 text-4xs font-bold uppercase rounded">
                      {res.type}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold text-white group-hover:text-brand-400 transition-colors leading-snug line-clamp-1">
                    {res.title}
                  </h3>
                  <p className="text-slate-450 text-4xs leading-relaxed line-clamp-3 min-h-[3rem]">
                    {res.description}
                  </p>
                </div>
              </div>

              {/* Footer downloads count + action */}
              <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-slate-400 text-3xs font-semibold">
                <div className="flex items-center space-x-1.5">
                  <Icons.DownloadCloud className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-350">{res.downloads || 0} Downloads</span>
                </div>

                <button
                  onClick={() => handleDownload(res._id, res.url)}
                  className="px-3 py-1 bg-brand-600/10 border border-brand-500/20 hover:bg-brand-600 hover:text-white text-brand-400 text-3xs font-bold rounded-lg transition-all flex items-center space-x-1"
                >
                  <Icons.ExternalLink className="w-3 h-3" />
                  <span>Access Resource</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden animate-slide-up space-y-4"
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-800/60">
              <span className="text-sm font-bold text-white flex items-center space-x-2">
                <Icons.Upload className="w-4.5 h-4.5 text-brand-400" />
                <span>Upload a Learning Resource</span>
              </span>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-slate-500 hover:text-white"
              >
                <Icons.X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div>
              <label className="block text-slate-400 text-3xs font-bold uppercase tracking-wider mb-1">Resource Title</label>
              <input
                type="text"
                required
                placeholder="e.g., Accounts wire Escapation Checklist Sheet"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-3xs font-bold uppercase tracking-wider mb-1">Brief Description</label>
              <textarea
                required
                rows="3"
                placeholder="Outline what this document covers and which departments should consult it..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-brand-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-3xs font-bold uppercase tracking-wider mb-1">Resource Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-500"
                >
                  <option value="pdf">PDF Handbook</option>
                  <option value="video">Training Video Link</option>
                  <option value="template">Spreadsheet/Doc Template</option>
                  <option value="presentation">Slide Deck (PPT)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-3xs font-bold uppercase tracking-wider mb-1">Document Link / URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://docs.google.com/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800/40">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 text-xs text-slate-400 rounded-lg hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg flex items-center space-x-1"
              >
                <Icons.Send className="w-3.5 h-3.5" />
                <span>Upload (+5 pts)</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
