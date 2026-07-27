'use client';

import React, { useRef, useEffect, useState } from 'react';
import { 
  Undo, Redo, Bold, Italic, Underline, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, 
  List, ListOrdered, Link2, Image as ImageIcon, 
  Table as TableIcon, Minus, Code, Eye, Eraser, 
  Upload, Globe, Subscript, Superscript, Indent, Outdent,
  ChevronDown, Type, Quote, Settings, BarChart2
} from 'lucide-react';

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function WysiwygEditor({ value, onChange, placeholder = 'Tulis konten di sini...' }: WysiwygEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // View mode
  const [isCodeView, setIsCodeView] = useState(false);
  const [htmlValue, setHtmlValue] = useState(value);
  
  // Ribbon Tab Mode: 'home' | 'insert' | 'view'
  const [activeTab, setActiveTab] = useState<'home' | 'insert' | 'view'>('home');

  // Popover / Dropdown States
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const [showTablePopup, setShowTablePopup] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [showBgColorDropdown, setShowBgColorDropdown] = useState(false);

  const fontFamilies = [
    { name: 'Default', value: 'system-ui, sans-serif' },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Times New Roman', value: '"Times New Roman", serif' },
    { name: 'Courier New', value: '"Courier New", monospace' },
    { name: 'Verdana', value: 'Verdana, sans-serif' }
  ];

  const fontSizes = [
    { name: '10px', value: '1' },
    { name: '13px', value: '2' },
    { name: '16px', value: '3' },
    { name: '18px', value: '4' },
    { name: '24px', value: '5' },
    { name: '32px', value: '6' },
    { name: '48px', value: '7' }
  ];

  const colors = [
    { name: 'Hitam', value: '#0f172a' },
    { name: 'Abu-abu', value: '#64748b' },
    { name: 'Merah', value: '#ef4444' },
    { name: 'Oranye', value: '#f97316' },
    { name: 'Emas/Kuning', value: '#d97706' },
    { name: 'Hijau', value: '#10b981' },
    { name: 'Biru', value: '#2563eb' },
    { name: 'Ungu', value: '#8b5cf6' }
  ];

  const bgColors = [
    { name: 'Kuning Stabilo', value: '#fef08a' },
    { name: 'Cyan Muda', value: '#cffafe' },
    { name: 'Hijau Muda', value: '#dcfce7' },
    { name: 'Merah Muda', value: '#fee2e2' },
    { name: 'Oranye Muda', value: '#ffedd5' },
    { name: 'Ungu Muda', value: '#f3e8ff' },
    { name: 'Tanpa Warna', value: 'transparent' }
  ];

  // Sync external value to local state and editor DOM
  useEffect(() => {
    if (value !== htmlValue) {
      setHtmlValue(value);
      if (editorRef.current && !isCodeView) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value, isCodeView]);

  // Initial populate
  useEffect(() => {
    if (editorRef.current && !isCodeView) {
      editorRef.current.innerHTML = htmlValue;
    }
  }, [isCodeView]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setHtmlValue(html);
      onChange(html);
    }
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const html = e.target.value;
    setHtmlValue(html);
    onChange(html);
  };

  const executeCommand = (command: string, value: string = '') => {
    if (isCodeView) return;
    document.execCommand(command, false, value);
    handleInput();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleInsertLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkUrl) {
      executeCommand('createLink', linkUrl);
      setLinkUrl('');
      setShowLinkPopup(false);
    }
  };

  const handleInsertImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl) {
      const imgHtml = `<img src="${imageUrl}" alt="Image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 12px 0;" />`;
      executeCommand('insertHTML', imgHtml);
      setImageUrl('');
      setShowImagePopup(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImageUploadLoading(true);
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const imgHtml = `<img src="${event.target.result}" alt="${file.name}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 12px 0;" />`;
          executeCommand('insertHTML', imgHtml);
          setImageUploadLoading(false);
          setShowImagePopup(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsertTable = (e: React.FormEvent) => {
    e.preventDefault();
    let tableHtml = '<table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;"><tbody>';
    for (let r = 0; r < tableRows; r++) {
      tableHtml += '<tr>';
      for (let c = 0; c < tableCols; c++) {
        tableHtml += `<td style="border: 1px solid #cbd5e1; padding: 10px; min-width: 50px;">Sel ${r + 1},${c + 1}</td>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table><p><br></p>';
    executeCommand('insertHTML', tableHtml);
    setShowTablePopup(false);
  };

  // Prevent focus loss when clicking formatting buttons
  const preventDefaultAndExecute = (e: React.MouseEvent, command: string, val: string = '') => {
    e.preventDefault();
    executeCommand(command, val);
  };

  // Calculate statistics
  const getStats = () => {
    const cleanText = htmlValue.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const charCount = cleanText.length;
    const wordCount = cleanText === '' ? 0 : cleanText.split(/\s+/).length;
    return { charCount, wordCount };
  };

  const stats = getStats();

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col min-h-[480px]">
      
      {/* WORD/WPS STYLE TABS MENU */}
      <div className="flex bg-slate-100 border-b border-slate-200 px-3 pt-1.5 gap-1.5 select-none items-center">
        {/* Menu Tabs */}
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all rounded-t-lg border-t border-x cursor-pointer ${
            activeTab === 'home'
              ? 'bg-white text-blue-600 border-slate-200 border-b bg-white -mb-[1px] shadow-sm'
              : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-200/50'
          }`}
        >
          Beranda
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('insert')}
          className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all rounded-t-lg border-t border-x cursor-pointer ${
            activeTab === 'insert'
              ? 'bg-white text-blue-600 border-slate-200 border-b bg-white -mb-[1px] shadow-sm'
              : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-200/50'
          }`}
        >
          Sisipkan
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('view')}
          className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all rounded-t-lg border-t border-x cursor-pointer ${
            activeTab === 'view'
              ? 'bg-white text-blue-600 border-slate-200 border-b bg-white -mb-[1px] shadow-sm'
              : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-200/50'
          }`}
        >
          Tampilan & Info
        </button>

        {/* Status Mode Indicator Indicator */}
        <div className="ml-auto flex items-center space-x-1.5 pb-1">
          <span className={`h-2 w-2 rounded-full ${isCodeView ? 'bg-amber-400' : 'bg-emerald-500 animate-pulse'}`} />
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
            {isCodeView ? 'Mode HTML' : 'Mode Visual'}
          </span>
        </div>
      </div>

      {/* WORD/WPS STYLE RIBBON TOOLBAR PANEL */}
      <div className="bg-white border-b border-slate-200/80 p-2.5 select-none flex items-stretch gap-x-4 overflow-x-auto min-h-[90px]">
        
        {/* ==================== TAB: BERANDA (HOME) ==================== */}
        {activeTab === 'home' && (
          <>
            {/* Clipboard Group */}
            <div className="flex flex-col items-center justify-between border-r border-slate-200/80 pr-4 shrink-0">
              <div className="flex items-center space-x-1 flex-1">
                <button
                  type="button"
                  onMouseDown={(e) => preventDefaultAndExecute(e, 'undo')}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                  title="Undo (Batal)"
                  disabled={isCodeView}
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => preventDefaultAndExecute(e, 'redo')}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                  title="Redo (Ulangi)"
                  disabled={isCodeView}
                >
                  <Redo className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => preventDefaultAndExecute(e, 'removeFormat')}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                  title="Hapus Semua Format"
                  disabled={isCodeView}
                >
                  <Eraser className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[9px] text-slate-400 font-bold uppercase mt-1.5">Clipboard</span>
            </div>

            {/* Font / Huruf Group */}
            <div className="flex flex-col items-center justify-between border-r border-slate-200/80 pr-4 shrink-0 relative">
              <div className="flex flex-col space-y-1.5 flex-1">
                {/* Row 1: Font Family & Size Dropdowns */}
                <div className="flex items-center space-x-1">
                  <select
                    disabled={isCodeView}
                    onChange={(e) => executeCommand('fontName', e.target.value)}
                    className="text-[10px] font-semibold text-slate-700 border border-slate-200 rounded-lg px-1.5 py-0.5 bg-slate-50 focus:outline-none focus:border-blue-500 w-24 cursor-pointer"
                    title="Font Family"
                  >
                    {fontFamilies.map((f, i) => (
                      <option key={i} value={f.value}>{f.name}</option>
                    ))}
                  </select>

                  <select
                    disabled={isCodeView}
                    onChange={(e) => executeCommand('fontSize', e.target.value)}
                    className="text-[10px] font-semibold text-slate-700 border border-slate-200 rounded-lg px-1.5 py-0.5 bg-slate-50 focus:outline-none focus:border-blue-500 w-16 cursor-pointer"
                    title="Ukuran Huruf"
                    defaultValue="3"
                  >
                    {fontSizes.map((s, i) => (
                      <option key={i} value={s.value}>{s.name}</option>
                    ))}
                  </select>
                </div>

                {/* Row 2: Font Decoration Controls */}
                <div className="flex items-center space-x-0.5">
                  <button
                    type="button"
                    onMouseDown={(e) => preventDefaultAndExecute(e, 'bold')}
                    className="p-1 rounded hover:bg-slate-100 text-slate-700 transition-colors font-bold text-xs"
                    title="Tebal"
                    disabled={isCodeView}
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => preventDefaultAndExecute(e, 'italic')}
                    className="p-1 rounded hover:bg-slate-100 text-slate-700 transition-colors italic text-xs"
                    title="Miring"
                    disabled={isCodeView}
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => preventDefaultAndExecute(e, 'underline')}
                    className="p-1 rounded hover:bg-slate-100 text-slate-700 transition-colors underline text-xs"
                    title="Garis Bawah"
                    disabled={isCodeView}
                  >
                    <Underline className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => preventDefaultAndExecute(e, 'strikeThrough')}
                    className="p-1 rounded hover:bg-slate-100 text-slate-700 transition-colors line-through text-xs"
                    title="Coret"
                    disabled={isCodeView}
                  >
                    <Strikethrough className="w-3.5 h-3.5" />
                  </button>

                  <div className="w-px h-3.5 bg-slate-200 mx-1" />

                  {/* Subscript / Superscript */}
                  <button
                    type="button"
                    onMouseDown={(e) => preventDefaultAndExecute(e, 'subscript')}
                    className="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                    title="Subskrip (Subscript)"
                    disabled={isCodeView}
                  >
                    <Subscript className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => preventDefaultAndExecute(e, 'superscript')}
                    className="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                    title="Superskrip (Superscript)"
                    disabled={isCodeView}
                  >
                    <Superscript className="w-3 h-3" />
                  </button>

                  <div className="w-px h-3.5 bg-slate-200 mx-1" />

                  {/* Font Color Picker Trigger */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowColorDropdown(!showColorDropdown);
                        setShowBgColorDropdown(false);
                      }}
                      className="p-1 rounded hover:bg-slate-100 text-slate-700 transition-colors flex items-center"
                      title="Warna Teks"
                      disabled={isCodeView}
                    >
                      <span className="font-bold border-b-2 border-red-500 text-xs px-0.5">A</span>
                      <ChevronDown className="w-2.5 h-2.5 ml-0.5 text-slate-400" />
                    </button>
                    {showColorDropdown && (
                      <div className="absolute top-7 left-0 z-20 bg-white border border-slate-200 p-2 rounded-lg shadow-lg grid grid-cols-4 gap-1.5 w-32">
                        {colors.map((c, i) => (
                          <button
                            key={i}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              executeCommand('foreColor', c.value);
                              setShowColorDropdown(false);
                            }}
                            className="h-5 w-5 rounded border border-slate-300 cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: c.value }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Font Highlight Color Trigger */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowBgColorDropdown(!showBgColorDropdown);
                        setShowColorDropdown(false);
                      }}
                      className="p-1 rounded hover:bg-slate-100 text-slate-700 transition-colors flex items-center"
                      title="Warna Sorotan Latar (Highlight)"
                      disabled={isCodeView}
                    >
                      <Type className="w-3.5 h-3.5 bg-yellow-200 rounded text-slate-800" />
                      <ChevronDown className="w-2.5 h-2.5 ml-0.5 text-slate-400" />
                    </button>
                    {showBgColorDropdown && (
                      <div className="absolute top-7 left-0 z-20 bg-white border border-slate-200 p-2 rounded-lg shadow-lg grid grid-cols-4 gap-1.5 w-32">
                        {bgColors.map((bg, i) => (
                          <button
                            key={i}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              executeCommand('backColor', bg.value);
                              setShowBgColorDropdown(false);
                            }}
                            className="h-5 w-5 rounded border border-slate-300 cursor-pointer hover:scale-110 transition-transform flex items-center justify-center"
                            style={{ backgroundColor: bg.value }}
                            title={bg.name}
                          >
                            {bg.value === 'transparent' && <span className="text-[8px] text-red-500 font-bold">X</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
              <span className="text-[9px] text-slate-400 font-bold uppercase mt-1.5">Font</span>
            </div>

            {/* Paragraph Group */}
            <div className="flex flex-col items-center justify-between border-r border-slate-200/80 pr-4 shrink-0">
              <div className="flex flex-col space-y-1.5 flex-1">
                {/* Row 1: Alignment */}
                <div className="flex items-center space-x-0.5">
                  <button
                    type="button"
                    onMouseDown={(e) => preventDefaultAndExecute(e, 'justifyLeft')}
                    className="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                    title="Rata Kiri"
                    disabled={isCodeView}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => preventDefaultAndExecute(e, 'justifyCenter')}
                    className="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                    title="Rata Tengah"
                    disabled={isCodeView}
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => preventDefaultAndExecute(e, 'justifyRight')}
                    className="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                    title="Rata Kanan"
                    disabled={isCodeView}
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => preventDefaultAndExecute(e, 'justifyFull')}
                    className="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                    title="Rata Kiri Kanan (Justify)"
                    disabled={isCodeView}
                  >
                    <AlignJustify className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Row 2: Lists & Indents */}
                <div className="flex items-center space-x-0.5">
                  <button
                    type="button"
                    onMouseDown={(e) => preventDefaultAndExecute(e, 'insertUnorderedList')}
                    className="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                    title="Daftar Simbol (Bullets)"
                    disabled={isCodeView}
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => preventDefaultAndExecute(e, 'insertOrderedList')}
                    className="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                    title="Daftar Angka (Numbering)"
                    disabled={isCodeView}
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>

                  <div className="w-px h-3.5 bg-slate-200 mx-1" />

                  <button
                    type="button"
                    onMouseDown={(e) => preventDefaultAndExecute(e, 'outdent')}
                    className="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                    title="Kurangi Inden"
                    disabled={isCodeView}
                  >
                    <Outdent className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => preventDefaultAndExecute(e, 'indent')}
                    className="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                    title="Tambah Inden"
                    disabled={isCodeView}
                  >
                    <Indent className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <span className="text-[9px] text-slate-400 font-bold uppercase mt-1.5">Paragraph</span>
            </div>

            {/* Styles Group */}
            <div className="flex flex-col items-center justify-between shrink-0">
              <div className="flex items-center space-x-1 flex-1">
                <button
                  type="button"
                  onMouseDown={(e) => preventDefaultAndExecute(e, 'formatBlock', '<h2>')}
                  className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors text-[10px] font-bold border border-slate-200 shadow-sm"
                  title="Heading 2 (H2)"
                  disabled={isCodeView}
                >
                  H2
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => preventDefaultAndExecute(e, 'formatBlock', '<h3>')}
                  className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors text-[10px] font-bold border border-slate-200 shadow-sm"
                  title="Heading 3 (H3)"
                  disabled={isCodeView}
                >
                  H3
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => preventDefaultAndExecute(e, 'formatBlock', '<p>')}
                  className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors text-[10px] font-bold border border-slate-200 shadow-sm"
                  title="Normal Text (P)"
                  disabled={isCodeView}
                >
                  Normal
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => preventDefaultAndExecute(e, 'formatBlock', '<blockquote>')}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors flex items-center"
                  title="Kutipan (Blockquote)"
                  disabled={isCodeView}
                >
                  <Quote className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[9px] text-slate-400 font-bold uppercase mt-1.5">Styles</span>
            </div>
          </>
        )}

        {/* ==================== TAB: SISIPKAN (INSERT) ==================== */}
        {activeTab === 'insert' && (
          <>
            {/* Media & Link Group */}
            <div className="flex flex-col items-center justify-between border-r border-slate-200/80 pr-4 shrink-0 relative">
              <div className="flex items-center space-x-1.5 flex-1">
                {/* Link button */}
                <button
                  type="button"
                  onClick={() => {
                    setShowLinkPopup(!showLinkPopup);
                    setShowImagePopup(false);
                    setShowTablePopup(false);
                  }}
                  className={`p-2.5 rounded-lg flex items-center space-x-1 cursor-pointer transition-colors ${
                    showLinkPopup ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                  title="Sisipkan Tautan"
                  disabled={isCodeView}
                >
                  <Link2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Tautan</span>
                </button>

                {/* Image button */}
                <button
                  type="button"
                  onClick={() => {
                    setShowImagePopup(!showImagePopup);
                    setShowLinkPopup(false);
                    setShowTablePopup(false);
                  }}
                  className={`p-2.5 rounded-lg flex items-center space-x-1 cursor-pointer transition-colors ${
                    showImagePopup ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                  title="Sisipkan Gambar"
                  disabled={isCodeView}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Gambar</span>
                </button>
              </div>
              <span className="text-[9px] text-slate-400 font-bold uppercase mt-1.5">Media & Link</span>

              {/* Link popover */}
              {showLinkPopup && (
                <div className="absolute top-12 left-0 z-20 w-64 p-3 bg-white border border-slate-200 rounded-xl shadow-lg mt-1">
                  <form onSubmit={handleInsertLink} className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-600">Sisipkan Tautan (Link)</div>
                    <input
                      type="url"
                      placeholder="https://example.com"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500"
                      required
                    />
                    <div className="flex justify-end space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setShowLinkPopup(false)}
                        className="px-2 py-1 text-[10px] border border-slate-200 rounded text-slate-500 cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-2.5 py-1 text-[10px] bg-blue-600 text-white rounded font-semibold cursor-pointer"
                      >
                        Sisipkan
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Image popover */}
              {showImagePopup && (
                <div className="absolute top-12 left-0 z-20 w-72 p-3 bg-white border border-slate-200 rounded-xl shadow-lg mt-1 space-y-3">
                  <div className="text-[10px] font-bold text-slate-600">Sisipkan Gambar</div>
                  
                  <div className="space-y-1.5">
                    <div className="text-[9px] text-slate-400 font-bold uppercase flex items-center">
                      <Upload className="w-3 h-3 mr-1" /> Unggah File Gambar
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>

                  <div className="border-t border-slate-100 my-2" />

                  <form onSubmit={handleInsertImageUrl} className="space-y-2">
                    <div className="text-[9px] text-slate-400 font-bold uppercase flex items-center">
                      <Globe className="w-3 h-3 mr-1" /> Tautan Gambar (URL)
                    </div>
                    <input
                      type="url"
                      placeholder="https://example.com/image.png"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500"
                      required
                    />
                    <div className="flex justify-end space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setShowImagePopup(false)}
                        className="px-2 py-1 text-[10px] border border-slate-200 rounded text-slate-500 cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-2.5 py-1 text-[10px] bg-blue-600 text-white rounded font-semibold cursor-pointer"
                      >
                        Sisipkan
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Layout Components Group */}
            <div className="flex flex-col items-center justify-between shrink-0 relative">
              <div className="flex items-center space-x-1.5 flex-1">
                {/* Table button */}
                <button
                  type="button"
                  onClick={() => {
                    setShowTablePopup(!showTablePopup);
                    setShowLinkPopup(false);
                    setShowImagePopup(false);
                  }}
                  className={`p-2.5 rounded-lg flex items-center space-x-1 cursor-pointer transition-colors ${
                    showTablePopup ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                  title="Sisipkan Tabel"
                  disabled={isCodeView}
                >
                  <TableIcon className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Tabel</span>
                </button>

                {/* Horizontal Divider Line */}
                <button
                  type="button"
                  onMouseDown={(e) => preventDefaultAndExecute(e, 'insertHorizontalRule')}
                  className="p-2.5 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center space-x-1 cursor-pointer transition-colors"
                  title="Garis Horizontal"
                  disabled={isCodeView}
                >
                  <Minus className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Garis Pemisah</span>
                </button>
              </div>
              <span className="text-[9px] text-slate-400 font-bold uppercase mt-1.5">Tata Letak & Tabel</span>

              {/* Table popover */}
              {showTablePopup && (
                <div className="absolute top-12 left-0 z-20 w-52 p-3 bg-white border border-slate-200 rounded-xl shadow-lg mt-1">
                  <form onSubmit={handleInsertTable} className="space-y-2.5">
                    <div className="text-[10px] font-bold text-slate-600">Sisipkan Tabel</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] text-slate-400 font-semibold uppercase block">Baris</label>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={tableRows}
                          onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                          className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500 text-center font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 font-semibold uppercase block">Kolom</label>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={tableCols}
                          onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                          className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500 text-center font-bold"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowTablePopup(false)}
                        className="px-2 py-1 text-[10px] border border-slate-200 rounded text-slate-500 cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-2.5 py-1 text-[10px] bg-blue-600 text-white rounded font-semibold cursor-pointer"
                      >
                        Sisipkan
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </>
        )}

        {/* ==================== TAB: VIEW & INFO ==================== */}
        {activeTab === 'view' && (
          <>
            {/* View Switcher Group */}
            <div className="flex flex-col items-center justify-between border-r border-slate-200/80 pr-4 shrink-0">
              <div className="flex items-center space-x-1.5 flex-1 justify-center">
                <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setIsCodeView(false)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                      !isCodeView 
                        ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Visual WYSIWYG</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCodeView(true)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                      isCodeView 
                        ? 'bg-slate-800 text-amber-300 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>Kode HTML</span>
                  </button>
                </div>
              </div>
              <span className="text-[9px] text-slate-400 font-bold uppercase mt-1.5">Mode Tampilan</span>
            </div>

            {/* Document Statistics Group */}
            <div className="flex flex-col items-center justify-between shrink-0">
              <div className="flex items-center space-x-4 flex-1 text-[11px] font-semibold text-slate-700 bg-slate-50 px-3 rounded-lg border border-slate-200/50">
                <div className="flex items-center space-x-1">
                  <BarChart2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Jumlah Kata:</span>
                  <span className="font-mono text-blue-700 font-bold text-xs">{stats.wordCount}</span>
                </div>
                <div className="h-4 w-px bg-slate-300" />
                <div>
                  <span>Karakter:</span>
                  <span className="font-mono text-slate-800 font-bold text-xs pl-1">{stats.charCount}</span>
                </div>
              </div>
              <span className="text-[9px] text-slate-400 font-bold uppercase mt-1.5">Statistik Artikel</span>
            </div>
          </>
        )}

      </div>

      {/* Editor Content Area */}
      <div className="flex-1 flex flex-col relative bg-slate-50/20">
        {isCodeView ? (
          <textarea
            value={htmlValue}
            onChange={handleTextAreaChange}
            className="flex-1 w-full p-4 font-mono text-xs text-slate-300 bg-slate-900 focus:outline-none resize-none min-h-[350px]"
            placeholder="<html> ketik tag HTML Anda di sini...</html>"
          />
        ) : (
          <div className="flex-1 p-1">
            <div
              ref={editorRef}
              contentEditable
              onInput={handleInput}
              onBlur={handleInput}
              className="w-full min-h-[350px] p-4 text-xs text-slate-800 bg-white focus:outline-none overflow-y-auto prose max-w-none 
                         focus:ring-0 focus:border-0 border-0 outline-none
                         [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table_td]:border [&_table_td]:border-slate-300 [&_table_td]:p-2.5 [&_table_td]:min-w-[50px]
                         [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2
                         [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2
                         [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:my-3 [&_blockquote]:text-slate-500
                         [&_h2]:text-base [&_h2]:font-extrabold [&_h2]:text-slate-900 [&_h2]:mt-4 [&_h2]:mb-2
                         [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-slate-800 [&_h3]:mt-3 [&_h3]:mb-1.5
                         [&_p]:mb-2 [&_p]:leading-relaxed"
            />
            {/* Custom Placeholder */}
            {!htmlValue || htmlValue === '<p><br></p>' || htmlValue === '' ? (
              <div className="absolute top-5 left-5 text-slate-400 text-xs pointer-events-none select-none font-medium">
                {placeholder}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
