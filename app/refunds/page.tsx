import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refunds Terms and Conditions - MYTX.one",
  description: "Refunds terms and conditions for MYTX.one AI-powered digital services platform.",
};

export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-cyan-400">Refunds Terms and Conditions</span>
          </h1>
          <p className="text-xl text-zinc-400">
            Last Updated: 23.12.2024
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-cyan max-w-none">
          <div className="space-y-8 text-zinc-300">
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p className="leading-relaxed">
                Welcome to MYTX. These Terms and Conditions (&quot;the Terms&quot;) govern your use of our website located at MYTX.ONE (&quot;MYTX&quot;). By accessing or using our site, you agree to be bound by these Terms. If you do not agree to any part of these Terms, please refrain from using the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By accessing and using our site, you accept and agree to these Terms and our Privacy Policy. If you do not agree to these Terms, you are prohibited from using or accessing the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Changes to Terms</h2>
              <p className="leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. We will provide notice of changes by posting the updated terms on this page. Your continued use of the site after the changes are made constitutes your acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Use of the Site</h2>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong className="text-cyan-400">Eligibility:</strong> You must be at least 18 years old to use our site.
                </li>
                <li>
                  <strong className="text-cyan-400">License:</strong> We grant you a limited, non-exclusive, non-transferable license to access and use the site for personal, non-commercial purposes, in accordance with these Terms.
                </li>
                <li>
                  <strong className="text-cyan-400">Restrictions:</strong> You agree not to:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Use the site for illegal purposes.</li>
                    <li>Modify, copy, or distribute any content from the site.</li>
                    <li>Attempt to gain unauthorized access to parts of the site.</li>
                    <li>Use automated means to access the site without our permission.</li>
                  </ul>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. User Accounts</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-cyan-400">Registration:</strong> You may be required to register for an account to use certain functions of the site. You agree to provide accurate and complete information when registering and to update it as needed.
                </li>
                <li>
                  <strong className="text-cyan-400">Account Security:</strong> You are responsible for maintaining the confidentiality of your account details and for all activities that occur under your account.
                </li>
                <li>
                  <strong className="text-cyan-400">Account Termination:</strong> We reserve the right to suspend or terminate your account if you violate the Terms or engage in improper conduct.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Intellectual Property</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-cyan-400">Ownership:</strong> All content, trademarks, logos, and intellectual property displayed on the site are owned by or licensed to us and are protected by law.
                </li>
                <li>
                  <strong className="text-cyan-400">Limited License:</strong> You are granted a limited permission to access and use the content for personal, non-commercial needs.
                </li>
                <li>
                  <strong className="text-cyan-400">Prohibited Uses:</strong> You may not reproduce, distribute, modify, create derivative works from, publicly display, or exploit the content without prior written consent from us.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. User-Generated Content</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-cyan-400">Responsibility:</strong> You bear sole responsibility for any content you submit, post, or display on the site (&quot;User Content&quot;).
                </li>
                <li>
                  <strong className="text-cyan-400">License to Us:</strong> By submitting User Content, you grant us a non-exclusive, royalty-free, transferable, and sublicensable license to use, store, display, reproduce, modify, and distribute your User Content.
                </li>
                <li>
                  <strong className="text-cyan-400">Prohibited Content:</strong> You may not submit content that is illegal, defamatory, obscene, infringes copyright, or violates third-party rights.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Prohibited Activities</h2>
              <p className="leading-relaxed mb-3">You agree not to engage in the following activities:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-cyan-400">Harassment:</strong> Harassing, threatening, or intimidating other users.</li>
                <li><strong className="text-cyan-400">Spam:</strong> Sending unsolicited publications or advertisements.</li>
                <li><strong className="text-cyan-400">Hacking:</strong> Attempting to interfere with the site's security.</li>
                <li><strong className="text-cyan-400">Data Collection:</strong> Collecting or mining data from the site without permission.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Termination</h2>
              <p className="leading-relaxed">
                We may terminate or suspend your access to the site immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the site will cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Disclaimer of Warranties</h2>
              <p className="leading-relaxed">
                The site is provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot;. We grant no warranty of any kind regarding the operation of the site or the content contained therein. To the extent permitted by law, we disclaim all warranties, including merchantability, fitness for a particular purpose, and non-infringement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Limitation of Liability</h2>
              <p className="leading-relaxed">
                In no event shall MYTX, its directors, employees, partners, or affiliates be liable for indirect, incidental, special, or consequential damages arising from your use of the site, even if we have been advised of such possibility.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Indemnification</h2>
              <p className="leading-relaxed">
                You agree to defend, indemnify, and hold us and our partners harmless from any claim, loss, debt, or damage arising from your use of the site, your violation of the Terms, or your infringement of third-party rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Governing Law</h2>
              <p className="leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of the State of Israel, without regard to its conflict of law provisions with the laws of other countries.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">14. Dispute Resolution</h2>
              <p className="leading-relaxed">
                Any dispute, claim, or demand arising from or related to these Terms or your use of the site shall be brought before the competent courts in the city of Haifa, in accordance with the laws applicable in Israel. The court&apos;s judgment shall be final and enforceable in any competent court.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">15. Privacy Policy</h2>
              <p className="leading-relaxed">
                Your use of the site is also subject to our <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</Link>. By using the site, you consent to the collection and use of your information as detailed in the Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">16. Links to External Sites</h2>
              <p className="leading-relaxed">
                Our site may contain links to third-party sites or services that are not under our control. We have no control over and are not responsible for the content, privacy policies, or practices of these external sites.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">17. Cookies</h2>
              <p className="leading-relaxed">
                We use cookies and similar tracking technologies to track activity on the site and store certain information. By using the site, you consent to our use of cookies in accordance with our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">18. Severability</h2>
              <p className="leading-relaxed">
                If any provision of these Terms is found to be invalid or unenforceable by a court, the remaining provisions will remain in full force.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">19. Product Delivery Policy</h2>
              <p className="leading-relaxed">
                Deliveries will be carried out by a courier company on our behalf and will reach the customer within 7 business days from the moment of purchase on the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">20. Product Warranty</h2>
              <p className="leading-relaxed">
                Our company undertakes to provide you with the complete product packaging, without defect or prior use of the product. Our company does not take responsibility for the results of using the product as they are individual and vary from person to person.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">21. Usage Instructions and Code of Conduct</h2>
              <p className="leading-relaxed mb-3">
                The products on the site are mostly virtual, and you may not distribute, copy, or transfer the products without permission and official approval from the site team.
              </p>
              <p className="leading-relaxed mb-3">
                <strong className="text-cyan-400">In case you purchased a physical product:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Detailed usage instructions are on the site or on the back of the product&apos;s packaging.</li>
                <li>The responsibility for using the products purchased through the site, whether virtual or physical, rests solely with the user, and you must act responsibly and cautiously in all types of use.</li>
                <li>Do not use the products for purposes for which they were not intended.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">22. Full Agreement</h2>
              <p className="leading-relaxed">
                These Terms constitute the entire agreement between you and MYTX.one regarding your use of the site and replace any prior agreement or understanding.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">23. Contact Details</h2>
              <p className="leading-relaxed">
                If you have any questions regarding these Terms, please contact us at:
              </p>
              <ul className="list-none pl-0 mt-4 space-y-2">
                <li>
                  <strong className="text-cyan-400">Email:</strong> <a href="mailto:MYTXONE@GMAIL.COM" className="text-cyan-400 hover:text-cyan-300">MYTXONE@GMAIL.COM</a>
                </li>
                <li>
                  <strong className="text-cyan-400">Phone:</strong> <a href="tel:0515511591" className="text-cyan-400 hover:text-cyan-300">051-5511591</a>
                </li>
              </ul>
            </section>

            {/* Closing Statement */}
            <div className="mt-12 p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg backdrop-blur-sm">
              <p className="text-center text-zinc-300 leading-relaxed font-semibold">
                End of Terms and Conditions
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-lg transition-colors duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
