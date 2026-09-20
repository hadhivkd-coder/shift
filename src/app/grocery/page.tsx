'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Sparkles,
  Check,
} from 'lucide-react';

export default function GroceryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('PROTEIN');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [adding, setAdding] = useState(false);

  const categories = [
    'PROTEIN',
    'VEGETABLES',
    'FRUIT',
    'CARBOHYDRATES',
    'DAIRY / ALTERNATIVES',
    'PANTRY',
    'OPTIONAL TREATS',
  ];

  async function loadGroceries() {
    try {
      const res = await fetch('/api/groceries');
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
      }
    } catch (err) {
      console.error('Failed to load groceries:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGroceries();
  }, []);

  async function togglePurchased(id: string, current: boolean) {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, purchased: current ? 0 : 1 } : item))
    );
    try {
      await fetch('/api/groceries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, purchased: !current }),
      });
    } catch (err) {
      console.error('Failed to update purchased status:', err);
    }
  }

  async function deleteItem(id: string) {
    setItems(prev => prev.filter(item => item.id !== id));
    try {
      await fetch(`/api/groceries?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  }

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newItemName.trim()) return;
    setAdding(true);
    try {
      const res = await fetch('/api/groceries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: newItemCategory,
          itemName: newItemName.trim(),
          quantity: newItemQuantity,
        }),
      });
      if (res.ok) {
        setNewItemName('');
        setNewItemQuantity('1');
        loadGroceries();
      }
    } catch (err) {
      console.error('Failed to add grocery:', err);
    } finally {
      setAdding(false);
    }
  }

  // Group items by category
  const grouped: Record<string, any[]> = {};
  for (const cat of categories) {
    grouped[cat] = items.filter(i => i.category.toUpperCase() === cat);
  }

  return (
    <div className="px-4 sm:px-8 max-w-5xl mx-auto py-6 sm:py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#2DD4BF] uppercase tracking-widest">
            SMART LOGISTICS
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">Smart Grocery List</h1>
          <p className="text-xs sm:text-sm text-[#8E98A0] mt-1">
            Categorized high-protein, fiber and pantry staples aligned with The 20 KG Blueprint.
          </p>
        </div>
      </div>

      {/* Add Custom Item Card */}
      <div className="p-5 rounded-3xl bg-[#0E1317] border border-white/10">
        <h3 className="text-xs font-mono uppercase text-[#D8F224] mb-3">Add Custom Item</h3>
        <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <input
              type="text"
              required
              value={newItemName}
              onChange={e => setNewItemName(e.target.value)}
              placeholder="e.g. Country Chicken Breast, Red Matta Rice..."
              className="w-full bg-[#141A1F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-[#8E98A0]/40 focus:outline-none focus:border-[#D8F224]"
            />
          </div>

          <div>
            <select
              value={newItemCategory}
              onChange={e => setNewItemCategory(e.target.value)}
              className="w-full bg-[#141A1F] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D8F224]"
            >
              {categories.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newItemQuantity}
              onChange={e => setNewItemQuantity(e.target.value)}
              placeholder="Qty"
              className="w-20 bg-[#141A1F] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D8F224]"
            />
            <button
              type="submit"
              disabled={adding}
              className="flex-1 py-2.5 rounded-xl bg-[#D8F224] text-black font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(216,242,36,0.25)] flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </form>
      </div>

      {/* Categorized Grocery List */}
      <div className="space-y-6">
        {categories.map(cat => {
          const list = grouped[cat] || [];
          if (list.length === 0) return null;
          return (
            <div key={cat} className="p-5 rounded-3xl bg-[#0E1317] border border-white/10 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-mono font-bold text-white tracking-wider">
                  {cat}
                </span>
                <span className="text-[10px] font-mono text-[#8E98A0]">
                  {list.filter(i => i.purchased).length} / {list.length} bought
                </span>
              </div>

              <div className="space-y-2">
                {list.map(item => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                      item.purchased
                        ? 'bg-white/[0.02] border-white/5 opacity-50'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div
                      onClick={() => togglePurchased(item.id, Boolean(item.purchased))}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      {item.purchased ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-white/30 shrink-0" />
                      )}
                      <div>
                        <span
                          className={`text-xs font-medium ${
                            item.purchased ? 'line-through text-[#8E98A0]' : 'text-white'
                          }`}
                        >
                          {item.item_name}
                        </span>
                        {item.quantity && (
                          <span className="text-[10px] font-mono text-[#8E98A0] ml-2">
                            ({item.quantity})
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-[#8E98A0] hover:text-red-400 p-1 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
