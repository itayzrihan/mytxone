import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use - MYTX.one",
  description: "Full and comprehensive terms of use for MYTX.one AI-powered digital services platform.",
};

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-cyan-400">Terms of Use</span>
          </h1>
          <p className="text-xl text-zinc-400">
            Full and Comprehensive Terms of Use
          </p>
        </div>

        {/* Important Notice */}
        <div className="mb-8 p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-lg backdrop-blur-sm">
          <p className="text-zinc-300 leading-relaxed">
            <strong className="text-cyan-400">Important Notice:</strong> Please note that the site and application are in an <strong>Alpha version</strong> and there may be disruptions in functionality. We allow you to try and enjoy the application and report any problems or possible improvements to us. Despite the implementation of advanced security measures, we cannot guarantee the security of your personal information. Likewise, the recommendation is to never enter personal or sensitive information onto the internet, as no site in the world is 100% immune to breaches.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-cyan max-w-none">
          <div className="space-y-8 text-zinc-300">
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction and Statement of Purpose</h2>
              <p className="leading-relaxed">
                This document (&quot;the Terms Agreement&quot;) constitutes a binding legal agreement between the user (&quot;the User,&quot; &quot;you&quot;) and the application operator (&quot;the Operator&quot;). By accessing, installing, or using any part of the Application, you hereby confirm that you have read, understood, and agreed to all the terms set forth below. This agreement is intended to ensure the protection of the Operator&apos;s and the User&apos;s rights, to establish rules and conditions for proper use, and to ensure a safe and consistent environment while complying with all regulations and laws applicable in the State of Israel and in places where the services are provided.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Definitions and Terms</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-cyan-400">&quot;The Application&quot;</strong> – Includes all software, services, platforms, and content provided by the Operator, including future updates, changes, and upgrades.</li>
                <li><strong className="text-cyan-400">&quot;The Operator&quot;</strong> – Refers to all entities, shareholders, developers, managers, and parties involved in the management, development, maintenance, and support of the Application.</li>
                <li><strong className="text-cyan-400">&quot;The User&quot;</strong> – Any person, organization, or legal entity that has registered for or uses the Application&apos;s services, subject to their full agreement to the terms of use detailed in this document.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Acceptance of Terms and Binding Agreement</h2>
              <p className="leading-relaxed">
                Use of the Application constitutes absolute and irreversible agreement to all the terms detailed in this document. If you do not agree to any part of the terms, you must cease using the Application immediately. Any continued use will constitute confirmation of agreement and commitment to these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Granting of Limited Use License</h2>
              <p className="leading-relaxed">
                The Operator grants the User a non-exclusive, non-transferable, and limited license for personal or internal use of the Application only. You may not copy, reproduce, distribute, publish, modify, transmit, or create derivative works from any of the Application&apos;s content, except with prior written approval from the Operator. Any violation will be considered a serious offense and will result in legal action.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Prohibited Use and Unlawful Use</h2>
              <p className="leading-relaxed">
                The User undertakes not to exploit the Application for illegal or malicious purposes or to harm the rights of third parties. The use of any content or services for offensive purposes, theft, incitement, copyright infringement, or criminal offenses will constitute immediate grounds for termination of access and the activation of legal sanctions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Information Security and Privacy Protection</h2>
              <p className="leading-relaxed">
                The Operator takes all reasonable measures to maintain the confidentiality and security of the information transmitted by the User. However, it cannot guarantee absolute protection against breaches, theft, leaks, or technical damage. The use of the Application is at the User&apos;s sole responsibility, and the Operator will not be liable for any direct or indirect damage resulting from improper use or security breaches.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Privacy Policy and Data Collection</h2>
              <p className="leading-relaxed">
                The use of the Application is subject to the Operator&apos;s Privacy Policy, which includes all measures for collecting, processing, storing, and sharing personal information. The User declares that they have read, understood, and agree to all the provisions of the policy, and to the use of the information as detailed therein.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Copyright and Intellectual Property</h2>
              <p className="leading-relaxed">
                All content, designs, images, logos, symbols, and trademarks appearing in the Application are the exclusive property of the Operator or of third parties authorized to use them. They may not be used for commercial or advertising purposes without obtaining written permission from the Operator. Any infringement of these rights will be considered a serious offense.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. User Declarations and Obligations</h2>
              <p className="leading-relaxed">
                The User declares that all information provided as part of using the Application is correct, complete, and current. The User undertakes to update information in the event of changes, and not to provide false or misleading information. Likewise, the User undertakes not to publish, upload, or distribute content that may harm the rights or good name of others.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Limitation of Liability and Disclaimer of Warranty</h2>
              <p className="leading-relaxed">
                The Application is provided &quot;as is&quot; and without any warranty or liability, whether express or implied, including but not limited to warranties regarding suitability, availability, accuracy, or reliability of the content. In any case, the Operator&apos;s liability is limited to the amount actually paid by the User for the service, and does not include damages for loss of profits, indirect, or consequential damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Indemnification and Legal Protection</h2>
              <p className="leading-relaxed">
                The User undertakes to indemnify, defend, and compensate the Operator, its shareholders, developers, and any involved party, for any claim, damage, loss, cost, or expense arising from the violation of the terms of this agreement or illegal use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Updates and Changes to Terms</h2>
              <p className="leading-relaxed">
                The Operator reserves the right to change, update, or improve the terms of use at any time, without prior notice. Any change will be published in the Application, and continued use of the service will constitute the User's agreement to these changes. The User is requested to review the terms from time to time to stay updated.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Service Termination and End of Permissions</h2>
              <p className="leading-relaxed">
                The Operator may, at its sole discretion, terminate the service or the User&apos;s permissions in the event of a violation of the terms of use or misuse of the service. In the event of termination of permissions, the User is not entitled to sue or demand any compensation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">14. Use of Third-Party Services</h2>
              <p className="leading-relaxed">
                The Application may contain links, integrations, or services provided by third parties. The use of these services is subject to the terms of use and privacy policies of those parties, and the Operator is not responsible for any damage, loss, or infringement of rights arising from the use of third-party services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">15. Responsibility for User Content and System Actions</h2>
              <p className="leading-relaxed">
                The User is solely responsible for all content they upload, share, or publish in the Application. The Operator bears no responsibility for any damage, loss, or claim arising from content uploaded by other users. Any claim concerning the violation of rights or harm to third-party rights will be handled in accordance with the provisions of the law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">16. Dispute Resolution and Arbitration</h2>
              <p className="leading-relaxed">
                Any dispute or conflict relating to this agreement will be clarified through binding arbitration, in accordance with the provisions of the law and procedures customary in the State of Israel. The arbitrator&apos;s decision will be final and binding on all parties, and there is no appeal against it in the courts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">17. Limitation of Technical Liability and Service Malfunctions</h2>
              <p className="leading-relaxed">
                The Operator will not be responsible for any malfunction, damage, or technical problem that may be caused as a result of using the Application, including system failures, communication disruptions, damage resulting from downloads or updates, or other operational problems.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">18. Special Conditions for Business Users</h2>
              <p className="leading-relaxed">
                If the User represents a business entity, the use of the service will be subject to separate agreements that will include terms adapted for providing the service within the framework of business activity. The User undertakes to comply with all provisions, laws, and regulations applicable to business activity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">19. Protection of Confidentiality and Business Information</h2>
              <p className="leading-relaxed">
                All business, technological, or confidential information transmitted within the framework of using the Application will be considered confidential. The User undertakes to maintain the confidentiality of the information, not to transfer it to third parties except with written approval from the Operator and subject to the requirements of the law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">20. Rights to Use Third-Party Intellectual Property</h2>
              <p className="leading-relaxed">
                The Operator may use the intellectual property rights, software, symbols, and trademarks of third parties, in accordance with the required agreements and permissions. The User undertakes not to take any action that harms these rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">21. Compliance with International Regulatory Requirements</h2>
              <p className="leading-relaxed">
                The use of the Application will be carried out in accordance with international requirements and regulations, including privacy protection laws, copyrights, international trade, and information security regulations, as applicable. The User undertakes to comply with all applicable legal and regulatory requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">22. Official Notices, Demands, and Contact</h2>
              <p className="leading-relaxed">
                Any notice, demand, or inquiry from the User to the Operator will be made through the dedicated support system or the official email address. These notices will be considered as delivered at the time they are sent and will form an integral part of this terms agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">23. Use of APIs and Additional Technological Services</h2>
              <p className="leading-relaxed">
                The use of APIs, integration services, or any other technological means operated within the Application is subject to the instructions and procedures that will be published by the Operator. The User undertakes not to exceed these limitations or harm the system's security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">24. Upgrades, Updates, and Technological Improvements</h2>
              <p className="leading-relaxed">
                The Operator reserves the right to perform updates, fixes, improvements, and technological changes to the Application at any time, in order to improve the service's performance, information security, and the system's adaptation to market demands. Any update will form an integral part of this terms agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">25. Preservation of Confidentiality and Trade Secrets</h2>
              <p className="leading-relaxed">
                The Operator and the User undertake to maintain the confidentiality of the business, technological, and personal information transferred between them, and to take all necessary measures to maintain this confidentiality, in accordance with the requirements of the law and regulation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">26. Prevention of Misuse and Malicious Use</h2>
              <p className="leading-relaxed">
                The User undertakes not to use the Application in any way that could cause harm to the safety, stability, or proper functioning of the service, including cyber-attacks, use of malicious software, or attempts to bypass security mechanisms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">27. Code of Conduct and User Behavior</h2>
              <p className="leading-relaxed">
                The User undertakes to maintain proper and professional rules of conduct when using the Application, to avoid behavior that could lead to disruptions in the service or harm to third-party rights, and to act in good faith and responsibly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">28. Rights to Change and Adapt to Legal Conditions</h2>
              <p className="leading-relaxed">
                The Operator may update the terms of use agreement in accordance with legal, regulatory, or risk considerations. Any change or update will take effect upon its publication, and continued use of the service will constitute the User's agreement to these changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">29. Consent to Receive Advertising and Marketing Content</h2>
              <p className="leading-relaxed">
                By using the Application, the User agrees to receive updates, offers, and advertising services from the Operator, in accordance with the provisions of the law. The User may, at any time, cancel their consent to receive this content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">30. General Clauses and Legal Limitations</h2>
              <p className="leading-relaxed">
                (a) This agreement constitutes the full and exclusive agreement between the parties, and supersedes any prior agreement – whether oral or written.<br/>
                (b) If a specific clause is found to be invalid or unenforceable, the rest of the clauses will remain in full force.<br/>
                (c) Failure to exercise a right by the Operator will not constitute a waiver of that right.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">31. Applicable Law and Jurisdiction</h2>
              <p className="leading-relaxed">
                This terms agreement will be subject to the laws of the State of Israel, and any dispute concerning the agreement will be brought for discussion in the competent courts in Israel. The parties agree that any claim or dispute will be discussed in accordance with the provisions of local law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">32. Declaration of Reading, Understanding, and Agreement</h2>
              <p className="leading-relaxed">
                By clicking &quot;I agree&quot; and continuing to use the Application, the User declares that they have read, understood, and agreed to all the clauses and conditions detailed in this document, and that the use is made out of conscious and full agreement to all its provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">33. Indemnification and Future Amendments</h2>
              <p className="leading-relaxed">
                The Operator may update additional regulations, procedures, and instructions which will form an integral part of the agreement. The User undertakes to comply with any new regulation that is published, without any claim of lack of knowledge or surprise.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">34. Delivery of Notices and Official Documents</h2>
              <p className="leading-relaxed">
                Any notice or official document transferred between the Operator and the User will be considered properly delivered through electronic means and will form an integral part of this terms agreement. The User agrees to receive all notices by these means.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">35. Obligation to Monitor and Comply with Regulatory Regulations</h2>
              <p className="leading-relaxed">
                The User undertakes to act in accordance with all regulations, laws, or regulatory instructions applicable to the use of the Application, including instructions relating to privacy protection, information security, and copyrights. Any violation will be handled in accordance with legal procedures.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">36. Term of Agreement and its Renewal</h2>
              <p className="leading-relaxed">
                This terms agreement will enter into force upon the initial use of the Application and will continue until its cancellation by one of the parties. The Operator reserves the right to update the agreement from time to time, and any change will form an integral part of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">37. Consent to Receive Electronic Documents and Correspondence</h2>
              <p className="leading-relaxed">
                Any document, notice, or alert transferred between the Operator and the User will be considered as delivered electronically and will apply as an integral part of this terms agreement, while maintaining their legal validity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">38. Consent to Use Technical and Proprietary Information</h2>
              <p className="leading-relaxed">
                The User agrees that all technical information, updates, data, and software transferred within the Application are the exclusive property of the Operator, and may not be transferred to a third party or used beyond what is planned within the framework of the terms of use.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">39. Reservation of Rights and Trade Secrecy</h2>
              <p className="leading-relaxed">
                The Operator reserves all rights to technologies, data, developments, and trade secrets related to the Application. The User undertakes not to perform any actions that could harm these rights or expose sensitive commercial information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">40. Termination of Agreement and Imposition of Sanctions in Case of Breach</h2>
              <p className="leading-relaxed">
                In the event of a violation of the terms of use, a system of sanctions may be activated, including restricting access, claims for damages, and legal proceedings. The Operator reserves the right to take all necessary legal measures to protect its rights.
              </p>
            </section>

            {/* Closing Statement */}
            <div className="mt-12 p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg backdrop-blur-sm">
              <p className="text-center text-zinc-300 leading-relaxed">
                Thank you for choosing to use our services. We are committed to providing you with quality, secure, and advanced service, while complying with all applicable regulations and laws and providing a quick and efficient response to any inquiry.
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
