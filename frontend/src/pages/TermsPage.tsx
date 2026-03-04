import "./LegalPage.css";

export default function TermsPage() {
  return (
    <main className="legal-page">
      <div className="legal-hero">
        <div className="legal-hero__inner">
          <span className="legal-hero__eyebrow">Real Gold Properties</span>
          <h1 className="legal-hero__title">Terms of Service</h1>
          <p className="legal-hero__meta">Last updated: February 2026</p>
        </div>
      </div>

      <div className="legal-content">
        <div className="legal-content__inner">

          <div className="legal-section">
            <h2>Agreement to Terms</h2>
            <p>
              By accessing and using the Real Gold Properties website (realgoldproperties.com.au)
              or engaging with our services, you agree to be bound by these Terms of Service
              ("Terms") and all applicable laws and regulations. If you do not agree with any of
              these Terms, you must not use this website.
            </p>
            <p>
              These Terms constitute a legally binding agreement between you and Real Gold
              Properties Pty Ltd (ABN to be confirmed), a real estate agency operating under
              the laws of Queensland, Australia.
            </p>
          </div>

          <div className="legal-section">
            <h2>Nature of Information</h2>
            <p>
              The information on this website is provided for general informational purposes only.
              It does not constitute financial, legal, or investment advice. Property listings,
              prices, availability, and market information are indicative only and subject to
              change without notice.
            </p>
            <p>
              You should obtain independent professional advice before making any property
              purchase, sale, lease, or investment decision. Real Gold Properties makes no
              warranties as to the accuracy, completeness, or suitability of any information
              on this website.
            </p>
          </div>

          <div className="legal-section">
            <h2>Property Listings</h2>
            <p>
              All property listings displayed on this website are for informational purposes only.
              Listing details — including price, availability, features, and photography — are
              provided in good faith but may not reflect the current status of a property.
            </p>
            <ul>
              <li>Properties shown as available may have been sold, leased, or withdrawn</li>
              <li>Prices and terms are subject to negotiation and may change at any time</li>
              <li>Floor plans, renders, and photographs are indicative only</li>
              <li>We accept no liability for decisions made based solely on listing information</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>Licence to Use Website</h2>
            <p>
              We grant you a limited, non-exclusive, non-transferable licence to access and use
              this website for your personal, non-commercial use. You must not:
            </p>
            <ul>
              <li>Reproduce, distribute, or republish any content from this website without our written consent</li>
              <li>Use automated tools, bots, or scrapers to extract data from the website</li>
              <li>Use the website in any manner that could damage, disable, or impair its operation</li>
              <li>Attempt to gain unauthorised access to any part of the website or its connected systems</li>
              <li>Use content from this website for commercial purposes without prior written permission</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>Intellectual Property</h2>
            <p>
              All content on this website — including text, images, photography, graphics, logos,
              video, and software — is the property of Real Gold Properties Pty Ltd or our
              licensors and is protected by Australian copyright law.
            </p>
            <p>
              "Real Gold Properties" and associated logos are trademarks of Real Gold Properties
              Pty Ltd. You may not use our trademarks without our prior written consent.
            </p>
          </div>

          <div className="legal-section">
            <h2>User Conduct</h2>
            <p>When using this website or communicating with us, you agree not to:</p>
            <ul>
              <li>Provide false, misleading, or fraudulent information</li>
              <li>Transmit harmful, defamatory, offensive, or unlawful material</li>
              <li>Impersonate any person, entity, or real estate agent</li>
              <li>Use the site in any way that violates applicable laws or regulations</li>
              <li>Interfere with other users' enjoyment of the website</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites for your convenience. These
              links do not constitute an endorsement by Real Gold Properties. We have no control
              over the content of those websites and accept no responsibility for them or any
              loss or damage arising from your use of them.
            </p>
          </div>

          <div className="legal-section">
            <h2>Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Real Gold Properties, its directors,
              employees, and agents shall not be liable for any direct, indirect, incidental,
              consequential, or punitive damages arising out of your use of, or inability to
              use, this website or our services.
            </p>
            <p>
              Nothing in these Terms limits any rights you have under the{" "}
              <em>Australian Consumer Law</em> (Schedule 2 of the{" "}
              <em>Competition and Consumer Act 2010</em>) which cannot be excluded.
            </p>
          </div>

          <div className="legal-section">
            <h2>Privacy</h2>
            <p>
              Your use of this website is also governed by our{" "}
              <a href="/privacy">Privacy Policy</a>, which is incorporated into these Terms by
              reference. Please review the Privacy Policy to understand our practices.
            </p>
          </div>

          <div className="legal-section">
            <h2>Governing Law</h2>
            <p>
              These Terms are governed by the laws of Queensland, Australia. Any disputes arising
              in connection with these Terms are subject to the exclusive jurisdiction of the
              courts of Queensland, Australia.
            </p>
          </div>

          <div className="legal-section">
            <h2>Changes to These Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes take effect
              immediately upon publication on this page. Your continued use of the website
              after any changes constitutes your acceptance of the revised Terms.
            </p>
          </div>

          <div className="legal-section">
            <h2>Contact Us</h2>
            <p>
              For questions about these Terms of Service, please contact us:
            </p>
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
