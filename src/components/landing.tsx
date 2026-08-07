"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Zap, Shield, Globe, PenLine, Mail, Megaphone, FileText, ArrowRight, Star, Check } from "lucide-react";

interface LandingProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" } }),
};

const features = [
  { icon: PenLine, title: "Social Media Posts", desc: "Scroll-stopping content with emojis, hashtags, and CTAs that drive engagement." },
  { icon: FileText, title: "Blog Drafts", desc: "Structured outlines and full drafts with compelling headlines and clear sections." },
  { icon: Mail, title: "Email Copy", desc: "Subject lines that get opened and body copy that converts readers to customers." },
  { icon: Megaphone, title: "Ad Text", desc: "High-converting ad copy with urgency, value props, and strong calls-to-action." },
];

const benefits = [
  { icon: Zap, title: "10x Faster", desc: "Generate content in seconds, not hours. Your AI-powered writing assistant." },
  { icon: Shield, title: "Consistent Quality", desc: "Professional output every time. No more staring at blank screens." },
  { icon: Globe, title: "Any Niche", desc: "Works for any industry, topic, or audience. Just describe what you need." },
];

export function Landing({ onGetStarted, onLogin }: LandingProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-lg text-white">ContentStudio</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10" onClick={onLogin}>
              Log in
            </Button>
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold" onClick={onGetStarted}>
              Get Started Free
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/50 via-black to-black" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" className="flex flex-col gap-6">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 w-fit mx-auto">
              <Star className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">AI-Powered Content Creation</span>
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
              Create Content That
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-300 bg-clip-text text-transparent"> Converts</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              Generate social media posts, blog drafts, email copy, and ad text in seconds. Powered by AI, designed for creators and businesses.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-lg px-8 py-6 h-auto" onClick={onGetStarted}>
                Start Creating Free <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6 h-auto" onClick={onLogin}>
                I have an account
              </Button>
            </motion.div>
            <motion.p variants={fadeUp} custom={4} className="text-sm text-white/40 mt-2">
              10 free credits on signup. No credit card required.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content Types */}
      <section className="py-20 px-4 sm:px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to Create
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-white/50 text-lg max-w-xl mx-auto">
              One platform for all your content needs. Pick a format, describe your topic, and let AI do the rest.
            </motion.p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <motion.div variants={fadeUp} custom={i}>
                  <Card className="bg-white/5 border-white/10 hover:border-emerald-500/30 transition-all duration-300 h-full">
                    <CardContent className="p-6">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                        <f.icon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                      <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-black to-emerald-950/30">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </motion.h2>
          </motion.div>
          <div className="space-y-8">
            {[
              { step: "01", title: "Choose Your Format", desc: "Select from social media posts, blog drafts, email copy, or ad text." },
              { step: "02", title: "Describe Your Topic", desc: "Tell us what you want to write about. Set the tone and length." },
              { step: "03", title: "Get AI Content", desc: "Hit generate and get professional content in seconds. Copy, edit, publish." },
            ].map((item, i) => (
              <motion.div key={item.step} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <motion.div variants={fadeUp} custom={i} className="flex gap-6 items-start">
                  <span className="text-5xl font-bold text-emerald-500/20 shrink-0">{item.step}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-white/50">{item.desc}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why ContentStudio?
            </motion.h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <motion.div key={b.title} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <motion.div variants={fadeUp} custom={i} className="text-center p-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                    <b.icon className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{b.title}</h3>
                  <p className="text-white/50 text-sm">{b.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-black to-emerald-950/20">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Simple Pricing
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-white/50 text-lg">Start free, upgrade when you need more.</motion.p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.div variants={fadeUp} custom={0}>
                <Card className="bg-white/5 border-white/10 h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <h3 className="text-white font-semibold text-lg mb-1">Free</h3>
                    <p className="text-white/40 text-sm mb-4">Perfect to try it out</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-white">$0</span>
                      <span className="text-white/40">/forever</span>
                    </div>
                    <ul className="space-y-3 mb-8 flex-1">
                      {["10 credits on signup", "All content types", "Basic tone options", "Generation history"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-white/60">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />{item}
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" onClick={onGetStarted}>
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.div variants={fadeUp} custom={1}>
                <Card className="bg-gradient-to-b from-emerald-500/10 to-cyan-500/10 border-emerald-500/30 h-full relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-full">POPULAR</div>
                  <CardContent className="p-6 flex flex-col h-full">
                    <h3 className="text-white font-semibold text-lg mb-1">Pro</h3>
                    <p className="text-white/40 text-sm mb-4">For creators & businesses</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-white">$19</span>
                      <span className="text-white/40">/month</span>
                    </div>
                    <ul className="space-y-3 mb-8 flex-1">
                      {["500 credits/month", "All content types", "All tones & lengths", "Priority generation", "Generation history", "Email support"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-white/60">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />{item}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold" onClick={onGetStarted}>
                      Upgrade to Pro
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 bg-black">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-2xl mx-auto text-center">
          <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Create 10x Faster?
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-white/50 text-lg mb-8">
            Join thousands of creators using AI to produce better content in less time.
          </motion.p>
          <motion.div variants={fadeUp} custom={2}>
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-lg px-8" onClick={onGetStarted}>
              Get Started for Free <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-black" />
              </div>
              <span className="text-sm text-white/40">ContentStudio</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="/privacy" className="text-white/40 hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="text-white/40 hover:text-white transition-colors">Terms of Service</a>
              <a href="mailto:Zarifgaming142@gmail.com" className="text-white/40 hover:text-white transition-colors">Support</a>
              <a href="mailto:Zarifgaming142@gmail.com?subject=Business%20Inquiry" className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full hover:bg-emerald-500/20 transition-all">Business</a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/5 pt-6">
            <p className="text-sm text-white/25">Built with AI. Designed for creators.</p>
            <p className="text-sm text-white/25">
              <a href="mailto:Zarifgaming142@gmail.com" className="hover:text-white/50 transition-colors">Zarifgaming142@gmail.com</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}