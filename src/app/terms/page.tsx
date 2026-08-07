import type { Metadata } from "next";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — ContentStudio",
  description: "ContentStudio terms of service. Read our terms and conditions.",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <span className="font-bold text-lg">ContentStudio</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Terms of Service</h1>
        <p className="text-white/40 text-sm mb-12">Last updated: August 7, 2026</p>

        <div className="space-y-8 text-white/70 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using ContentStudio (&quot;the Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use the Service. These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
            <p>
              ContentStudio is an AI-powered content generation platform that creates social media posts, blog drafts, email copy, and advertising text based on user input. The Service is provided &quot;as is&quot; and is intended for general content creation purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. User Accounts</h2>
            <p className="mb-3">To use certain features of the Service, you must create an account. You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate, current, and complete information during registration.</li>
              <li>Maintain and promptly update your account information.</li>
              <li>Keep your password confidential and not share it with anyone.</li>
              <li>Notify us immediately of any unauthorized use of your account.</li>
              <li>Be at least 13 years of age to use the Service.</li>
            </ul>
            <p className="mt-3">
              We reserve the right to suspend or terminate accounts that violate these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Credits and Payments</h2>
            <p className="mb-3">
              ContentStudio operates on a credit-based system:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Free accounts receive 10 credits upon registration.</li>
              <li>Pro accounts receive 500 credits per month with a paid subscription.</li>
              <li>Each content generation consumes one credit.</li>
              <li>Credits are non-transferable and expire at the end of each billing period for Pro accounts.</li>
              <li>All payments are processed securely through our payment provider.</li>
              <li>Refunds are handled on a case-by-case basis within 7 days of purchase.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Acceptable Use</h2>
            <p className="mb-3">You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Generate content that is illegal, harmful, threatening, abusive, defamatory, obscene, or otherwise objectionable.</li>
              <li>Create misleading, fraudulent, or deceptive content including fake reviews, misinformation, or impersonation.</li>
              <li>Produce content that infringes on intellectual property rights of others.</li>
              <li>Attempt to reverse-engineer, hack, or exploit the Service or its AI systems.</li>
              <li>Use automated tools, bots, or scripts to access the Service in an unauthorized manner.</li>
              <li>Resell or redistribute the Service or generated content without authorization.</li>
              <li>Interfere with or disrupt the Service, servers, or networks connected to the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. AI-Generated Content</h2>
            <p className="mb-3">Important disclaimers about AI-generated content:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>AI-generated content may contain inaccuracies, errors, or biased information.</li>
              <li>You are solely responsible for reviewing, editing, and verifying all generated content before use.</li>
              <li>ContentStudio does not guarantee the accuracy, quality, or suitability of generated content.</li>
              <li>You retain ownership of content you generate, but you bear full responsibility for its use and publication.</li>
              <li>The Service should not be used as a substitute for professional advice in legal, medical, financial, or other specialized fields.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Intellectual Property</h2>
            <p>
              The ContentStudio name, logo, website design, and underlying technology are owned by us and protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works from our proprietary materials without our express written permission. Content that you generate using the Service is owned by you, subject to the terms of your subscription.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, ContentStudio and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses, resulting from your use of or inability to use the Service. Our total liability shall not exceed the amount you paid to us in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless ContentStudio, its operators, and affiliates from any claims, damages, losses, or expenses arising from your use of the Service, your violation of these Terms, or your violation of any rights of another party.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service at any time, with or without cause, and with or without notice. Upon termination, your right to use the Service ceases immediately. Provisions that by their nature should survive termination shall remain in effect.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles. Any disputes arising from these Terms or the Service shall be resolved through good-faith negotiation or, if necessary, through binding arbitration.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">12. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. Material changes will be notified via email to your registered address or through a prominent notice on our website. Your continued use of the Service after changes are posted constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">13. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white"><strong>Email:</strong> Zarifgaming142@gmail.com</p>
              <p className="text-white mt-1"><strong>Response Time:</strong> Within 48 hours on business days</p>
            </div>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <a href="/" className="text-white/40 hover:text-white transition-colors">Back to ContentStudio</a>
          <a href="/privacy" className="text-white/40 hover:text-white transition-colors">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
