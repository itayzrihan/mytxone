import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - MYTX.one",
  description: "Comprehensive privacy policy for MYTX.one AI-powered digital services platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-cyan-400">Privacy Policy</span>
          </h1>
          <p className="text-xl text-zinc-400">
            Your Privacy is Our Priority
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-cyan max-w-none">
          <div className="space-y-8 text-zinc-300">
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction and Declaration of Principles</h2>
              <p className="leading-relaxed">
                This document ("the Privacy Policy") constitutes the basis for transparent, responsible, and secure conduct regarding the collection, processing, storage, and retention of the user's personal information ("the User"). MYTX.one ("the Operator") undertakes to act in accordance with all relevant legislation and regulations, including the Privacy Protection Law, data protection regulations, GDPR, and other international laws, while striving to implement best practices in the field of information security and privacy protection.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Types of Information Collected</h2>
              
              <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">2.1. Personal Information:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Full name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Shipping address (where relevant)</li>
                <li>Account details (username, password, etc.)</li>
                <li>Financial data in relevant cases</li>
              </ul>

              <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">2.2. Technical Information:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP address</li>
                <li>Browser type, operating system, and device type</li>
                <li>Access and usage data (such as login times, pages viewed, links clicked)</li>
                <li>Cookie identifiers and other tracking technologies</li>
              </ul>

              <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">2.3. Analytical and Behavioral Information:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Usage patterns and user preferences</li>
                <li>Statistical data (number of visits, duration of use, etc.)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Purposes of Information Processing</h2>
              <p className="leading-relaxed mb-3">The information is collected and processed to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, manage, and support the Application's services</li>
                <li>Verify, activate, and manage user accounts</li>
                <li>Improve the user experience and adapt the service to the User's needs</li>
                <li>Provide technical support, update, and send notices in accordance with the User's consent</li>
                <li>Comply with strict legal and regulatory requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Legal Basis for Processing Information</h2>
              <p className="leading-relaxed">
                Information processing is carried out on the basis of: the User's consent, performance of contracts, compliance with legal obligations, and for the Operator's legitimate interest in continuously improving the services and ensuring information security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Sharing Information with Third Parties</h2>
              
              <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">5.1. Service Providers and Technological Partners:</h3>
              <p className="leading-relaxed">
                The Operator may share information with external parties that provide hosting services, data analysis, technical support, and related services, but only in accordance with binding legal agreements to maintain confidentiality and information security.
              </p>

              <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">5.2. Compliance with Legal Requirements:</h3>
              <p className="leading-relaxed">
                In cases where required by law, such as government orders or demands from legal authorities, the information will be transferred to the competent authorities while maintaining the required minimum.
              </p>

              <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">5.3. Business Partnerships:</h3>
              <p className="leading-relaxed">
                Transfer of information within the framework of business partnerships will be done only in accordance with binding legal agreements that ensure maximum protection of the User's privacy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. International Information Transfer</h2>
              <p className="leading-relaxed">
                The information may be transferred, stored, and processed on servers and in various geographical locations, including beyond the borders of the State of Israel. In any case, technological and legal measures will be taken to ensure the confidentiality and security of the information in accordance with international regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Data Retention and Deletion</h2>
              
              <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">7.1. Retention Period:</h3>
              <p className="leading-relaxed">
                The information will be retained for the period required to fulfill the purposes for which it was collected, in accordance with the provisions of the law and regulations. In cases where long-term retention is required, the Operator will notify the User.
              </p>

              <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">7.2. Data Deletion:</h3>
              <p className="leading-relaxed">
                The User may request the deletion of their data at any time, subject to legal requirements or regulations that mandate retention for a specific period.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Information Security Measures</h2>
              
              <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">8.1. Technical and Organizational Measures:</h3>
              <p className="leading-relaxed">
                The Operator employs advanced technological measures, including encryption, backups, access control, and continuous monitoring, in order to ensure the confidentiality, integrity, and availability of the data. However, absolute protection cannot be guaranteed in every situation.
              </p>

              <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">8.2. Security Declaration:</h3>
              <p className="leading-relaxed">
                The User acknowledges that, despite all efforts and advanced standards, the internet does not provide absolute protection against breaches, system failures, technological faults, or unexpected human errors.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Use of Cookies and Tracking Technologies</h2>
              <p className="leading-relaxed">
                The Application uses cookies and tracking technologies for data analysis and improving the user experience. The User can manage and limit the use of these technologies through browser settings or other devices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. User Rights Regarding Data</h2>
              <p className="leading-relaxed mb-3">The User is granted the following rights:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The right to full access to personal information</li>
                <li>The right to correct inaccurate or incomplete information</li>
                <li>The right to deletion or restriction of data processing, in accordance with the law</li>
                <li>The right to object to data processing and to request data portability in a readable format</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Intellectual Property Rights and Confidentiality</h2>
              <p className="leading-relaxed">
                All information and content appearing in the Application, including designs, code, and other content, are the exclusive property of the Operator. The User undertakes not to make unauthorized use of this information or transfer it to external parties without explicit consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Communication Processes and Updates</h2>
              <p className="leading-relaxed">
                Any change or update to this policy will be made transparently and communicated to users via the Application, email, or other means of communication. Continued use of the service constitutes agreement to these changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Links to Third-Party Sites and Services</h2>
              <p className="leading-relaxed">
                The Application may contain links to sites and services of external parties. The Operator is not responsible for the privacy policies or the content of these sites, and any use of them is at the User's sole responsibility.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">14. Compliance with International Legislation</h2>
              <p className="leading-relaxed">
                This policy is adapted to the legal requirements in the State of Israel and to international regulations such as GDPR. The Operator undertakes to update the policy in accordance with changes in local and international legislation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">15. Supervision and Control Processes</h2>
              <p className="leading-relaxed">
                The Operator conducts periodic internal and external audit processes to ensure the service's compliance with strict legal and technological standards.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">16. Security Incident Response Procedures</h2>
              <p className="leading-relaxed">
                In the event of security incidents, such as breaches, system failures, or technological faults, advanced procedures will be activated for immediate handling, including detailed notification to users and the activation of an orderly response plan in accordance with the provisions of the law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">17. Limitation of Legal Liability and Waiver</h2>
              
              <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">17.1. Limitation of Liability:</h3>
              <p className="leading-relaxed">
                The User confirms and understands that the Operator will not be liable for any damage, direct or indirect, that may be caused as a result of using the service, technical faults, bugs, breaches, data loss, or any other damage – even if all reasonable precautions and security measures were taken.
              </p>

              <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">17.2. Waiver:</h3>
              <p className="leading-relaxed">
                By using the service, the User explicitly agrees to waive any legal claim against it for damages that may be caused due to cyber-attacks, system failures, or unexpected faults, and is aware that there is no commitment from the Operator to provide absolute protection at all times.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">18. User Responsibility and Understanding of Risks</h2>
              <p className="leading-relaxed">
                The User undertakes to use the service in accordance with the guidelines and recommendations, and is aware that the use is at their full responsibility. The Operator notes that all efforts have been made to implement advanced security standards, but there is no guarantee on the internet for absolute protection against technological threats.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">19. Force Majeure and Service Interruption</h2>
              <p className="leading-relaxed">
                The Operator will not be responsible for any damage or loss caused due to force majeure situations, such as natural disasters, political events, strikes, terrorist acts, or large-scale technological failures. In these cases, the interruption of the service will not be considered a breach of the Operator's commitments.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">20. Law and Jurisdiction</h2>
              <p className="leading-relaxed">
                This Privacy Policy will be interpreted according to the laws of the State of Israel, and any dispute arising from the use of the service or the interpretation of this policy will be brought before the competent courts in Israel.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">21. Questions, Requests, and Comments</h2>
              <p className="leading-relaxed">
                For any question, request, or comment regarding this Privacy Policy, please contact us at <a href="mailto:mytxone@gmail.com" className="text-cyan-400 hover:text-cyan-300">mytxone@gmail.com</a> or by phone <a href="tel:0515511591" className="text-cyan-400 hover:text-cyan-300">0515511591</a>. The Operator undertakes to handle inquiries in accordance with the law's guidelines and resource availability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">22. Validity and Renewal of the Policy</h2>
              <p className="leading-relaxed">
                This policy takes effect from the date of publication and constitutes the sole policy, superseding any previous version. The Operator reserves the right to update the policy from time to time, in accordance with technological, legal, or operational changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">23. Declaration of Consent and Understanding of Terms</h2>
              <p className="leading-relaxed">
                By using the Application, the User confirms that they have read, understood, and agreed to all the clauses detailed in this document, including all limitations, waivers, and legal declarations. The use of the service constitutes explicit confirmation of agreement and identification of the risks involved in using the technology.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">24. Future Updates and Notices</h2>
              <p className="leading-relaxed">
                Any update or change to this policy will be published in the Application and in the relevant communication channels. The User is requested to stay updated with the policy periodically, as non-compliance with changes does not exempt the User from the responsibility of receiving updated information.
              </p>
            </section>

            {/* Closing Statement */}
            <div className="mt-12 p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg backdrop-blur-sm">
              <p className="text-center text-zinc-300 leading-relaxed">
                We are committed to protecting your privacy and ensuring the security of your personal information. If you have any questions or concerns, please don't hesitate to contact us.
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
