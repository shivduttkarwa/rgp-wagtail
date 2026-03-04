import "./LegalPage.css";

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="legal-hero">
        <div className="legal-hero__inner">
          <span className="legal-hero__eyebrow">Real Gold Properties</span>
          <h1 className="legal-hero__title">Privacy Policy</h1>
          <p className="legal-hero__meta">Last updated: February 2026</p>
        </div>
      </div>

      <div className="legal-content">
        <div className="legal-content__inner">

          <div className="legal-section">
            <h2>Overview</h2>
            <p>
              Real Gold Properties Pty Ltd ("we", "our", or "us") is committed to protecting your
              personal information in accordance with the <em>Privacy Act 1988</em> (Cth) and the
              Australian Privacy Principles (APPs). This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you visit our website or engage
              with our services.
            </p>
            <p>
              By using our website or engaging our services, you consent to the practices described
              in this policy. We encourage you to read it carefully.
            </p>
          </div>

          <div className="legal-section">
            <h2>Information We Collect</h2>
            <p>We may collect the following types of personal information:</p>
            <ul>
              <li>Full name, email address, phone number, and postal address</li>
              <li>Property preferences, budget, and enquiry details submitted via contact forms</li>
              <li>Financial information where required for property transactions (handled securely)</li>
              <li>Browser type, IP address, and device information collected automatically via cookies</li>
              <li>Records of your communications with us, including emails and call logs</li>
            </ul>
            <p>
              We only collect information that is necessary for the purposes for which it is
              collected, and we take reasonable steps to ensure it is accurate, up to date, and
              complete.
            </p>
          </div>

          <div className="legal-section">
            <h2>How We Use Your Information</h2>
            <p>Your personal information is used to:</p>
            <ul>
              <li>Respond to property enquiries and provide personalised advisory services</li>
              <li>Facilitate property purchases, sales, leasing, and investment transactions</li>
              <li>Send relevant property listings, market updates, and service communications</li>
              <li>Improve the functionality and user experience of our website</li>
              <li>Meet legal and regulatory obligations, including those under Queensland real estate law</li>
              <li>Maintain records required by the <em>Property Occupations Act 2014</em> (Qld)</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>Disclosure to Third Parties</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties for their
              marketing purposes. We may share your information with:
            </p>
            <ul>
              <li>Solicitors, conveyancers, and financial institutions involved in your transaction</li>
              <li>Property management and maintenance contractors where applicable</li>
              <li>Government bodies or regulatory authorities as required by law</li>
              <li>Technology service providers who assist us in delivering our services (under strict confidentiality agreements)</li>
            </ul>
            <p>
              Where we disclose information to overseas recipients, we take reasonable steps to
              ensure those recipients handle your information in accordance with the APPs.
            </p>
          </div>

          <div className="legal-section">
            <h2>Marketing Communications</h2>
            <p>
              With your consent, we may send you information about properties, market insights,
              and services we believe may be of interest to you. You may opt out of marketing
              communications at any time by:
            </p>
            <ul>
              <li>Clicking the "Unsubscribe" link in any email we send</li>
              <li>Contacting us directly at <a href="mailto:admin@realgoldproperties.com.au">admin@realgoldproperties.com.au</a></li>
            </ul>
            <p>
              We will process opt-out requests promptly and no later than within five business days.
            </p>
          </div>

          <div className="legal-section">
            <h2>Data Security</h2>
            <p>
              We take reasonable technical and organisational measures to protect your personal
              information from misuse, loss, unauthorised access, modification, or disclosure.
              These include secure server infrastructure, access controls, and encrypted data
              transmission (SSL/TLS).
            </p>
            <p>
              While we take all reasonable precautions, no data transmission over the internet
              can be guaranteed as completely secure. You provide information at your own risk.
            </p>
          </div>

          <div className="legal-section">
            <h2>Cookies</h2>
            <p>
              Our website uses cookies to enhance your browsing experience and to analyse site
              traffic. For full details on how we use cookies and how to manage your preferences,
              please refer to our <a href="/cookies">Cookie Policy</a>.
            </p>
          </div>

          <div className="legal-section">
            <h2>Access and Correction</h2>
            <p>
              You have the right to request access to the personal information we hold about you
              and to request corrections if you believe it is inaccurate, incomplete, or
              out of date. We will respond to access requests within 30 days.
            </p>
            <p>
              In some circumstances we may be required to refuse access. If we do, we will
              provide written reasons for that refusal.
            </p>
          </div>

          <div className="legal-section">
            <h2>Complaints</h2>
            <p>
              If you believe we have not complied with this policy or the Australian Privacy
              Principles, please contact us in the first instance. We will acknowledge your
              complaint within five business days and endeavour to resolve it within 30 days.
            </p>
            <p>
              If you are not satisfied with our response, you may lodge a complaint with the
              Office of the Australian Information Commissioner (OAIC) at{" "}
              <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer">
                www.oaic.gov.au
              </a>.
            </p>
          </div>

          <div className="legal-section">
            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our
              practices or applicable law. The most current version will always be published on
              this page with the updated date shown at the top.
            </p>
          </div>

          <div className="legal-section">
            <h2>Contact Us</h2>
            <p>For any privacy-related enquiries, please contact our Privacy Officer:</p>
            <div className="legal-contact-block">
              <p>Real Gold Properties Pty Ltd</p>
              <p>PO Box 4024, Forest Lake QLD 4078, Australia</p>
              <p>
                Email:{" "}
                <a href="mailto:admin@realgoldproperties.com.au">
                  admin@realgoldproperties.com.au
                </a>
              </p>
              <p>
                Phone: <a href="tel:+61450009291">0450 009 291</a>
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
