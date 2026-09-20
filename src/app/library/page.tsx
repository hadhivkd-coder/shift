'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Clock,
  Sparkles,
  ChevronRight,
  X,
  Search,
} from 'lucide-react';
import { LIBRARY_ARTICLES, LibraryArticle } from '@/lib/content/library';

export default function LibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<LibraryArticle | null>(null);
  const [savedArticles, setSavedArticles] = useState<string[]>(['five-dials-explained']);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Nutrition',
    'Movement',
    'Sleep',
    'Skin',
    'Cravings',
    'Restaurants',
    'Plateaus',
    'Maintenance',
  ];

  function toggleSave(slug: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (savedArticles.includes(slug)) {
      setSavedArticles(savedArticles.filter(s => s !== slug));
    } else {
      setSavedArticles([...savedArticles, slug]);
    }
  }

  const filtered = LIBRARY_ARTICLES.filter(art => {
    if (selectedCategory !== 'All' && art.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="px-4 sm:px-8 max-w-5xl mx-auto py-6 sm:py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#F59E0B] uppercase tracking-widest">
            EDUCATIONAL LAYER
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">The Blueprint Library</h1>
          <p className="text-xs sm:text-sm text-[#8E98A0] mt-1">
            Core science, mindset protocols, and frameworks from *The 20 KG Blueprint*.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#8E98A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search guides..."
            className="w-full bg-[#0E1317] border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-[#8E98A0]/40 focus:outline-none focus:border-[#D8F224]"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors ${
              selectedCategory === cat
                ? 'bg-[#D8F224] text-black shadow-md'
                : 'bg-white/[0.03] border border-white/10 text-[#8E98A0] hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Article Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(art => {
          const isSaved = savedArticles.includes(art.slug);
          return (
            <div
              key={art.slug}
              onClick={() => setActiveArticle(art)}
              className="p-6 rounded-3xl bg-[#0E1317] border border-white/10 hover:border-white/20 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[10px] font-mono text-[#D8F224] font-bold">
                    {art.category} • {art.readTime}
                  </span>

                  <button
                    onClick={e => toggleSave(art.slug, e)}
                    className="text-[#8E98A0] hover:text-[#D8F224] p-1"
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-4 h-4 text-[#D8F224]" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-[#D8F224] transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-[#8E98A0] leading-relaxed">{art.summary}</p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#D8F224] font-semibold">
                <span>Read Full Guide</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0C1014] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <span className="px-3 py-1 rounded-full bg-white/5 text-xs font-mono text-[#D8F224]">
                {activeArticle.category} • {activeArticle.readTime}
              </span>
              <button
                onClick={() => setActiveArticle(null)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#8E98A0] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white mb-4">
              {activeArticle.title}
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-white/80 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              {activeArticle.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}

              <div className="p-4 rounded-2xl bg-[#D8F224]/5 border border-[#D8F224]/20 space-y-2 mt-6">
                <span className="text-xs font-mono font-bold uppercase text-[#D8F224] block">
                  Key Takeaways
                </span>
                <ul className="list-disc list-inside space-y-1 text-xs text-white">
                  {activeArticle.keyTakeaways.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
