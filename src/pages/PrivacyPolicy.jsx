import React from "react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
    const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 py-16 px-6">
      <div className="max-w-4xl mx-auto bg-neutral-900 rounded-2xl shadow-lg p-8 md:p-12">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-400 mb-8">
          Privacy Policy
        </h1>
        {/* <p className="text-sm text-neutral-400 text-center mb-10">
          Effective Date: <span className="text-neutral-300">[Insert Date]</span>
        </p> */}

        {/* Content */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-semibold text-neutral-100 mb-3">
              1. Information We Collect
            </h2>
            <ul className="list-disc list-inside space-y-2 text-neutral-300">
              <li>
                <span className="font-medium">Personal Information:</span> Name,
                email address, and university/college details (when you register).
              </li>
              <li>
                <span className="font-medium">Usage Information:</span> Pages you
                visit, quizzes attempted, scores, and activity logs, plus device
                and browser info.
              </li>
              <li>
                <span className="font-medium">Optional Information:</span>{" "}
                Feedback, comments, and survey responses.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-semibold text-neutral-100 mb-3">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2 text-neutral-300">
              <li>To create and manage your account.</li>
              <li>To deliver news updates, quizzes, and recommendations.</li>
              <li>To analyze quiz performance and provide rankings.</li>
              <li>To improve security, features, and user experience.</li>
              <li>
                To send important notifications about account or service changes.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-semibold text-neutral-100 mb-3">
              3. Sharing of Information
            </h2>
            <p className="text-neutral-300">
              We do not sell or rent your data. However, we may share your
              information:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-2 text-neutral-300">
              <li>With trusted service providers (hosting, analytics, email).</li>
              <li>If required by law or legal process.</li>
              <li>
                To protect the rights, safety, and security of users and the
                platform.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-semibold text-neutral-100 mb-3">
              4. Cookies and Tracking
            </h2>
            <p className="text-neutral-300">
              We use cookies to keep you logged in securely, remember preferences,
              and analyze usage. You may disable cookies, but some features may
              not work properly.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-semibold text-neutral-100 mb-3">
              5. Data Security
            </h2>
            <p className="text-neutral-300">
              We implement strong security measures to protect your data. However,
              no online system is completely risk-free, so please safeguard your
              login credentials.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold text-neutral-100 mb-3">
              6. Your Rights
            </h2>
            <ul className="list-disc list-inside space-y-2 text-neutral-300">
              <li>Access and update your personal information.</li>
              <li>Request deletion of your account and data.</li>
              <li>Opt-out of promotional emails.</li>
            </ul>
            <p className="mt-2 text-neutral-300">
              To exercise these rights, contact us at{" "}
              <span className="text-blue-400">[support email]</span>.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-semibold text-neutral-100 mb-3">
              7. Children’s Privacy
            </h2>
            <p className="text-neutral-300">
              Our platform is intended for university students and staff. We do
              not knowingly collect personal data from children under 13. If you
              believe we have, please contact us immediately.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-semibold text-neutral-100 mb-3">
              8. Changes to This Policy
            </h2>
            <p className="text-neutral-300">
              We may update this Privacy Policy from time to time. Updates will be
              posted here with a revised effective date.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-semibold text-neutral-100 mb-3">
              9. Contact Us
            </h2>
            <p className="text-neutral-300">
              If you have any questions, please contact us:
            </p>
            <ul className="list-disc list-inside mt-2 text-neutral-300">
              <li>Email: <span className="text-blue-400">[support email]</span></li>
              <li>Address: <span className="text-neutral-400">[University/Platform Address]</span></li>
            </ul>
          </section>

          <button onClick={() => navigate('/register')} className="mt-4 cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
