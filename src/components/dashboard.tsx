"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles, PenLine, FileText, Mail, Megaphone, Copy, Check, Trash2,
  LogOut, Coins, Loader2, Zap, Clock, RotateCcw, ChevronDown,
  Image, RefreshCw, Search, Hash, CalendarDays, LayoutTemplate,
  Mic, BarChart3, Users, Settings, X, PanelLeftClose, PanelLeft,
  Star, Link2, Download, Sun, Moon, Share2, Plus, ChevronLeft, ChevronRight, Lightbulb
} from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string; email: string; name: string | null; credits: number; plan: string;
}
interface Generation {
  id: string; type: string; topic: string; tone: string; length: string; output: string; language: string; createdAt: string;
}

const CONTENT_TYPES = [
  { id: "social", label: "Social Post", icon: PenLine, color: "from-pink-500 to-rose-500", desc: "Instagram, Twitter, LinkedIn" },
  { id: "blog", label: "Blog Draft", icon: FileText, color: "from-blue-500 to-indigo-500", desc: "Outlines & full drafts" },
  { id: "email", label: "Email Copy", icon: Mail, color: "from-amber-500 to-orange-500", desc: "Newsletters & campaigns" },
  { id: "ad", label: "Ad Text", icon: Megaphone, color: "from-emerald-500 to-teal-500", desc: "Google, Facebook, Instagram ads" },
];
const TONES = ["professional", "casual", "humorous", "persuasive"];
const LENGTHS = ["short", "medium", "long"];
const LANGUAGES = [
  { code: "en", label: "English" }, { code: "bn", label: "Bengali" }, { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" }, { code: "fr", label: "French" }, { code: "ar", label: "Arabic" },
  { code: "zh", label: "Chinese" }, { code: "ja", label: "Japanese" }, { code: "ko", label: "Korean" },
  { code: "de", label: "German" }, { code: "pt", label: "Portuguese" },
];
const PLATFORMS = ["Instagram", "Twitter", "LinkedIn", "Facebook", "TikTok", "Blog", "Email", "YouTube"];
const SIDEBAR_ITEMS = [
  { id: "generate", icon: Sparkles, label: "Generate" },
  { id: "images", icon: Image, label: "AI Images" },
  { id: "rewriter", icon: RefreshCw, label: "Rewriter" },
  { id: "seo", icon: Search, label: "SEO Tools" },
  { id: "hashtags", icon: Hash, label: "Hashtags" },
  { id: "calendar", icon: CalendarDays, label: "Calendar" },
  { id: "templates", icon: LayoutTemplate, label: "Templates" },
  { id: "brand", icon: Mic, label: "Brand Voice" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
  { id: "team", icon: Users, label: "Team" },
  { id: "settings", icon: Settings, label: "Settings" },
];

export function Dashboard({ user, onLogout, darkMode, onToggleDark }: { user: User; onLogout: () => void; darkMode: boolean; onToggleDark: () => void }) {
  const [activePanel, setActivePanel] = useState("generate");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [credits, setCredits] = useState(user.credits);
  const [history, setHistory] = useState<Generation[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const fetchHistory = useCallback(async () => {
    try { const res = await fetch("/api/generations"); if (res.ok) { const data = await res.json(); setHistory(data.generations); } } catch {}
  }, []);
  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const fetchCredits = useCallback(async () => {
    try { const res = await fetch("/api/auth"); if (res.ok) { const data = await res.json(); if (data.user) setCredits(data.user.credits); } } catch {}
  }, []);

  const handleLogout = async () => { await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) }); onLogout(); };

  const handleDelete = async (id: string) => {
    try { const res = await fetch("/api/generations", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); if (res.ok) { setHistory(prev => prev.filter(g => g.id !== id)); toast.success("Deleted"); } } catch {}
  };

  const getTypeIcon = (type: string) => { const t = CONTENT_TYPES.find(c => c.id === type); return t?.icon || FileText; };
  const getTypeColor = (type: string) => { const t = CONTENT_TYPES.find(c => c.id === type); return t?.color || "from-gray-500 to-gray-600"; };
  const formatDate = (date: string) => { const d = new Date(date); return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }); };

  const bgColor = darkMode ? "bg-gray-950" : "bg-gray-50";
  const headerBg = darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const sidebarBg = darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const cardBg = darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-400" : "text-gray-500";
  const textMuted = darkMode ? "text-gray-500" : "text-gray-400";
  const inputBg = darkMode ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400";

  return (
    <div className={`min-h-screen ${bgColor} ${textPrimary} flex`}>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 220, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className={`${sidebarBg} border-r flex flex-col flex-shrink-0 overflow-hidden h-screen sticky top-0`}>
            <div className="p-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center"><Sparkles className="w-4 h-4 text-black" /></div>
              <span className="font-bold text-sm">ContentStudio</span>
            </div>
            <ScrollArea className="flex-1 px-2 py-2">
              <div className="space-y-0.5">
                {SIDEBAR_ITEMS.map(item => {
                  const Icon = item.icon;
                  return (
                    <button key={item.id} onClick={() => setActivePanel(item.id)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${activePanel === item.id ? (darkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600") : (darkMode ? "text-gray-400 hover:bg-white/5" : "text-gray-600 hover:bg-gray-50")}`}>
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
            <div className={`p-3 border-t ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
              <button onClick={onToggleDark} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${darkMode ? "text-gray-400 hover:bg-white/5" : "text-gray-600 hover:bg-gray-50"}`}>
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className={`sticky top-0 z-50 ${headerBg} border-b`}>
          <div className="flex items-center justify-between h-14 px-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-1.5 rounded-lg ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-100"}`}>
                {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
              </button>
              <h1 className="font-semibold capitalize">{activePanel === "generate" ? "Generate Content" : activePanel}</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${darkMode ? "bg-amber-500/10 border border-amber-500/20 text-amber-400" : "bg-amber-50 border border-amber-200 text-amber-700"}`}>
                <Coins className="w-3.5 h-3.5" />
                {credits}
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowHistory(true)} className="relative"><Clock className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}><LogOut className="w-4 h-4" /></Button>
            </div>
          </div>
        </header>

        {/* Panel Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activePanel === "generate" && <GeneratePanel credits={credits} setCredits={setCredits} fetchHistory={fetchHistory} darkMode={darkMode} inputBg={inputBg} textSecondary={textSecondary} textMuted={textMuted} cardBg={cardBg} textPrimary={textPrimary} />}
          {activePanel === "images" && <ImagePanel credits={credits} setCredits={setCredits} darkMode={darkMode} inputBg={inputBg} cardBg={cardBg} textSecondary={textSecondary} />}
          {activePanel === "rewriter" && <RewriterPanel credits={credits} setCredits={setCredits} fetchHistory={fetchHistory} darkMode={darkMode} inputBg={inputBg} cardBg={cardBg} textSecondary={textSecondary} />}
          {activePanel === "seo" && <SEOPanel credits={credits} setCredits={setCredits} darkMode={darkMode} inputBg={inputBg} cardBg={cardBg} textSecondary={textSecondary} />}
          {activePanel === "hashtags" && <HashtagPanel darkMode={darkMode} inputBg={inputBg} cardBg={cardBg} textSecondary={textSecondary} />}
          {activePanel === "calendar" && <CalendarPanel darkMode={darkMode} cardBg={cardBg} textSecondary={textSecondary} />}
          {activePanel === "templates" && <TemplatesPanel credits={credits} setCredits={setCredits} fetchHistory={fetchHistory} darkMode={darkMode} inputBg={inputBg} cardBg={cardBg} textSecondary={textSecondary} textMuted={textMuted} />}
          {activePanel === "brand" && <BrandVoicePanel darkMode={darkMode} inputBg={inputBg} cardBg={cardBg} textSecondary={textSecondary} />}
          {activePanel === "analytics" && <AnalyticsPanel darkMode={darkMode} cardBg={cardBg} textSecondary={textSecondary} />}
          {activePanel === "team" && <TeamPanel user={user} darkMode={darkMode} inputBg={inputBg} cardBg={cardBg} textSecondary={textSecondary} />}
          {activePanel === "settings" && <SettingsPanel user={user} onToggleDark={onToggleDark} darkMode={darkMode} cardBg={cardBg} textSecondary={textSecondary} inputBg={inputBg} />}
        </main>
      </div>

      {/* History Drawer */}
      <AnimatePresence>
        {showHistory && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowHistory(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showHistory && (
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className={`fixed right-0 top-0 bottom-0 w-full sm:w-96 z-50 shadow-2xl flex flex-col ${sidebarBg}`}>
            <div className={`p-4 border-b flex items-center justify-between ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
              <h2 className="font-semibold text-lg">History</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowHistory(false)}>✕</Button>
            </div>
            <ScrollArea className="flex-1">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400"><Clock className="w-8 h-8 mb-3" /><p className="text-sm">No generations yet</p></div>
              ) : (
                <div className="p-4 space-y-3">
                  {history.map(gen => {
                    const Icon = getTypeIcon(gen.type);
                    return (
                      <motion.div key={gen.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-3 rounded-lg border ${darkMode ? "border-gray-800 hover:border-emerald-500/30" : "border-gray-200 hover:border-emerald-200"} transition-colors cursor-pointer group`} onClick={() => { setActivePanel("generate"); setShowHistory(false); }}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-md bg-gradient-to-br ${getTypeColor(gen.type)} flex items-center justify-center`}><Icon className="w-3.5 h-3.5 text-white" /></div>
                            <div><p className={`text-sm font-medium ${textPrimary} line-clamp-1`}>{gen.topic}</p><p className={`text-xs ${textMuted}`}>{formatDate(gen.createdAt)}</p></div>
                          </div>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 h-7 w-7" onClick={(e) => { e.stopPropagation(); handleDelete(gen.id); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                        <p className={`text-xs ${textSecondary} line-clamp-2`}>{gen.output}</p>
                        <div className="flex gap-1.5 mt-2">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize">{gen.type}</Badge>
                          {gen.language && gen.language !== "en" && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 uppercase">{gen.language}</Badge>}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Generate Panel ──
function GeneratePanel({ credits, setCredits, fetchHistory, darkMode, inputBg, textSecondary, textMuted, cardBg, textPrimary }: any) {
  const [selectedType, setSelectedType] = useState("");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [language, setLanguage] = useState("en");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showToneDropdown, setShowToneDropdown] = useState(false);
  const [showLengthDropdown, setShowLengthDropdown] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!selectedType || !topic.trim()) { toast.error("Select a type and enter a topic"); return; }
    if (credits <= 0) { toast.error("No credits remaining!"); return; }
    setGenerating(true); setOutput("");
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: selectedType, topic: topic.trim(), tone, length, language }) });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed"); return; }
      setOutput(data.generation.output);
      setCredits(data.credits);
      fetchHistory();
      toast.success("Content generated!");
    } catch { toast.error("Network error"); } finally { setGenerating(false); }
  };

  const handleCopy = async () => { if (!output) return; await navigator.clipboard.writeText(output); setCopied(true); toast.success("Copied!"); setTimeout(() => setCopied(false), 2000); };
  const handleExportText = () => { if (!output) return; const blob = new Blob([output], { type: "text/plain" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "content.txt"; a.click(); };
  const handleExportHTML = () => { if (!output) return; const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Content</title><style>body{font-family:system-ui;max-width:700px;margin:2rem auto;padding:0 1rem;line-height:1.7;}</style></head><body>${output.replace(/\n/g, "<br>")}</body></html>`; const blob = new Blob([html], { type: "text/html" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "content.html"; a.click(); };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className={cardBg}>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Zap className="w-5 h-5 text-emerald-500" />Content Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {CONTENT_TYPES.map(ct => { const Icon = ct.icon; return (<button key={ct.id} onClick={() => setSelectedType(ct.id)} className={`p-3 rounded-xl border-2 text-left transition-all ${selectedType === ct.id ? "border-emerald-500 shadow-sm" + (darkMode ? " bg-emerald-500/10" : " bg-emerald-50") : cardBg}`}> <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${ct.color} flex items-center justify-center mb-2`}><Icon className="w-4 h-4 text-white" /></div><p className={`text-xs font-semibold ${textPrimary}`}>{ct.label}</p></button>); })}
            </div>
            <div className="space-y-2"><Label className={textSecondary}>Topic</Label><Textarea placeholder="e.g., 5 tips for better productivity..." value={topic} onChange={e => setTopic(e.target.value)} rows={3} className={`resize-none ${inputBg}`} /></div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2"><Label className={textSecondary}>Tone</Label><div className="relative"><button type="button" onClick={() => { setShowToneDropdown(!showToneDropdown); setShowLangDropdown(false); setShowLengthDropdown(false); }} className={`w-full flex items-center justify-between rounded-md border px-3 py-2 text-sm ${inputBg}`}><span className="capitalize">{tone}</span><ChevronDown className="w-3 h-3" /></button><AnimatePresence>{showToneDropdown && (<motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className={`absolute top-full left-0 right-0 mt-1 border rounded-md shadow-lg z-10 overflow-hidden ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>{TONES.map(t => (<button key={t} type="button" onClick={() => { setTone(t); setShowToneDropdown(false); }} className={`w-full text-left px-3 py-1.5 text-sm hover:bg-emerald-500/10 capitalize ${tone === t ? "text-emerald-500 font-medium" : textSecondary}`}>{t}</button>))}</motion.div>)}</AnimatePresence></div></div>
              <div className="space-y-2"><Label className={textSecondary}>Length</Label><div className="relative"><button type="button" onClick={() => { setShowLengthDropdown(!showLengthDropdown); setShowToneDropdown(false); setShowLangDropdown(false); }} className={`w-full flex items-center justify-between rounded-md border px-3 py-2 text-sm ${inputBg}`}><span className="capitalize">{length}</span><ChevronDown className="w-3 h-3" /></button><AnimatePresence>{showLengthDropdown && (<motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className={`absolute top-full left-0 right-0 mt-1 border rounded-md shadow-lg z-10 overflow-hidden ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>{LENGTHS.map(l => (<button key={l} type="button" onClick={() => { setLength(l); setShowLengthDropdown(false); }} className={`w-full text-left px-3 py-1.5 text-sm hover:bg-emerald-500/10 capitalize ${length === l ? "text-emerald-500 font-medium" : textSecondary}`}>{l}</button>))}</motion.div>)}</AnimatePresence></div></div>
              <div className="space-y-2"><Label className={textSecondary}>Language</Label><div className="relative"><button type="button" onClick={() => { setShowLangDropdown(!showLangDropdown); setShowToneDropdown(false); setShowLengthDropdown(false); }} className={`w-full flex items-center justify-between rounded-md border px-3 py-2 text-sm ${inputBg}`}><span>{LANGUAGES.find(l => l.code === language)?.label || "English"}</span><ChevronDown className="w-3 h-3" /></button><AnimatePresence>{showLangDropdown && (<motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className={`absolute top-full left-0 right-0 mt-1 border rounded-md shadow-lg z-10 overflow-hidden max-h-48 overflow-y-auto ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>{LANGUAGES.map(l => (<button key={l.code} type="button" onClick={() => { setLanguage(l.code); setShowLangDropdown(false); }} className={`w-full text-left px-3 py-1.5 text-sm hover:bg-emerald-500/10 ${language === l.code ? "text-emerald-500 font-medium" : textSecondary}`}>{l.label}</button>))}</motion.div>)}</AnimatePresence></div></div>
            </div>
            <Button onClick={handleGenerate} disabled={generating || !selectedType || !topic.trim()} className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold h-11">
              {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4 mr-2" />Generate (1 credit)</>}
            </Button>
          </CardContent>
        </Card>
        <Card className={cardBg}>
          <CardHeader>
            <div className="flex items-center justify-between"><CardTitle className="text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-emerald-500" />Output</CardTitle>
              {output && (<div className="flex gap-1"><Button variant="ghost" size="sm" onClick={handleCopy}>{copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}<span className="ml-1 text-xs">{copied ? "Copied!" : "Copy"}</span></Button><Button variant="ghost" size="sm" onClick={handleExportText}><Download className="w-3.5 h-3.5" /><span className="ml-1 text-xs">.txt</span></Button><Button variant="ghost" size="sm" onClick={handleExportHTML}><Download className="w-3.5 h-3.5" /><span className="ml-1 text-xs">.html</span></Button><Button variant="ghost" size="sm" onClick={() => { setOutput(""); setTopic(""); setSelectedType(""); }}><RotateCcw className="w-3.5 h-3.5" /></Button></div>)}
            </div>
          </CardHeader>
          <CardContent>
            {generating ? (<div className="flex flex-col items-center justify-center py-16 text-gray-400"><Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-4" /><p className="text-sm">Creating your content...</p></div>) : output ? (<ScrollArea className="h-[400px]"><div className={`prose prose-sm max-w-none whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed`}>{output}</div></ScrollArea>) : (<div className="flex flex-col items-center justify-center py-16 text-gray-400"><div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}><Sparkles className={`w-8 h-8 ${textMuted}`} /></div><p className={`text-sm font-medium ${textSecondary}`}>Your content will appear here</p><p className={`text-xs ${textMuted} mt-1`}>Select a type, topic, language, and generate</p></div>)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ── AI Image Panel ──
function ImagePanel({ credits, setCredits, darkMode, inputBg, cardBg, textSecondary }: any) {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [style, setStyle] = useState("realistic");
  const styles = ["realistic", "cartoon", "abstract", "minimalist", "3d-render", "watercolor"];

  const handleGenerate = async () => {
    if (!prompt.trim()) { toast.error("Enter a prompt"); return; }
    if (credits < 2) { toast.error("Need 2 credits for image generation"); return; }
    setGenerating(true); setImageUrl("");
    try {
      const res = await fetch("/api/image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: prompt.trim(), style }) });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed"); return; }
      setImageUrl(data.url);
      setCredits(data.credits);
      toast.success("Image generated!");
    } catch { toast.error("Network error"); } finally { setGenerating(false); }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className={cardBg}>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Image className="w-5 h-5 text-emerald-500" />AI Image Generator</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className={`text-sm ${textSecondary}`}>Generate images from text descriptions. Uses 2 credits per image.</p>
          <div className="space-y-2"><Label className={textSecondary}>Describe your image</Label><Textarea placeholder="A futuristic city at sunset with flying cars..." value={prompt} onChange={e => setPrompt(e.target.value)} rows={3} className={`resize-none ${inputBg}`} /></div>
          <div className="space-y-2"><Label className={textSecondary}>Style</Label>
            <div className="flex flex-wrap gap-2">{styles.map(s => (<button key={s} onClick={() => setStyle(s)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize ${style === s ? "bg-emerald-500 text-black border-emerald-500" : cardBg}`}>{s}</button>))}</div>
          </div>
          <Button onClick={handleGenerate} disabled={generating || !prompt.trim()} className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold h-11">
            {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Image className="w-4 h-4 mr-2" />Generate Image (2 credits)</>}
          </Button>
          {imageUrl && (<div className="mt-4 rounded-xl overflow-hidden border"><img src={imageUrl} alt="Generated" className="w-full" /><div className="flex justify-center p-3"><Button variant="outline" size="sm" onClick={() => { window.open(imageUrl, "_blank"); }}><Download className="w-3.5 h-3.5 mr-1" />Open Full Image</Button></div></div>)}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Content Rewriter Panel ──
function RewriterPanel({ credits, setCredits, fetchHistory, darkMode, inputBg, cardBg, textSecondary }: any) {
  const [input, setInput] = useState("");
  const [targetPlatform, setTargetPlatform] = useState("twitter");
  const [rewriting, setRewriting] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleRewrite = async () => {
    if (!input.trim()) { toast.error("Paste some content first"); return; }
    if (credits <= 0) { toast.error("No credits!"); return; }
    setRewriting(true); setOutput("");
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "rewrite", topic: input.trim().substring(0, 500) + "\n\nRepurpose for: " + targetPlatform, tone: "professional", length: "medium", language: "en" }) });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed"); return; }
      setOutput(data.generation.output); setCredits(data.credits); fetchHistory(); toast.success("Content repurposed!");
    } catch { toast.error("Network error"); } finally { setRewriting(false); }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className={cardBg}>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><RefreshCw className="w-5 h-5 text-emerald-500" />Content Rewriter</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className={`text-sm ${textSecondary}`}>Paste existing content and repurpose it for any platform.</p>
          <div className="space-y-2"><Label className={textSecondary}>Original Content</Label><Textarea placeholder="Paste your blog post, article, or any content here..." value={input} onChange={e => setInput(e.target.value)} rows={6} className={`resize-none ${inputBg}`} /></div>
          <div className="space-y-2"><Label className={textSecondary}>Repurpose for</Label><div className="flex flex-wrap gap-2">{PLATFORMS.slice(0, 6).map(p => (<button key={p} onClick={() => setTargetPlatform(p.toLowerCase())} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize ${targetPlatform === p.toLowerCase() ? "bg-emerald-500 text-black border-emerald-500" : cardBg}`}>{p}</button>))}</div></div>
          <Button onClick={handleRewrite} disabled={rewriting || !input.trim()} className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold h-11">{rewriting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Rewriting...</> : <><RefreshCw className="w-4 h-4 mr-2" />Rewrite (1 credit)</>}</Button>
          {output && (<div className={`mt-4 p-4 rounded-xl border ${darkMode ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"}`}><div className="flex justify-between mb-2"><p className="text-sm font-medium capitalize">For {targetPlatform}</p><Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>{copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}</Button></div><p className={`text-sm whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{output}</p></div>)}
        </CardContent>
      </Card>
    </div>
  );
}

// ── SEO Tools Panel ──
function SEOPanel({ credits, setCredits, darkMode, inputBg, cardBg, textSecondary }: any) {
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) { toast.error("Enter a topic"); return; }
    if (credits <= 0) { toast.error("No credits!"); return; }
    setGenerating(true); setResult(null);
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "seo", topic: topic.trim(), tone: "professional", length: "medium", language: "en" }) });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed"); return; }
      setResult(data.generation.output); setCredits(data.credits); toast.success("SEO data generated!");
    } catch { toast.error("Network error"); } finally { setGenerating(false); }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className={cardBg}>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Search className="w-5 h-5 text-emerald-500" />SEO Optimizer</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className={`text-sm ${textSecondary}`}>Generate meta titles, descriptions, keywords, and headers for your content.</p>
          <div className="space-y-2"><Label className={textSecondary}>Topic / Title</Label><Input placeholder="e.g., Best Productivity Apps 2026" value={topic} onChange={e => setTopic(e.target.value)} className={inputBg} /></div>
          <Button onClick={handleGenerate} disabled={generating || !topic.trim()} className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold h-11">{generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing...</> : <><Search className="w-4 h-4 mr-2" />Generate SEO Data (1 credit)</>}</Button>
          {result && (<div className={`mt-4 p-4 rounded-xl border ${darkMode ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"}`}><p className={`text-sm whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{result}</p></div>)}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Hashtag Generator Panel ──
function HashtagPanel({ darkMode, inputBg, cardBg, textSecondary }: any) {
  const [topic, setTopic] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) { toast.error("Enter a topic"); return; }
    setGenerating(true);
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "hashtags", topic: topic.trim(), tone: "professional", length: "short", language: "en" }) });
      const data = await res.json();
      if (data.generation?.output) {
        const tags = data.generation.output.match(/#\w+/g) || [];
        setHashtags(tags.length > 0 ? tags : data.generation.output.split(",").map((t: string) => t.trim().replace(/^#/, "#")));
      }
      toast.success("Hashtags generated!");
    } catch { toast.error("Network error"); } finally { setGenerating(false); }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className={cardBg}>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Hash className="w-5 h-5 text-emerald-500" />Hashtag Generator</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className={`text-sm ${textSecondary}`}>Generate trending hashtags for your social media posts. Free — no credits needed.</p>
          <div className="space-y-2"><Label className={textSecondary}>Topic</Label><Input placeholder="e.g., sustainable fashion, tech startup..." value={topic} onChange={e => setTopic(e.target.value)} className={inputBg} /></div>
          <Button onClick={handleGenerate} disabled={generating || !topic.trim()} className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold h-11">{generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Hash className="w-4 h-4 mr-2" />Generate Hashtags (Free)</>}</Button>
          {hashtags.length > 0 && (<div className="mt-4"><div className="flex items-center justify-between mb-2"><p className="text-sm font-medium">{hashtags.length} hashtags</p><Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(hashtags.join(" ")); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>{copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <><><Copy className="w-3.5 h-3.5" /><span className="ml-1 text-xs">{copied ? "Copied!" : "Copy All"}</span></></></Button></div><div className="flex flex-wrap gap-2">{hashtags.map((tag, i) => (<span key={i} className={`px-3 py-1.5 rounded-full text-xs font-medium ${darkMode ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border border-emerald-200"}`}>{tag.startsWith("#") ? tag : "#" + tag}</span>))}</div></div>)}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Calendar Panel ──
function CalendarPanel({ darkMode, cardBg, textSecondary }: any) {
  const [events, setEvents] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetch("/api/calendar").then(r => r.json()).then(d => setEvents(d.events || [])).catch(() => {});
  }, []);

  const handleAdd = async () => {
    if (!title || !date) { toast.error("Title and date required"); return; }
    const res = await fetch("/api/calendar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, date, platform, status: "scheduled" }) });
    if (res.ok) { const data = await res.json(); setEvents(prev => [...prev, data]); setTitle(""); setDate(""); toast.success("Event scheduled!"); }
  };

  const handleDelete = async (id: string) => { await fetch("/api/calendar", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); setEvents(prev => prev.filter(e => e.id !== id)); };

  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const daysInMonth = monthEnd.getDate();
  const startDay = monthStart.getDay();

  const eventDates = new Set(events.map(e => e.date));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className={cardBg}>
            <CardHeader>
              <div className="flex items-center justify-between"><CardTitle className="text-lg flex items-center gap-2"><CalendarDays className="w-5 h-5 text-emerald-500" />Content Calendar</CardTitle>
                <div className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}><ChevronLeft className="w-4 h-4" /></Button><span className="text-sm font-medium px-2">{currentMonth.toLocaleString("en-US", { month: "long", year: "numeric" })}</span><Button variant="ghost" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}><ChevronRight className="w-4 h-4" /></Button></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-2">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (<div key={d} className={`text-center text-xs font-medium py-2 ${textMuted}`}>{d}</div>))}</div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startDay }, (_, i) => <div key={`empty-${i}`} />)}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const hasEvent = eventDates.has(dateStr);
                  return (<div key={day} className={`relative h-10 flex items-center justify-center rounded-lg text-sm cursor-pointer transition-colors ${hasEvent ? (darkMode ? "bg-emerald-500/10 text-emerald-400 font-medium" : "bg-emerald-50 text-emerald-600 font-medium") : (darkMode ? "hover:bg-white/5" : "hover:bg-gray-50")}`} onClick={() => setDate(dateStr)}><span>{day}</span>{hasEvent && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-500" />}</div>);
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className={cardBg}><CardHeader><CardTitle className="text-sm">Schedule Post</CardTitle></CardHeader><CardContent className="space-y-3"><Input placeholder="Post title" value={title} onChange={e => setTitle(e.target.value)} className={inputBg} /><input type="date" value={date} onChange={e => setDate(e.target.value)} className={`w-full rounded-md border px-3 py-2 text-sm ${inputBg}`} /><div className="flex flex-wrap gap-1">{PLATFORMS.slice(0, 5).map(p => (<button key={p} onClick={() => setPlatform(p)} className={`px-2 py-1 rounded text-xs border transition-all ${platform === p ? "bg-emerald-500 text-black border-emerald-500" : cardBg}`}>{p}</button>))}</div><Button onClick={handleAdd} disabled={!title || !date} className="w-full bg-emerald-500 hover:bg-emerald-400 text-black text-sm h-9"><Plus className="w-3.5 h-3.5 mr-1" />Schedule</Button></CardContent></Card>
          <Card className={cardBg}><CardHeader><CardTitle className="text-sm">Upcoming</CardTitle></CardHeader><CardContent className="space-y-2 max-h-64 overflow-y-auto">{events.length === 0 ? <p className={`text-xs ${textMuted}`}>No scheduled posts</p> : events.slice(0, 10).map(e => (<div key={e.id} className={`flex items-center justify-between p-2 rounded-lg ${darkMode ? "bg-gray-800/50" : "bg-gray-50"}`}><div><p className={`text-xs font-medium ${textSecondary}`}>{e.title}</p><p className={`text-[10px] ${textMuted}`}>{e.date} · {e.platform}</p></div><button onClick={() => handleDelete(e.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-3 h-3" /></button></div>))}</CardContent></Card>
        </div>
      </div>
    </div>
  );
}

// ── Templates Panel ──
function TemplatesPanel({ credits, setCredits, fetchHistory, darkMode, inputBg, cardBg, textSecondary, textMuted }: any) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<any>(null);
  const [topic, setTopic] = useState("");

  useEffect(() => { fetch("/api/templates?category=" + category).then(r => r.json()).then(d => setTemplates(d.templates || [])).catch(() => {}); }, [category]);

  const handleUse = async () => {
    if (!selected || !topic.trim()) { toast.error("Fill in the topic"); return; }
    if (credits <= 0) { toast.error("No credits!"); return; }
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: selected.type, topic: selected.prompt.replace("{topic}", topic.trim()), tone: "professional", length: "medium", language: "en" }) });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); return; }
      toast.success("Content generated from template!");
      setCredits(data.credits); fetchHistory(); setSelected(null); setTopic("");
    } catch { toast.error("Network error"); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-4"><button onClick={() => setSelected(null)} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${category === "all" ? "bg-emerald-500 text-black border-emerald-500" : cardBg}`}>All</button>
        {["social", "blog", "email", "ad"].map(c => (<button key={c} onClick={() => { setCategory(c); setSelected(null); }} className={`px-3 py-1.5 rounded-full text-xs font-medium border capitalize ${category === c ? "bg-emerald-500 text-black border-emerald-500" : cardBg}`}>{c}</button>))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(t => (<Card key={t.id} className={`cursor-pointer transition-all hover:border-emerald-500/30 ${selected?.id === t.id ? "border-emerald-500" : cardBg}`} onClick={() => setSelected(t)}><CardContent className="p-4"><div className="flex items-center justify-between mb-2"><Badge variant="secondary" className="text-[10px] capitalize">{t.type}</Badge>{t.isPremium && <Badge className="text-[10px] bg-amber-500 text-black">PRO</Badge>}</div><p className={`text-sm font-medium mb-1 ${textSecondary}`}>{t.title}</p><p className={`text-xs ${textMuted} line-clamp-2`}>{t.prompt}</p></CardContent></Card>))}
      </div>
      {selected && (<div className={`fixed bottom-0 left-0 right-0 p-4 border-t ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}><div className="max-w-4xl mx-auto flex items-center gap-3"><div className="flex-1"><Input placeholder="Enter your topic..." value={topic} onChange={e => setTopic(e.target.value)} className={inputBg} /></div><Button onClick={handleUse} disabled={!topic.trim()} className="bg-emerald-500 hover:bg-emerald-400 text-black"><Sparkles className="w-4 h-4 mr-2" />Use Template</Button><Button variant="ghost" onClick={() => setSelected(null)}>✕</Button></div></div>)}
    </div>
  );
}

// ── Brand Voice Panel ──
function BrandVoicePanel({ darkMode, inputBg, cardBg, textSecondary }: any) {
  const [voices, setVoices] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [tone, setTone] = useState("");
  const [style, setStyle] = useState("");
  const [audience, setAudience] = useState("");
  const [keywords, setKeywords] = useState("");

  useEffect(() => { fetch("/api/brand-voice").then(r => r.json()).then(d => setVoices(d.voices || [])).catch(() => {}); }, []);

  const handleSave = async () => {
    if (!name) { toast.error("Name required"); return; }
    const res = await fetch("/api/brand-voice", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, tone, style, audience, keywords: keywords.split(",").map(k => k.trim()).filter(Boolean) }) });
    if (res.ok) { const data = await res.json(); setVoices(prev => [...prev, data]); setName(""); setTone(""); setStyle(""); setAudience(""); setKeywords(""); toast.success("Brand voice saved!"); }
  };

  const handleDelete = async (id: string) => { await fetch("/api/brand-voice", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); setVoices(prev => prev.filter(v => v.id !== id)); };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className={cardBg}><CardHeader><CardTitle className="text-lg flex items-center gap-2"><Mic className="w-5 h-5 text-emerald-500" />Brand Voice</CardTitle></CardHeader><CardContent className="space-y-4">
        <p className={`text-sm ${textSecondary}`}>Save your brand's tone and style so all generated content matches automatically.</p>
        <div className="grid sm:grid-cols-2 gap-3"><div className="space-y-1"><Label className={textSecondary}>Voice Name</Label><Input placeholder="e.g., Professional Corporate" value={name} onChange={e => setName(e.target.value)} className={inputBg} /></div><div className="space-y-1"><Label className={textSecondary}>Tone</Label><Input placeholder="e.g., Authoritative yet friendly" value={tone} onChange={e => setTone(e.target.value)} className={inputBg} /></div><div className="space-y-1"><Label className={textSecondary}>Writing Style</Label><Input placeholder="e.g., Clear, concise, data-driven" value={style} onChange={e => setStyle(e.target.value)} className={inputBg} /></div><div className="space-y-1"><Label className={textSecondary}>Target Audience</Label><Input placeholder="e.g., Tech-savvy millennials" value={audience} onChange={e => setAudience(e.target.value)} className={inputBg} /></div></div>
        <div className="space-y-1"><Label className={textSecondary}>Keywords (comma-separated)</Label><Input placeholder="innovation, disruption, growth, scale..." value={keywords} onChange={e => setKeywords(e.target.value)} className={inputBg} /></div>
        <Button onClick={handleSave} disabled={!name} className="bg-emerald-500 hover:bg-emerald-400 text-black"><Plus className="w-4 h-4 mr-2" />Save Voice</Button>
      </CardContent></Card>
      {voices.length > 0 && (<div className="mt-4 grid sm:grid-cols-2 gap-3">{voices.map(v => (<Card key={v.id} className={cardBg}><CardContent className="p-4"><div className="flex justify-between mb-2"><p className="text-sm font-medium">{v.name}</p><button onClick={() => handleDelete(v.id)} className="text-red-400"><Trash2 className="w-3.5 h-3.5" /></button></div><p className={`text-xs ${textSecondary}`}>{v.tone}</p><div className="flex flex-wrap gap-1 mt-2">{v.keywords?.map((k: string, i: number) => (<Badge key={i} variant="secondary" className="text-[10px]">{k}</Badge>))}</div></CardContent></Card>))}</div>)}
    </div>
  );
}

// ── Analytics Panel ──
function AnalyticsPanel({ darkMode, cardBg, textSecondary }: any) {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => { fetch("/api/analytics").then(r => r.json()).then(d => setStats(d)).catch(() => {}); }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Generated", value: stats?.total || 0, icon: Sparkles },
          { label: "Scheduled Posts", value: stats?.calendarEvents || 0, icon: CalendarDays },
          { label: "Brand Voices", value: stats?.brandVoices || 0, icon: Mic },
          { label: "Team Members", value: stats?.teamMembers || 0, icon: Users },
        ].map(s => (<Card key={s.label} className={cardBg}><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className={`text-xs ${textSecondary}`}>{s.label}</p><p className="text-2xl font-bold mt-1">{s.value}</p></div><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? "bg-emerald-500/10" : "bg-emerald-50"}`}><s.icon className="w-5 h-5 text-emerald-500" /></div></div></CardContent></Card>))}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className={cardBg}><CardHeader><CardTitle className="text-sm">By Content Type</CardTitle></CardHeader><CardContent><div className="space-y-3">{stats?.byType ? Object.entries(stats.byType).map(([type, count]: any) => (<div key={type} className="flex items-center justify-between"><span className={`text-sm capitalize ${textSecondary}`}>{type}</span><div className="flex items-center gap-2"><div className={`h-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} style={{ width: "100px" }}><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${Math.min(100, (count / stats.total) * 100)}%` }} /></div><span className="text-xs font-medium w-6 text-right">{count}</span></div></div>)) : <p className={`text-sm ${textSecondary}`}>No data yet</p>}</div></CardContent></Card>
        <Card className={cardBg}><CardHeader><CardTitle className="text-sm">Activity (Last 7 Days)</CardTitle></CardHeader><CardContent><div className="space-y-2">{stats?.byDay ? Object.entries(stats.byDay).slice(-7).map(([day, count]: any) => (<div key={day} className="flex items-center justify-between"><span className={`text-xs ${textSecondary}`}>{day}</span><div className="flex items-center gap-1">{Array.from({ length: Math.min(20, count as number) }, (_, i) => (<div key={i} className="w-1.5 h-4 rounded-full bg-emerald-500" />))}</div></div>)) : <p className={`text-sm ${textSecondary}`}>No data yet</p>}</div></CardContent></Card>
      </div>
    </div>
  );
}

// ── Team Panel ──
function TeamPanel({ user, darkMode, inputBg, cardBg, textSecondary }: any) {
  const [members, setMembers] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");

  useEffect(() => { fetch("/api/team").then(r => r.json()).then(d => setMembers(d.members || [])).catch(() => {}); }, []);

  const handleInvite = async () => {
    if (!email) { toast.error("Email required"); return; }
    const res = await fetch("/api/team", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, role }) });
    if (res.ok) { const data = await res.json(); setMembers(prev => [...prev, data]); setEmail(""); toast.success("Invitation sent!"); } else { toast.error("Failed to invite"); }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className={cardBg}><CardHeader><CardTitle className="text-lg flex items-center gap-2"><Users className="w-5 h-5 text-emerald-500" />Team Workspaces</CardTitle></CardHeader><CardContent className="space-y-4">
        <p className={`text-sm ${textSecondary}`}>{user.plan === "business" ? "Invite team members and share credits." : "Upgrade to Business plan to invite team members."}</p>
        <div className="flex gap-2"><Input placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className={`flex-1 ${inputBg}`} disabled={user.plan !== "business"} /><select value={role} onChange={e => setRole(e.target.value)} className={`rounded-md border px-3 py-2 text-sm ${inputBg}`}><option value="member">Member</option><option value="admin">Admin</option><option value="viewer">Viewer</option></select><Button onClick={handleInvite} disabled={!email || user.plan !== "business"} className="bg-emerald-500 hover:bg-emerald-400 text-black"><Plus className="w-4 h-4 mr-1" />Invite</Button></div>
      </CardContent></Card>
      <div className="mt-4 space-y-2">{members.map(m => (<Card key={m.id} className={cardBg}><CardContent className="p-3 flex items-center justify-between"><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"}`}>{(m.name || m.email).charAt(0).toUpperCase()}</div><div><p className={`text-sm font-medium ${textSecondary}`}>{m.name || m.email}</p><p className={`text-xs ${textSecondary}`}>{m.role} · {m.acceptedAt ? "Joined" : "Pending"}</p></div></div><Badge variant="secondary" className="text-[10px] capitalize">{m.role}</Badge></CardContent></Card>))}</div>
    </div>
  );
}

// ── Settings Panel ──
function SettingsPanel({ user, onToggleDark, darkMode, cardBg, textSecondary, inputBg }: any) {
  const [referralCode, setReferralCode] = useState("");
  const [referralStats, setReferralStats] = useState<any>(null);

  useEffect(() => { fetch("/api/referral").then(r => r.json()).then(d => { if (d.code) { setReferralCode(d.code); setReferralStats(d); } }).catch(() => {}); }, []);

  const handleCopyLink = () => {
    if (referralCode) { navigator.clipboard.writeText(`https://contentstudio.app/signup?ref=${referralCode}`); toast.success("Referral link copied!"); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className={cardBg}><CardHeader><CardTitle className="text-lg flex items-center gap-2"><Settings className="w-5 h-5 text-emerald-500" />Preferences</CardTitle></CardHeader><CardContent className="space-y-4">
        <div className="flex items-center justify-between"><div><p className={`text-sm font-medium ${textSecondary}`}>Theme</p><p className={`text-xs ${textSecondary}`}>Switch between dark and light mode</p></div><Button variant="outline" size="sm" onClick={onToggleDark}>{darkMode ? <><Sun className="w-4 h-4 mr-2" />Light Mode</> : <><Moon className="w-4 h-4 mr-2" />Dark Mode</>}</Button></div>
        <Separator />
        <div className="flex items-center justify-between"><div><p className={`text-sm font-medium ${textSecondary}`}>Account</p><p className={`text-xs ${textSecondary}`}>{user.email}</p></div><Badge className="capitalize">{user.plan}</Badge></div>
        <Separator />
        <div className="flex items-center justify-between"><div><p className={`text-sm font-medium ${textSecondary}`}>Credits</p><p className={`text-xs ${textSecondary}`}>{user.credits} remaining</p></div></div>
      </CardContent></Card>
      <Card className={cardBg}><CardHeader><CardTitle className="text-lg flex items-center gap-2"><Share2 className="w-5 h-5 text-emerald-500" />Referral Program</CardTitle></CardHeader><CardContent className="space-y-4">
        <p className={`text-sm ${textSecondary}`}>Invite friends and earn 50 free credits for each signup!</p>
        {referralCode ? (<>
          <div className={`flex items-center gap-2 p-3 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}><span className={`text-sm font-mono flex-1 ${textSecondary}`}>contentstudio.app/signup?ref={referralCode}</span><Button size="sm" onClick={handleCopyLink}><Copy className="w-3.5 h-3.5 mr-1" />Copy</Button></div>
          <div className="grid grid-cols-3 gap-3">{[{ l: "Clicks", v: referralStats?.clicks || 0 }, { l: "Signups", v: referralStats?.signups || 0 }, { l: "Credits Earned", v: referralStats?.credits || 0 }].map(s => (<div key={s.l} className={`p-3 rounded-lg text-center ${darkMode ? "bg-gray-800/50" : "bg-gray-50"}`}><p className={`text-xs ${textSecondary}`}>{s.l}</p><p className="text-lg font-bold text-emerald-500">{s.v}</p></div>))}</div>
        </>) : (<p className={`text-sm ${textSecondary}`}>Loading referral code...</p>)}
      </CardContent></Card>
    </div>
  );
}