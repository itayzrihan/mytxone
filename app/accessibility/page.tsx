import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accessibility Statement - MYTX.one",
  description: "Comprehensive accessibility statement for MYTX.one AI-powered digital services platform.",
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-cyan-400">Accessibility Statement</span>
          </h1>
          <p className="text-xl text-zinc-400">
            Our Commitment to Digital Accessibility
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-cyan max-w-none">
          <div className="space-y-8 text-zinc-300">
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction and Declaration of Principles</h2>
              <p className="leading-relaxed">
                This document (&quot;the Accessibility Statement&quot;) constitutes a comprehensive legal statement describing the accessibility principles and the Operator&apos;s commitments regarding the application (&quot;the Application&quot;). The Application was designed with the aim of being accessible to a wide range of users, including users with disabilities, in accordance with most current standards and guidelines in the field. However, it must be emphasized that due to budgetary constraints and ongoing development processes, not all accessibility functions are fully implemented on all platforms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Scope of Accessibility and Use on Different Platforms</h2>
              
              <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">2.1. Basic and Advanced Accessibility:</h3>
              <p className="leading-relaxed">
                We make every effort to provide an accessible user interface, both on mobile and on the website. The Application is available for use as a web page in modern browsers, but it should be remembered that the adaptation of all features to the full accessibility standards may be limited due to limited resources.
              </p>

              <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">2.2. Adaptation to Different Devices:</h3>
              <p className="leading-relaxed">
                We strive to enable convenient access via mobile devices, tablets, and desktops, but it cannot be guaranteed that every operating system or browser fully supports all required accessibility functions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Commitment to Continuous Improvement of Accessibility</h2>
              <p className="leading-relaxed">
                The Operator is committed to continuing to improve the level of accessibility in every future update as resources and budgets allow. We follow technological developments and international guidelines in the field of accessibility, but it should be noted that development is conducted within a limited budgetary framework, and therefore gaps or deficiencies may appear from time to time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Limitation of Legal Liability and Disclaimer</h2>
              
              <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">4.1. Agreement to the Current Situation:</h3>
              <p className="leading-relaxed">
                The User confirms and is aware that, despite all efforts to improve accessibility, there may be cases where some functions or the interface will not be fully accessible. The use of the Application is at the User&apos;s sole responsibility.
              </p>

              <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">4.2. Express Waiver:</h3>
              <p className="leading-relaxed">
                By using the Application, the User expressly waives any legal claim or demand for compensation regarding the failure to fully meet accessibility requirements, including technical faults, interface deficiencies, non-compliance with accessibility guidelines, or any other damage arising from imperfect use of accessibility functions.
              </p>

              <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">4.3. Additional Limitations:</h3>
              <p className="leading-relaxed">
                Any claim or demand related to accessibility deficiencies – whether caused by bugs, system failures, or any other factor – will be subject to these agreements, and they do not provide a legal basis to claim compensation or liability from the Operator.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Declaration of Development Status and Budgetary Constraints</h2>
              <p className="leading-relaxed">
                The Application is constantly evolving but is managed within a limited budgetary framework. These resources affect our ability to implement all accessible features as recommended by modern standards. The User is requested to take this into account and understand that necessary improvements and upgrades may be carried out gradually.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Recommendations for Use and Improving User Experience</h2>
              <p className="leading-relaxed mb-3">To ensure an optimal user experience:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>It is recommended to ensure that the operating system and internet browser are updated to the latest version.</li>
                <li>When using the site, browsers that fully support accessibility standards should be used.</li>
                <li>Reporting of deficiencies or accessibility problems will be welcome and will be used for the continued improvement of the product.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. User Rights and Operator Obligations</h2>
              
              <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">7.1. User Rights:</h3>
              <p className="leading-relaxed">
                The User is entitled to receive explanations, to inform the Operator of any lack of accessibility or problem, and to suggest improvements. Every report will be examined to the extent possible and will be addressed according to the available resources.
              </p>

              <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">7.2. Operator Obligations:</h3>
              <p className="leading-relaxed">
                The Operator will act to the best of its ability to correct deficiencies and improve the level of accessibility, but will not be held responsible for delays or for cases where the full level of accessibility is not achieved.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Ways to Get in Touch and Report Accessibility Problems</h2>
              <p className="leading-relaxed">
                Any inquiry, question, or report regarding accessibility can be sent to the email address <a href="mailto:mytxone@gmail.com" className="text-cyan-400 hover:text-cyan-300">mytxone@gmail.com</a> or by phone <a href="tel:0515511591" className="text-cyan-400 hover:text-cyan-300">0515511591</a>. We will endeavor to handle every inquiry as quickly as possible, but we cannot commit to an immediate response in every case.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Changing and Updating the Accessibility Statement</h2>
              <p className="leading-relaxed">
                The Operator reserves the right to update and change this Accessibility Statement in accordance with technological developments, regulatory requirements, and budgetary considerations. Any change will be published clearly, and continued use of the Application constitutes agreement to the changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Additional Provisions and Legal Declarations</h2>
              
              <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">10.1. General Provisions:</h3>
              <p className="leading-relaxed">
                This statement constitutes a binding legal agreement between the User and the Operator. The User confirms that they have read, understood, and agreed to all the clauses detailed in this document, and is aware of the existing accessibility limitations.
              </p>

              <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">10.2. Waiver and Limitation of Liability Clauses:</h3>
              <p className="leading-relaxed">
                The User hereby declares that any deficiency or lack of accessibility does not constitute grounds for a lawsuit, and reliance on these deficiencies does not form a basis for claims for compensation or additional demands against the Operator.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Summary and Declaration of Consent</h2>
              <p className="leading-relaxed">
                By using the Application, the User confirms that they have understood all the clauses and declarations detailed above, including all limitations and waivers relating to accessibility. The use of the Application constitutes express agreement to these arrangements.
              </p>
            </section>

            {/* Closing Statement */}
            <div className="mt-12 p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg backdrop-blur-sm">
              <p className="text-center text-zinc-300 leading-relaxed">
                We are committed to making our services accessible to all users. Your feedback helps us improve. Please report any accessibility issues you encounter.
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
