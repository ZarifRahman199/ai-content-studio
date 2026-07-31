"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles, Zap, Shield, Globe, PenLine, Mail, Megaphone, FileText,
  ArrowRight, Star, Check, Crown, Building2, Users, TrendingUp,
  Menu, X, ChevronRight, Quote
} from "lucide-react";

interface LandingProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" } }),
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const features = [
  { icon: PenLine, title: "Social Media Posts", desc: "Scroll-stopping content with emojis, hashtags, and CTAs that drive engagement across every platform.", gradient: "from-pink-500 to-rose-500" },
  { icon: FileText, title: "Blog Drafts", desc: "Structured outlines and full drafts with compelling headlines, clear sections, and SEO-ready formatting.", gradient: "from-blue-500 to-indigo-500" },
  { icon: Mail, title: "Email Copy", desc: "Subject lines that get opened and body copy that converts readers into customers and subscribers.", gradient: "from-amber-500 to-orange-500" },
  { icon: Megaphone, title: "Ad Text", desc: "High-converting ad copy with urgency, value props, and strong calls-to-action for any platform.", gradient: "from-emerald-500 to-teal-500" },
];

const benefits = [
  { icon: Zap, title: "10x Faster", desc: "Generate professional content in seconds, not hours. Your AI-powered writing assistant that never sleeps." },
  { icon: Shield, title: "Consistent Quality", desc: "Every piece of content meets professional standards. No more staring at blank screens or writer's block." },
  { icon: Globe, title: "Any Niche", desc: "Works for every industry, topic, and audience. Just describe what you need and watch the magic happen." },
];

const testimonials = [
  { name: "Sarah Chen", role: "Marketing Lead, TechFlow", text: "ContentStudio cut our content creation time by 80%. We went from 2 blog posts a week to 10 — and the quality is better than ever.", avatar: "SC" },
  { name: "Marcus Johnson", role: "Founder, GrowthLab", text: "The ad copy generator alone paid for our Pro plan in the first day. Our Facebook ROAS improved by 3.2x in two weeks.", avatar: "MJ" },
  { name: "Aisha Patel", role: "Content Manager, NovaBrand", text: "We switched from three different tools to just ContentStudio. It handles everything — social, email, blogs, ads. Incredible value.", avatar: "AP" },
];

const stats = [
  { value: 50000, suffix: "+", label: "Content Generated" },
  { value: 12000, suffix: "+", label: "Active Creators" },
  { value: 98, suffix: "%", label: "Satisfaction Rate" },
  { value: 4, suffix: "", label: "Content Types" },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Perfect to try it out",
    icon: Sparkles,
    features: ["10 credits on signup", "All 4 content types", "Basic tone options", "Short & medium length", "Generation history", "Community support"],
    cta: "Get Started Free",
    popular: false,
    gradient: "",
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    desc: "For creators & freelancers",
    icon: Crown,
    features: ["500 credits/month", "All 4 content types", "All tones & lengths", "Priority generation speed", "Full generation history", "Word count & download", "Email support", "Regenerate content"],
    cta: "Upgrade to Pro",
    popular: true,
    gradient: "from-emerald-500 to-cyan-500",
  },
  {
    name: "Business",
    price: "$49",
    period: "/month",
    desc: "For teams & agencies",
    icon: Building2,
    features: ["Unlimited credits", "All 4 content types", "All tones & lengths", "Fastest generation speed", "Full generation history", "Word count & download", "Team collaboration (5 seats)", "Custom brand voice", "API access", "Priority support & onboarding"],
    cta: "Go Business",
    popular: false,
    gradient: "from-violet-500 to-purple-500",
  },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, target, { duration: 2, ease: "easeOut" });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [target, count, rounded]);

  return <span>{display.toLocaleString()}{suffix}</span>;
}

