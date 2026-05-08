'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  MousePointerClick,
  Type,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  Copy,
  MoveUp,
  MoveDown,
  Plus,
  Save,
  X,
  Check,
  Smartphone,
  Monitor,
  Tablet,
  Eye,
  EyeOff,
  GripVertical,
  ChevronLeft,
  Settings2
} from 'lucide-react';
import { Reorder } from 'framer-motion';
interface EditableElement {
  id: string;
  type: 'text' | 'image' | 'button' | 'product' | 'section';
  content: string;
  contentBn?: string;
  styles?: Record<string, string>;
  page: string;
  section: string;
  key: string;
}
interface PageSection {
  id: string;
  section_type: string;
  title: string;
  is_active: boolean;
  section_order: number;
  content: any;
}
export default function LiveEditorPage() {
  const [currentPage, setCurrentPage] = useState('home');
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedElement, setSelectedElement] = useState<EditableElement | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editValueBn, setEditValueBn] = useState('');
  const [sections, setSections] = useState<PageSection[]>([]);
  const [showSectionPanel, setShowSectionPanel] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const pages = [
    { id: 'home', label: 'Homepage', labelBn: 'হোমপেজ' },
    { id: 'men', label: 'Men', labelBn: 'পুরুষ' },
    { id: 'women', label: 'Women', labelBn: 'নারী' },
    { id: 'kids', label: 'Kids', labelBn: 'বাচ্চা' },
    { id: 'product', label: 'Product Page', labelBn: 'প্রোডাক্ট ডিটেইল' },
  ];
  const deviceWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px'
  };
  // Fetch sections for current page
  const fetchSections = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/page-sections?page=${currentPage}`);
      const data = await res.json();
      setSections(data.sections || []);
    } catch (error) {
      console.error('Failed to fetch sections');
    }
  }, [currentPage]);
  useEffect(() => {
    fetchSections();
  }, [fetchSections]);
  // Handle click on editable element inside iframe
  const handleIframeMessage = useCallback((event: MessageEvent) => {
    if (event.data.type === 'ELEMENT_SELECTED') {
      setSelectedElement(event.data.element);
      setEditValue(event.data.element.content);
      setEditValueBn(event.data.element.contentBn || '');
    }
  }, []);
  useEffect(() => {
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [handleIframeMessage]);
  const saveEdit = async () => {
    if (!selectedElement) return;
    setIsSaving(true);
    try {
      await fetch('/api/admin/editable-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...selectedElement,
          content: editValue,
          contentBn: editValueBn,
        }),
      });
      // Show success toast
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2000);
      // Reload iframe to reflect changes
      const iframe = document.querySelector('iframe');
      if (iframe) iframe.src = iframe.src;
      setSelectedElement(null);
    } catch (err) {
      console.error('Save failed');
    } finally {
      setIsSaving(false);
    }
  };
  const toggleSectionStatus = async (sectionId: string, currentStatus: boolean) => {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, is_active: !currentStatus } : s));
    await fetch('/api/admin/page-sections', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: sectionId, isActive: !currentStatus }),
    });
  };
  const reorderSections = async (newOrder: PageSection[]) => {
    setSections(newOrder);
    await fetch('/api/admin/page-sections/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        page: currentPage, 
        orders: newOrder.map((s, i) => ({ id: s.id, order: i })) 
      }),
    });
  };
  const addSection = async (type: string) => {
    const newSection = {
      page: currentPage,
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1) + ' Section',
      isActive: true,
      order: sections.length,
      data: {}
    };
    const res = await fetch('/api/admin/page-sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSection),
    });
    const data = await res.json();
    if (data.section) {
      setSections([...sections, data.section]);
      setShowSectionPanel(false);
    }
  };
  const deleteSection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;
    await fetch(`/api/admin/page-sections?id=${id}`, { method: 'DELETE' });
    setSections(sections.filter(s => s.id !== id));
  };
  return (
    <div className="h-[calc(100vh-140px)] flex gap-8">
      {/* Left Sidebar: Controls */}
      <div className="w-[400px] flex flex-col gap-6 h-full">
        {/* Page Selector Card */}
        <div className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 px-2">
            <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Settings2 size={16} />
            </div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 font-black">Editor Controls</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {pages.map(page => (
              <motion.button
                key={page.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentPage(page.id)}
                className={`p-4 rounded-2xl text-sm font-black transition-all text-left ${
                  currentPage === page.id 
                    ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/20' 
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {page.label}
                <span className="block text-[10px] font-bold opacity-60 mt-0.5">{page.labelBn}</span>
              </motion.button>
            ))}
          </div>
        </div>
        {/* Section Manager Card */}
        <div className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 font-black">Page Sections</h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowSectionPanel(!showSectionPanel)}
              className="w-10 h-10 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Plus size={20} />
            </motion.button>
          </div>
          <AnimatePresence>
            {showSectionPanel && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="bg-gray-50 rounded-[1.5rem] p-4 grid grid-cols-2 gap-2">
                  {['hero', 'products', 'reviews', 'banner', 'reels', 'newsletter'].map(type => (
                    <button
                      key={type}
                      onClick={() => addSection(type)}
                      className="text-left px-4 py-3 bg-white rounded-xl text-xs font-black text-gray-700 hover:bg-gray-900 hover:text-white transition-all shadow-sm border border-transparent hover:border-gray-900"
                    >
                      + {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <Reorder.Group axis="y" values={sections} onReorder={reorderSections} className="space-y-3">
              {sections.map((section) => (
                <Reorder.Item 
                  key={section.id} 
                  value={section}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={`p-4 rounded-2xl border transition-all cursor-default ${
                    section.is_active ? 'bg-white border-gray-100 shadow-sm' : 'bg-gray-50 border-transparent opacity-60'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="cursor-grab text-gray-300 hover:text-gray-500 transition-colors">
                        <GripVertical size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-sm text-gray-900 truncate">{section.title}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{section.section_type}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleSectionStatus(section.id, section.is_active)}
                          className={`p-2 rounded-xl transition-all ${section.is_active ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-100 text-gray-400'}`}
                        >
                          {section.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1, backgroundColor: '#fee2e2', color: '#ef4444' }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteSection(section.id)}
                          className="p-2 rounded-xl text-gray-300 transition-all"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
            {sections.length === 0 && (
              <div className="text-center py-10">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <LayoutDashboard size={24} />
                </div>
                <p className="text-gray-400 text-sm font-bold">No sections found</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Main Area: Iframe Preview */}
      <div className="flex-1 bg-gray-100 rounded-[2.5rem] border border-gray-200 overflow-hidden flex flex-col relative shadow-inner">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-gray-50 rounded-2xl p-1.5 border border-gray-100 shadow-inner">
            {([
              { id: 'desktop', icon: Monitor },
              { id: 'tablet', icon: Tablet },
              { id: 'mobile', icon: Smartphone }
            ] as const).map(d => (
              <motion.button
                key={d.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDevice(d.id)}
                className={`p-2.5 rounded-xl transition-all ${
                  device === d.id ? 'bg-white text-gray-900 shadow-md' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <d.icon size={20} />
              </motion.button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-6 py-2.5 rounded-2xl text-sm font-black transition-all flex items-center gap-2 ${
                previewMode ? 'bg-gray-900 text-white shadow-lg' : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}
            >
              {previewMode ? <Eye size={18} /> : <MousePointerClick size={18} />}
              {previewMode ? 'Preview Mode' : 'Edit Mode'}
            </motion.button>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Live Sync</span>
            </div>
          </div>
        </div>
        {/* Canvas Area */}
        <div className="flex-1 overflow-auto p-12 flex justify-center bg-gray-50/50">
          <motion.div
            animate={{ width: deviceWidths[device] }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white shadow-2xl rounded-3xl overflow-hidden h-full relative border border-gray-200"
            style={{ minHeight: '800px' }}
          >
            <iframe
              src={`/?editor=true&page=${currentPage}`}
              className={`w-full h-full border-0 ${previewMode ? 'pointer-events-auto' : 'pointer-events-auto'}`}
              style={{ minHeight: '800px' }}
            />
            {/* Editor Guide Overlay */}
            {!previewMode && (
              <div className="absolute inset-0 pointer-events-none border-4 border-dashed border-purple-200 rounded-3xl flex items-center justify-center">
                 <div className="bg-purple-600 text-white px-6 py-3 rounded-full text-xs font-black shadow-2xl flex items-center gap-2 opacity-80 backdrop-blur-md">
                    <MousePointerClick size={16} />
                    Click Any Element to Edit
                 </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      {/* Right Sidebar: Edit Element (Contextual) */}
      <AnimatePresence>
        {selectedElement && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="w-[400px] bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl p-8 flex flex-col h-full overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                  {selectedElement.type === 'text' ? <Type size={24} /> : 
                   selectedElement.type === 'image' ? <ImageIcon size={24} /> : 
                   <LinkIcon size={24} />}
                </div>
                <div>
                  <h3 className="font-black text-gray-900">Edit {selectedElement.type}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{selectedElement.section}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedElement(null)}
                className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </motion.button>
            </div>
            <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {/* Content Edit */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-black mb-3 block px-1">English Content</label>
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full p-5 bg-gray-50 rounded-3xl border border-transparent focus:border-purple-200 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-purple-500/5 transition-all outline-none resize-none"
                    rows={6}
                    placeholder="Enter English text..."
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-black mb-3 block px-1">বাংলা কন্টেন্ট (Bengali)</label>
                  <textarea
                    value={editValueBn}
                    onChange={(e) => setEditValueBn(e.target.value)}
                    className="w-full p-5 bg-gray-50 rounded-3xl border border-transparent focus:border-purple-200 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-purple-500/5 transition-all outline-none resize-none"
                    rows={6}
                    placeholder="বাংলায় লিখুন..."
                  />
                </div>
              </div>
              {selectedElement.type === 'image' && (
                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-black mb-1 block px-1">Image Asset</label>
                  <div className="border-4 border-dashed border-gray-50 rounded-3xl p-10 text-center hover:border-purple-200 hover:bg-purple-50/30 transition-all cursor-pointer bg-gray-50/50 group">
                    <ImageIcon size={48} className="mx-auto text-gray-200 group-hover:text-purple-300 mb-3 transition-colors" />
                    <p className="text-sm text-gray-400 font-bold group-hover:text-purple-500">Change Image</p>
                    <p className="text-[10px] text-gray-300 font-medium mt-1">Upload from computer</p>
                  </div>
                </div>
              )}
              <div className="bg-gray-50 rounded-3xl p-6">
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-4">Quick Styles</p>
                 <div className="grid grid-cols-2 gap-2">
                    <button className="px-4 py-3 bg-white rounded-2xl text-xs font-black text-gray-700 shadow-sm border border-gray-100 hover:bg-gray-900 hover:text-white transition-all">Bold</button>
                    <button className="px-4 py-3 bg-white rounded-2xl text-xs font-black text-gray-700 shadow-sm border border-gray-100 hover:bg-gray-900 hover:text-white transition-all">Uppercase</button>
                    <button className="px-4 py-3 bg-white rounded-2xl text-xs font-black text-gray-700 shadow-sm border border-gray-100 hover:bg-gray-900 hover:text-white transition-all">Primary Color</button>
                    <button className="px-4 py-3 bg-white rounded-2xl text-xs font-black text-gray-700 shadow-sm border border-gray-100 hover:bg-gray-900 hover:text-white transition-all">Large Font</button>
                 </div>
              </div>
            </div>
            {/* Actions */}
            <div className="pt-8 space-y-3 mt-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={saveEdit}
                disabled={isSaving}
                className="w-full py-5 bg-gray-900 text-white rounded-[1.5rem] font-black text-sm hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSaving ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
                {isSaving ? 'Saving Changes...' : 'Save Changes'}
              </motion.button>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-4 bg-gray-50 text-gray-600 rounded-[1.25rem] font-black text-xs hover:bg-gray-100 transition-all border border-gray-100 flex items-center justify-center gap-2"
                >
                  <Copy size={16} /> Duplicate
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: '#fee2e2', color: '#ef4444' }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-4 bg-red-50 text-red-500 rounded-[1.25rem] font-black text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} /> Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Toast Notification */}
      <AnimatePresence>
        {savedToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-3 font-black z-[100] border-4 border-white/20 backdrop-blur-lg"
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
               <Check size={20} />
            </div>
            Update Saved Successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
