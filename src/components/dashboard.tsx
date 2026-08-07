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
  LogOut, Coins, Loader2, Zap, Clock, RotateCcw, ChevronDown
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

export function Dashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [selectedType, setSelectedType] = useState("");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<Generation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [credits, setCredits] = useState(user.credits);
  const [showToneDropdown, setShowToneDropdown] = useState(false);
  const [showLengthDropdown, setShowLengthDropdown] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/generations");
      if (res.ok) {
        const data = await res.json();
        setHistory(data.generations);
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleGenerate = async () => {
    if (!selectedType || !topic.trim()) {
      toast.error("Please select a content type and enter a topic");
      return;
    }
    if (credits <= 0) {
      toast.error("No credits remaining. Upgrade for more!");
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
      toast.success("Content generated!");
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-lg hidden sm:block">ContentStudio</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-amber-700">{credits}</span>
              <span className="text-xs text-amber-500 hidden sm:inline">credits</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowHistory(!showHistory)} className="relative">
              <Clock className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Generate Content</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user.name || user.email.split("@")[0]}</p>
          </div>
        </div>

        {/* Content Type Selector */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {CONTENT_TYPES.map((ct) => {
            const Icon = ct.icon;
            const isSelected = selectedType === ct.id;
            return (
              <motion.button
                key={ct.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedType(ct.id)}
                className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${ct.color} flex items-center justify-center mb-3`}
>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className={`font-semibold text-sm ${isSelected ? "text-emerald-700" : "text-gray-900"}`}>{ct.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{ct.desc}</p>
              </motion.button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-500" />
                Content Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Textarea
                  id="topic"
                  placeholder="e.g., 5 tips for better productivity, launch of new eco-friendly water bottle..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tone</Label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => { setShowToneDropdown(!showToneDropdown); setShowLengthDropdown(false); }}
                      className="w-full flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                    >
                      <span className="capitalize">{tone}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    <AnimatePresence>
                      {showToneDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-hidden"
                        >
                          {TONES.map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => { setTone(t); setShowToneDropdown(false); }}
                              className={`w-full text-left px-3 py-2 text-sm hover:bg-emerald-50 transition-colors capitalize ${tone === t ? "bg-emerald-50 text-emerald-700 font-medium" : "text-gray-700"}`}
                            >
                              {t}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Length</Label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => { setShowLengthDropdown(!showLengthDropdown); setShowToneDropdown(false); }}
                      className="w-full flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                    >
                      <span className="capitalize">{length}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    <AnimatePresence>
                      {showLengthDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-hidden"
                        >
                          {LENGTHS.map((l) => (
                            <button
                              key={l}
                              type="button"
                              onClick={() => { setLength(l); setShowLengthDropdown(false); }}
                              className={`w-full text-left px-3 py-2 text-sm hover:bg-emerald-50 transition-colors capitalize ${length === l ? "bg-emerald-50 text-emerald-700 font-medium" : "text-gray-700"}`}
                            >
                              {l}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generating || !selectedType || !topic.trim()}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold h-12 text-base"
              >
                {generating ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" />Generate Content (1 credit)</>
                )}
              </Button>

              {credits <= 3 && credits > 0 && (
                <p className="text-xs text-amber-600 text-center">Only {credits} credit{credits !== 1 ? "s" : ""} remaining</p>
              )}
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  Output
                </CardTitle>
                {output && (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleCopy}>
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      <span className="ml-1 text-xs">{copied ? "Copied!" : "Copy"}</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { setOutput(""); setTopic(""); setSelectedType(""); }}>
                      <RotateCcw className="w-4 h-4" />
                      <span className="ml-1 text-xs">Clear</span>
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {generating ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-4" />
                  <p className="text-sm">Creating your content...</p>
                </div>
              ) : output ? (
                <ScrollArea className="h-[400px]">
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {output}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">Your generated content will appear here</p>
                  <p className="text-xs text-gray-400 mt-1">Select a type, enter a topic, and hit generate</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* History Drawer */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setShowHistory(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-lg">History</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowHistory(false)}>
                ✕
              </Button>
            </div>
            <ScrollArea className="flex-1">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <Clock className="w-8 h-8 mb-3 text-gray-300" />
                  <p className="text-sm">No generations yet</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {history.map((gen) => {
                    const Icon = getTypeIcon(gen.type);
                    return (
                      <motion.div
                        key={gen.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-lg border border-gray-200 hover:border-emerald-200 transition-colors cursor-pointer group"
                        onClick={() => {
                          setSelectedType(gen.type);
                          setTopic(gen.topic);
                          setTone(gen.tone);
                          setLength(gen.length);
                          setOutput(gen.output);
                          setShowHistory(false);
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-md bg-gradient-to-br ${getTypeColor(gen.type)} flex items-center justify-center`}>
                              <Icon className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 line-clamp-1">{gen.topic}</p>
                              <p className="text-xs text-gray-400">{formatDate(gen.createdAt)}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 h-7 w-7"
                            onClick={(e) => { e.stopPropagation(); handleDelete(gen.id); }}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-gray-400" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">{gen.output}</p>
                        <div className="flex gap-1.5 mt-2">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize">{gen.type}</Badge>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize">{gen.tone}</Badge>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize">{gen.length}</Badge>
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

      {/* Footer */}
      <footer className="py-6 px-4 sm:px-6 border-t border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-black" />
            </div>
            <span className="text-xs text-gray-400">ContentStudio</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a href="/privacy" className="text-gray-400 hover:text-gray-700 transition-colors">Privacy</a>
            <a href="/terms" className="text-gray-400 hover:text-gray-700 transition-colors">Terms</a>
            <a href="mailto:Zarifgaming142@gmail.com" className="text-gray-400 hover:text-gray-700 transition-colors">Zarifgaming142@gmail.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