export function Landing({ onGetStarted, onLogin }: LandingProps) {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/70 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">ContentStudio</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <a href="#features" className="text-sm text-white/50 hover:text-white transition-colors px-3 py-2">Features</a>
            <a href="#pricing" className="text-sm text-white/50 hover:text-white transition-colors px-3 py-2">Pricing</a>
            <a href="#testimonials" className="text-sm text-white/50 hover:text-white transition-colors px-3 py-2">Reviews</a>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10 hidden sm:flex" onClick={onLogin}>
              Log in
            </Button>
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm" onClick={onGetStarted}>
              Get Started
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
            <button className="md:hidden text-white/60 p-2" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenu && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden border-t border-white/5 bg-black/95 backdrop-blur-xl px-4 py-4 space-y-1">
            <a href="#features" onClick={() => setMobileMenu(false)} className="block text-sm text-white/60 hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/5">Features</a>
            <a href="#pricing" onClick={() => setMobileMenu(false)} className="block text-sm text-white/60 hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/5">Pricing</a>
            <a href="#testimonials" onClick={() => setMobileMenu(false)} className="block text-sm text-white/60 hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/5">Reviews</a>
            <button onClick={() => { setMobileMenu(false); onLogin(); }} className="block w-full text-left text-sm text-white/60 hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/5">Log in</button>
          </motion.div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/40 via-transparent to-black" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/8 rounded-full blur-[150px]" />
        <div className="absolute top-40 right-0 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" className="flex flex-col gap-6">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 w-fit mx-auto">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-white/60 font-medium">AI-Powered Content Creation</span>
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              Create Content That
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-300 bg-clip-text text-transparent"> Converts & Sells</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
              Generate social media posts, blog drafts, email copy, and ad text in seconds. Powered by AI, designed for creators and businesses who want results.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-base px-8 py-6 h-auto rounded-xl" onClick={onGetStarted}>
                Start Creating Free <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/10 text-white/80 hover:bg-white/5 hover:text-white text-base px-8 py-6 h-auto rounded-xl" onClick={onLogin}>
                I have an account
              </Button>
            </motion.div>
            <motion.div variants={fadeUp} custom={4} className="flex items-center justify-center gap-4 mt-3">
              <div className="flex -space-x-2">
                {["SC","MJ","AP","RK"].map((a,i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-cyan-600 border-2 border-black flex items-center justify-center text-[10px] font-bold text-white">{a}</div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_,i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-xs text-white/40">Loved by 12,000+ creators</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 px-4 sm:px-6 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.div variants={fadeUp} custom={i} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white"><Counter target={s.value} suffix={s.suffix} /></p>
                <p className="text-sm text-white/40 mt-1">{s.label}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Content Types */}
      <section id="features" className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-emerald-400 text-sm font-semibold mb-3 tracking-wide uppercase">Features</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to Create
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-white/40 text-lg max-w-xl mx-auto">
              One platform for all your content needs. Pick a format, describe your topic, and let AI do the heavy lifting.
            </motion.p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp} custom={0}>
                <Card className="bg-white/[0.03] border-white/[0.06] hover:border-emerald-500/20 hover:bg-white/[0.05] transition-all duration-300 h-full group">
                  <CardContent className="p-6">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <f.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-emerald-400 text-sm font-semibold mb-3 tracking-wide uppercase">How It Works</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Three Steps. Zero Hassle.
            </motion.h2>
          </motion.div>
          <div className="space-y-6">
            {[
              { step: "01", title: "Choose Your Format", desc: "Select from social media posts, blog drafts, email copy, or ad text — whatever your campaign needs.", icon: PenLine },
              { step: "02", title: "Describe Your Topic", desc: "Tell us what you want to write about. Set the tone (professional, casual, humorous) and the length you need.", icon: Sparkles },
              { step: "03", title: "Get AI Content", desc: "Hit generate and get professional, ready-to-publish content in seconds. Copy it, download it, or regenerate.", icon: Zap },
            ].map((item, i) => (
              <motion.div key={item.step} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <motion.div variants={fadeUp} custom={i} className="flex gap-6 items-start p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/20 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono text-emerald-500/50">STEP {item.step}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-emerald-400 text-sm font-semibold mb-3 tracking-wide uppercase">Benefits</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why ContentStudio?
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-white/40 text-lg max-w-xl mx-auto">
              Stop juggling multiple tools. One platform, all the content you need.
            </motion.p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-4">
            {benefits.map((b, i) => (
              <motion.div key={b.title} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <motion.div variants={fadeUp} custom={i} className="text-center p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/20 transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-cyan-500/15 flex items-center justify-center mx-auto mb-5">
                    <b.icon className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{b.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{b.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-emerald-400 text-sm font-semibold mb-3 tracking-wide uppercase">Testimonials</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Loved by Creators Worldwide
            </motion.h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} variants={fadeUp} custom={i}>
                <Card className="bg-white/[0.03] border-white/[0.06] hover:border-emerald-500/20 transition-colors h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <Quote className="w-8 h-8 text-emerald-500/30 mb-4" />
                    <p className="text-white/60 text-sm leading-relaxed flex-1 mb-6">&ldquo;{t.text}&rdquo;</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-cyan-600 flex items-center justify-center text-xs font-bold text-white">{t.avatar}</div>
                      <div>
                        <p className="text-sm font-medium text-white">{t.name}</p>
                        <p className="text-xs text-white/40">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-emerald-400 text-sm font-semibold mb-3 tracking-wide uppercase">Pricing</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-white/40 text-lg">Start free, upgrade when you need more power.</motion.p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-5">
            {pricingPlans.map((plan, i) => {
              const Icon = plan.icon;
              return (
                <motion.div key={plan.name} variants={fadeUp} custom={i}>
                  <Card className={`h-full relative overflow-hidden ${plan.popular ? "bg-gradient-to-b from-emerald-500/10 to-cyan-500/5 border-emerald-500/30" : "bg-white/[0.03] border-white/[0.06]"}`}>
                    {plan.popular && (
                      <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl">MOST POPULAR</div>
                    )}
                    <CardContent className="p-7 flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-xl ${plan.popular ? "bg-emerald-500/20" : plan.name === "Business" ? "bg-violet-500/20" : "bg-white/10"} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${plan.popular ? "text-emerald-400" : plan.name === "Business" ? "text-violet-400" : "text-white/60"}`} />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-lg">{plan.name}</h3>
                          <p className="text-white/40 text-xs">{plan.desc}</p>
                        </div>
                      </div>
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-white">{plan.price}</span>
                        <span className="text-white/30 text-sm">{plan.period}</span>
                      </div>
                      <ul className="space-y-2.5 mb-8 flex-1">
                        {plan.features.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm text-white/50">
                            <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular ? "text-emerald-400" : plan.name === "Business" ? "text-violet-400" : "text-white/30"}`} />{item}
                          </li>
                        ))}
                      </ul>
                      <Button className={`w-full font-semibold rounded-xl h-11 ${plan.popular ? "bg-emerald-500 hover:bg-emerald-400 text-black" : plan.name === "Business" ? "bg-violet-500 hover:bg-violet-400 text-white" : "bg-white/10 hover:bg-white/15 text-white border-0"}`} onClick={onGetStarted}>
                        {plan.cta}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
          <motion.p variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center text-white/30 text-sm mt-8">
            All plans include a 7-day money-back guarantee. No questions asked.
          </motion.p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-2xl mx-auto text-center">
          <motion.div variants={fadeUp} custom={0} className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8">
            <TrendingUp className="w-8 h-8 text-emerald-400" />
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Create 10x Faster?
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-white/40 text-lg mb-8">
            Join 12,000+ creators using AI to produce better content, grow their audience, and save hours every week.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-base px-8 h-auto py-6 rounded-xl" onClick={onGetStarted}>
              Get Started for Free <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
          <motion.p variants={fadeUp} custom={4} className="text-white/25 text-sm mt-4">
            No credit card required. 10 free credits on signup.
          </motion.p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-black" />
              </div>
              <span className="text-sm font-semibold text-white/60">ContentStudio</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-xs text-white/30 hover:text-white/60 transition-colors">Features</a>
              <a href="#pricing" className="text-xs text-white/30 hover:text-white/60 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-xs text-white/30 hover:text-white/60 transition-colors">Reviews</a>
            </div>
          </div>
          <p className="text-center text-xs text-white/20 mt-6">Built with AI. Designed for creators. &copy; 2026 ContentStudio.</p>
        </div>
      </footer>
    </div>
  );
}
