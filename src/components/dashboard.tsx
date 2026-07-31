"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  Crown, Building2, X, Download, Search, CreditCard, TrendingUp,
  LayoutGrid, History, Settings, ChevronRight, Type, Hash,
  ArrowUpRight, CheckCircle2, Star, Users, Infinity, Zap as ZapIcon
} from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string | null;
  credits: number;
  plan: string;
}

interface Generation {
  id: string;
  type: string;
  topic: string;
  tone: string;
  length: string;
  output: string;
  createdAt: string;
}

const CONTENT_TYPES = [
  { id: "social", label: "Social Post", icon: PenLine, color: "from-pink-500 to-rose-500", desc: "Instagram, Twitter, LinkedIn" },
  { id: "blog", label: "Blog Draft", icon: FileText, color: "from-blue-500 to-indigo-500", desc: "Outlines & full drafts" },
  { id: "email", label: "Email Copy", icon: Mail, color: "from-amber-500 to-orange-500", desc: "Newsletters & campaigns" },
  { id: "ad", label: "Ad Text", icon: Megaphone, color: "from-emerald-500 to-teal-500", desc: "Google, Facebook, Instagram ads" },
];

const TONES = ["professional", "casual", "humorous", "persuasive"];
const LENGTHS = ["short", "medium", "long"];

type Tab = "generate" | "history" | "settings";

const PRICING_PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Perfect to try it out",
    icon: Sparkles,
    features: ["10 credits on signup", "All 4 content types", "Basic tone options", "Short & medium length", "Generation history", "Community support"],
    cta: "Current Plan",
    btnClass: "bg-white/10 text-white/60 cursor-default",
    isFree: true,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    desc: "For creators & freelancers",
    icon: Crown,
    features: ["500 credits/month", "All 4 content types", "All tones & lengths", "Priority generation speed", "Full generation history", "Word count & download", "Email support", "Regenerate content"],
    cta: "Upgrade to Pro",
    btnClass: "bg-emerald-500 hover:bg-emerald-400 text-black font-semibold",
    isFree: false,
    popular: true,
  },
  {
    name: "Business",
    price: "$49",
    period: "/month",
    desc: "For teams & agencies",
    icon: Building2,
    features: ["Unlimited credits", "All 4 content types", "All tones & lengths", "Fastest generation speed", "Full generation history", "Word count & download", "Team collaboration (5 seats)", "Custom brand voice", "API access", "Priority support & onboarding"],
    cta: "Go Business",
    btnClass: "bg-violet-500 hover:bg-violet-400 text-white font-semibold",
    isFree: false,
  },
];

