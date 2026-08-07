import type { Metadata } from "next";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — ContentStudio",
  description: "ContentStudio privacy policy. Learn how we handle your data.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <span className="font-bold text-lg">ContentStudio</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Privacy Policy</h1>
        <p className="text-white/40 text-sm mb-12">Last updated: August 7, 2026</p>

        <div className="space-y-8 text-white/70 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
            <p>
              ContentStudio (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website and use our AI-powered content generation service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
            <p className="mb-3">We collect only the information necessary to provide our service:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Account Information:</strong> Your email address and display name when you sign up.</li>
              <li><strong className="text-white">Content You Generate:</strong> Topics, settings, and generated content you create using our platform.</li>
              <li><strong className="text-white">Usage Data:</strong> Credits consumed, generation history, and basic usage patterns to improve our service.</li>
              <li><strong className="text-white">Technical Data:</strong> Browser type, device type, and IP address for security and performance optimization.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain the AI content generation service.</li>
              <li>To process your content requests and deliver generated output.</li>
              <li>To manage your account, credits, and subscription.</li>
              <li>To communicate important updates about your account or our service.</li>
              <li>To analyze usage patterns and improve our platform.</li>
              <li>To detect and prevent abuse, fraud, or security threats.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. AI-Generated Content</h2>
            <p>
              Content generated through our platform is created by AI based on your input. You retain full ownership and rights to the content you generate. We do not claim any rights to your generated content. However, we temporarily store your generations in your account history for your convenience, and you may delete them at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Data Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share anonymized, aggregated data for analytics purposes. We may also share data with trusted service providers who assist us in operating our platform, subject to strict confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal data, including encryption in transit and at rest, secure authentication, and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Cookies</h2>
            <p>
              We use essential cookies to maintain your session and preferences. We may use analytics cookies to understand how visitors interact with our site. You can disable cookies in your browser settings, though some features may not work properly without them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your account and associated data.</li>
              <li>Export your data in a portable format.</li>
              <li>Withdraw consent for data processing at any time.</li>
              <li>Opt out of marketing communications.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Data Retention</h2>
            <p>
              We retain your personal data only for as long as necessary to provide our service and fulfill the purposes outlined in this policy. When you delete your account, we will remove your personal data within 30 days, except where we are legally required to retain it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Third-Party Services</h2>
            <p>
              Our platform may integrate with third-party AI providers and payment processors. These services have their own privacy policies, and we encourage you to review them. We are not responsible for the privacy practices of third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Children&apos;s Privacy</h2>
            <p>
              Our service is not intended for individuals under the age of 13. We do not knowingly collect personal data from children. If we become aware that we have collected data from a child under 13, we will take steps to delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">12. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any material changes by posting the updated policy on this page and updating the &quot;Last updated&quot; date. Your continued use of our service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">13. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or your personal data, please contact us at:
            </p>
            <div className="mt-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white"><strong>Email:</strong> Zarifgaming142@gmail.com</p>
              <p className="text-white mt-1"><strong>Response Time:</strong> Within 48 hours on business days</p>
            </div>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <a href="/" className="text-white/40 hover:text-white transition-colors">Back to ContentStudio</a>
          <a href="/terms" className="text-white/40 hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  );
}