export function Dashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("generate");
  const [selectedType, setSelectedType] = useState("");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<Generation[]>([]);
  const [credits, setCredits] = useState(user.credits);
  const [showToneDropdown, setShowToneDropdown] = useState(false);
  const [showLengthDropdown, setShowLengthDropdown] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [historySearch, setHistorySearch] = useState("");

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/generations");
      if (res.ok) {
        const data = await res.json();
        setHistory(data.generations || []);
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filteredHistory = useMemo(() => {
    if (!historySearch.trim()) return history;
    const q = historySearch.toLowerCase();
    return history.filter(g =>
      g.topic.toLowerCase().includes(q) || g.type.toLowerCase().includes(q) || g.output.toLowerCase().includes(q)
    );
  }, [history, historySearch]);

  const wordCount = useMemo(() => {
    if (!output) return 0;
    return output.trim().split(/\s+/).filter(Boolean).length;
  }, [output]);

  const charCount = output.length;

  const handleGenerate = async () => {
    if (!selectedType || !topic.trim()) {
      toast.error("Please select a content type and enter a topic");
      return;
    }
    if (credits <= 0) {
      toast.error("No credits remaining. Upgrade to Pro for more!");
      return;
    }

    setGenerating(true);
    setOutput("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: selectedType, topic: topic.trim(), tone, length }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Generation failed");
        return;
      }

      setOutput(data.generation.output);
      setCredits(data.credits);
      fetchHistory();
      toast.success("Content generated successfully!");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedType || "content"}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/generations", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setHistory((prev) => prev.filter((g) => g.id !== id));
        toast.success("Deleted");
      }
    } catch { /* silent */ }
  };

  const handleDeleteAll = async () => {
    try {
      for (const gen of history) {
        await fetch("/api/generations", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: gen.id }),
        });
      }
      setHistory([]);
      toast.success("All history cleared");
    } catch { /* silent */ }
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) });
    onLogout();
  };

  const getTypeIcon = (type: string) => {
    const t = CONTENT_TYPES.find((c) => c.id === type);
    return t?.icon || FileText;
  };

  const getTypeColor = (type: string) => {
    const t = CONTENT_TYPES.find((c) => c.id === type);
    return t?.color || "from-gray-500 to-gray-600";
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const tabs: { id: Tab; label: string; icon: typeof Sparkles }[] = [
    { id: "generate", label: "Generate", icon: Sparkles },
    { id: "history", label: "History", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-2xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="font-bold text-sm hidden sm:block">ContentStudio</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowPricing(true)} className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5 hover:bg-emerald-500/20 transition-colors">
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400">{credits}</span>
              <span className="text-[10px] text-emerald-400/60 hidden sm:inline">credits</span>
              <ArrowUpRight className="w-3 h-3 text-emerald-400/60" />
            </button>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-white/40 hover:text-white hover:bg-white/5 h-8 w-8">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Welcome + Tabs */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
            Welcome back, {user.name || user.email.split("@")[0]}
          </h1>
          <p className="text-sm text-white/40">Generate AI content, manage your history, and upgrade your plan.</p>
        </div>

        <div className="flex items-center gap-1 bg-white/[0.04] rounded-xl p-1 mb-6 w-fit">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  tab === t.id
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* GENERATE TAB */}
        <AnimatePresence mode="wait">
          {tab === "generate" && (
            <motion.div key="generate" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {/* Content Type Selector */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                {CONTENT_TYPES.map((ct) => {
                  const Icon = ct.icon;
                  const isSelected = selectedType === ct.id;
                  return (
                    <motion.button
                      key={ct.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedType(ct.id)}
                      className={`relative p-4 rounded-xl border text-left transition-all duration-200 ${
                        isSelected
                          ? "border-emerald-500/50 bg-emerald-500/10"
                          : "border-white/[0.06] bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${ct.color} flex items-center justify-center mb-3`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <p className={`font-semibold text-sm ${isSelected ? "text-emerald-400" : "text-white/80"}`}>{ct.label}</p>
                      <p className="text-[11px] text-white/30 mt-0.5">{ct.desc}</p>
                    </motion.button>
                  );
                })}
              </div>

              <div className="grid lg:grid-cols-2 gap-5">
                {/* Input */}
                <Card className="border-white/[0.06] bg-white/[0.02]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-white/80 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      Content Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="topic" className="text-white/50 text-xs">Topic</Label>
                      <Textarea
                        id="topic"
                        placeholder="e.g., 5 tips for better productivity, launch of new eco-friendly water bottle..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        rows={4}
                        className="resize-none bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/20 focus:border-emerald-500/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-white/50 text-xs">Tone</Label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => { setShowToneDropdown(!showToneDropdown); setShowLengthDropdown(false); }}
                            className="w-full flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white/70 hover:border-white/15"
                          >
                            <span className="capitalize">{tone}</span>
                            <ChevronDown className="w-3.5 h-3.5 text-white/30" />
                          </button>
                          <AnimatePresence>
                            {showToneDropdown && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl z-10 overflow-hidden"
                              >
                                {TONES.map((t) => (
                                  <button key={t} type="button" onClick={() => { setTone(t); setShowToneDropdown(false); }}
                                    className={`w-full text-left px-3 py-2 text-sm transition-colors capitalize ${tone === t ? "bg-emerald-500/15 text-emerald-400 font-medium" : "text-white/60 hover:bg-white/5"}`}
                                  >{t}</button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white/50 text-xs">Length</Label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => { setShowLengthDropdown(!showLengthDropdown); setShowToneDropdown(false); }}
                            className="w-full flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white/70 hover:border-white/15"
                          >
                            <span className="capitalize">{length}</span>
                            <ChevronDown className="w-3.5 h-3.5 text-white/30" />
                          </button>
                          <AnimatePresence>
                            {showLengthDropdown && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl z-10 overflow-hidden"
                              >
                                {LENGTHS.map((l) => (
                                  <button key={l} type="button" onClick={() => { setLength(l); setShowLengthDropdown(false); }}
                                    className={`w-full text-left px-3 py-2 text-sm transition-colors capitalize ${length === l ? "bg-emerald-500/15 text-emerald-400 font-medium" : "text-white/60 hover:bg-white/5"}`}
                                  >{l}</button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleGenerate} disabled={generating || !selectedType || !topic.trim()}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold h-11 text-sm rounded-xl"
                    >
                      {generating ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
                      ) : (
                        <><Sparkles className="w-4 h-4 mr-2" />Generate Content <span className="ml-1 text-black/50">(1 credit)</span></>
                      )}
                    </Button>

                    {credits <= 3 && credits > 0 && (
                      <p className="text-xs text-amber-400/80 text-center">Only {credits} credit{credits !== 1 ? "s" : ""} remaining</p>
                    )}
                    {credits <= 0 && (
                      <button onClick={() => setShowPricing(true)} className="w-full text-center text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                        You&apos;re out of credits. Upgrade now to keep creating
                      </button>
                    )}
                  </CardContent>
                </Card>

                {/* Output */}
                <Card className="border-white/[0.06] bg-white/[0.02]">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-white/80 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        Output
                      </CardTitle>
                      {output && (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2 text-white/40 hover:text-white hover:bg-white/5">
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={handleDownload} className="h-7 px-2 text-white/40 hover:text-white hover:bg-white/5">
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={handleGenerate} disabled={generating || !selectedType || !topic.trim()} className="h-7 px-2 text-white/40 hover:text-white hover:bg-white/5">
                            <RotateCcw className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => { setOutput(""); setTopic(""); setSelectedType(""); }} className="h-7 px-2 text-white/40 hover:text-white hover:bg-white/5">
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {generating ? (
                      <div className="flex flex-col items-center justify-center py-20 text-white/30">
                        <div className="relative mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
                          </div>
                          <div className="absolute -inset-2 rounded-3xl border border-emerald-500/10 animate-ping" />
                        </div>
                        <p className="text-sm font-medium text-white/50">Creating your content...</p>
                        <p className="text-xs text-white/25 mt-1">This usually takes 2-5 seconds</p>
                      </div>
                    ) : output ? (
                      <>
                        <ScrollArea className="h-[360px]">
                          <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-white/70 leading-relaxed text-[13px]">
                            {output}
                          </div>
                        </ScrollArea>
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/[0.06]">
                          <div className="flex items-center gap-1.5 text-[11px] text-white/25">
                            <Type className="w-3 h-3" />{wordCount} words
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-white/25">
                            <Hash className="w-3 h-3" />{charCount} chars
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-white/20">
                        <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">
                          <Sparkles className="w-7 h-7" />
                        </div>
                        <p className="text-sm font-medium text-white/30">Your generated content will appear here</p>
                        <p className="text-xs text-white/15 mt-1">Select a type, enter a topic, and hit generate</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* HISTORY TAB */}
          {tab === "history" && (
            <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-white">Generation History</h2>
                  <Badge variant="secondary" className="bg-white/[0.06] text-white/40 text-xs">{history.length}</Badge>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                    <Input
                      placeholder="Search history..."
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      className="pl-9 h-9 bg-white/[0.03] border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:border-emerald-500/50 rounded-lg"
                    />
                  </div>
                  {history.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={handleDeleteAll} className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10 h-9 text-xs shrink-0">
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />Clear All
                    </Button>
                  )}
                </div>
              </div>

              {filteredHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-white/20">
                  <Clock className="w-10 h-10 mb-3" />
                  <p className="text-sm font-medium text-white/30">{historySearch ? "No matching results" : "No generations yet"}</p>
                  <p className="text-xs text-white/15 mt-1">{historySearch ? "Try a different search" : "Go to the Generate tab to create your first content"}</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {filteredHistory.map((gen) => {
                    const Icon = getTypeIcon(gen.type);
                    return (
                      <motion.div key={gen.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-emerald-500/20 hover:bg-white/[0.03] transition-all cursor-pointer group"
                        onClick={() => {
                          setSelectedType(gen.type);
                          setTopic(gen.topic);
                          setTone(gen.tone);
                          setLength(gen.length);
                          setOutput(gen.output);
                          setTab("generate");
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getTypeColor(gen.type)} flex items-center justify-center shrink-0`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white/90 line-clamp-1">{gen.topic}</p>
                              <p className="text-[11px] text-white/30">{formatDate(gen.createdAt)}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 h-7 w-7 text-white/30 hover:text-red-400 hover:bg-red-500/10"
                            onClick={(e) => { e.stopPropagation(); handleDelete(gen.id); }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                        <p className="text-xs text-white/40 line-clamp-2 ml-11">{gen.output}</p>
                        <div className="flex gap-1.5 mt-2.5 ml-11">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-white/[0.04] text-white/30 border-0 capitalize">{gen.type}</Badge>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-white/[0.04] text-white/30 border-0 capitalize">{gen.tone}</Badge>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-white/[0.04] text-white/30 border-0 capitalize">{gen.length}</Badge>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* SETTINGS TAB */}
          {tab === "settings" && (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <Card className="border-white/[0.06] bg-white/[0.02] max-w-lg">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-white">Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-lg font-bold text-black">
                      {(user.name || user.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{user.name || "No name set"}</p>
                      <p className="text-xs text-white/40">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div>
                      <p className="text-sm font-medium text-white">Current Plan</p>
                      <p className="text-xs text-white/40 mt-0.5">{user.plan === "pro" ? "Pro" : user.plan === "business" ? "Business" : "Free"}</p>
                    </div>
                    <Badge className={`${user.plan === "pro" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : user.plan === "business" ? "bg-violet-500/15 text-violet-400 border-violet-500/30" : "bg-white/[0.06] text-white/40 border-white/10"}`}>
                      {user.plan === "pro" ? "PRO" : user.plan === "business" ? "BUSINESS" : "FREE"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div>
                      <p className="text-sm font-medium text-white">Credits Remaining</p>
                      <p className="text-xs text-white/40 mt-0.5">Used for content generation</p>
                    </div>
                    <span className="text-lg font-bold text-emerald-400">{credits}</span>
                  </div>

                  <Separator className="bg-white/[0.06]" />

                  <div className="flex flex-col gap-3">
                    <Button onClick={() => setShowPricing(true)} className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold h-11 rounded-xl">
                      <CreditCard className="w-4 h-4 mr-2" />Upgrade Plan
                    </Button>
                    <Button variant="outline" onClick={handleLogout} className="border-white/10 text-white/60 hover:text-white hover:bg-white/5 h-11 rounded-xl">
                      <LogOut className="w-4 h-4 mr-2" />Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pricing Modal */}
      <AnimatePresence>
        {showPricing && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setShowPricing(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-3xl z-50 bg-[#111111] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                <div>
                  <h2 className="text-lg font-bold text-white">Upgrade Your Plan</h2>
                  <p className="text-xs text-white/40 mt-0.5">Get more credits and powerful features</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowPricing(false)} className="text-white/40 hover:text-white hover:bg-white/5 h-8 w-8">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <ScrollArea className="flex-1 p-5">
                <div className="grid sm:grid-cols-3 gap-4">
                  {PRICING_PLANS.map((plan) => {
                    const Icon = plan.icon;
                    return (
                      <div key={plan.name} className={`rounded-xl border p-5 flex flex-col h-full ${
                        plan.popular ? "border-emerald-500/30 bg-emerald-500/[0.05]" : "border-white/[0.06] bg-white/[0.02]"
                      }`}>
                        {plan.popular && (
                          <div className="bg-emerald-500 text-black text-[10px] font-bold px-2.5 py-0.5 rounded-full w-fit mb-3">MOST POPULAR</div>
                        )}
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            plan.popular ? "bg-emerald-500/20" : plan.name === "Business" ? "bg-violet-500/20" : "bg-white/10"
                          }`}>
                            <Icon className={`w-4 h-4 ${plan.popular ? "text-emerald-400" : plan.name === "Business" ? "text-violet-400" : "text-white/50"}`} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{plan.name}</p>
                            <p className="text-[10px] text-white/30">{plan.desc}</p>
                          </div>
                        </div>
                        <div className="mb-4">
                          <span className="text-2xl font-bold text-white">{plan.price}</span>
                          <span className="text-white/30 text-xs">{plan.period}</span>
                        </div>
                        <ul className="space-y-2 mb-5 flex-1">
                          {plan.features.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-[11px] text-white/50">
                              <Check className={`w-3 h-3 shrink-0 mt-0.5 ${plan.popular ? "text-emerald-400" : plan.name === "Business" ? "text-violet-400" : "text-white/20"}`} />{f}
                            </li>
                          ))}
                        </ul>
                        <Button className={`w-full h-9 text-xs rounded-lg ${plan.btnClass}`}>
                          {plan.cta} <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
                <p className="text-center text-white/20 text-[11px] mt-5">Payment integration coming soon. Contact support to upgrade manually.</p>
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
