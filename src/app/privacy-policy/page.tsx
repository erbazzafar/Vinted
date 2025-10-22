import React from 'react';

function PrivacyPolicy() {
    return (
        <div className="max-w-7xl mx-auto p-6 bg-white text-gray-900">
            <header className="text-center mb-12">
                <h1 className="text-3xl font-bold text-teal-600">Affare Doro – Privacy Policy</h1>
                <p className="mt-2 text-lg text-gray-600">Last Updated: 20 October 2025</p>
            </header>

            <section className="space-y-8">
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-500">1. Introduction</h2>
                    <p>Affare Doro ("we", "our", "us") respects your privacy and is committed to protecting your personal data.</p>
                    <p>This Privacy Policy explains how we collect, use, store, and protect information when you use our mobile app, website, and related services (collectively, the "Platform").</p>
                    <p className="font-semibold">By using Affare Doro, you agree to this Privacy Policy.</p>

                    <h2 className="text-2xl font-semibold text-gray-500">2. Data Controller</h2>
                    <p>Affare Doro FZC, registered in Sharjah Publishing City Free Zone (SPC FZ), is the data controller responsible for processing your personal data in accordance with UAE Federal Decree-Law No. 45 of 2021 on Data Protection.</p>
                    <p>For privacy inquiries:</p>
                    <p className="font-semibold">📧 contact@affaredoro.com</p>

                    <h2 className="text-2xl font-semibold text-gray-500">3. Information We Collect</h2>
                    <p>We may collect the following information:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li><strong>Account Information:</strong> Name, email, phone number, date of birth, password.</li>
                        <li><strong>Verification Data (KYC):</strong> Government ID or passport copy (used only for identity verification).</li>
                        <li><strong>Transaction Data:</strong> Payments, refunds, wallet balances, order history.</li>
                        <li><strong>Device & Technical Data:</strong> IP address, browser type, app version, operating system, language settings.</li>
                        <li><strong>Usage Data:</strong> Interactions within the app, viewed items, messages, preferences.</li>
                        <li><strong>Shipping Information:</strong> Address, contact number for deliveries.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-500">4. How We Use Your Information</h2>
                    <p>We process your personal data to:</p>
                    <ol className="list-decimal pl-6 space-y-1">
                        <li>Create and manage your account.</li>
                        <li>Facilitate transactions between buyers and sellers.</li>
                        <li>Verify user identity and prevent fraud.</li>
                        <li>Process payments securely via Stripe.</li>
                        <li>Provide customer support and dispute resolution.</li>
                        <li>Send essential service notifications (e.g., order updates).</li>
                        <li>Improve the Platform's features and security.</li>
                        <li>Comply with applicable UAE laws and Free Zone regulations.</li>
                    </ol>
                    <p className="font-semibold mt-2">We do not sell, rent, or trade personal data to third parties.</p>

                    <h2 className="text-2xl font-semibold text-gray-500">5. Legal Basis for Processing</h2>
                    <p>Your personal data is processed based on one or more of the following:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Performance of a contract (e.g., buying or selling an item).</li>
                        <li>Compliance with legal obligations.</li>
                        <li>Legitimate business interests (fraud prevention, service improvement).</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-500">6. Payment Data</h2>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>All payments are processed through Stripe, a PCI-DSS-compliant provider.</li>
                        <li>Affare Doro does not store your full card details. Stripe processes your data according to its own Privacy Policy.</li>
                        <li>Funds may be held temporarily by Affare Doro until buyer confirmation or automatic acceptance (manual escrow handling).</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-500">7. Data Retention</h2>
                    <p>We retain your data only as long as necessary for:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Account operation and legal obligations;</li>
                        <li>Transaction records (minimum 5 years as required by UAE law);</li>
                        <li>Dispute resolution or regulatory purposes.</li>
                    </ul>
                    <p className="mt-2">After closure or expiration, your data will be securely deleted or anonymised.</p>

                    <h2 className="text-2xl font-semibold text-gray-500">8. Data Sharing & Disclosure</h2>
                    <p>We may share information only with:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li><strong>Service Providers:</strong> Payment processor (Stripe), shipping partners, IT support.</li>
                        <li><strong>Regulatory Authorities:</strong> If legally required.</li>
                        <li><strong>Business Partners:</strong> Within the SPC Free Zone or authorised vendors assisting operations.</li>
                    </ul>
                    <p className="mt-2">All third parties must comply with confidentiality and data-protection requirements.</p>

                    <h2 className="text-2xl font-semibold text-gray-500">9. Data Security</h2>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>We use industry-standard encryption, secure servers, and strict access controls to protect personal data.</li>
                        <li>Users are responsible for safeguarding their login credentials.</li>
                        <li>In such cases, we ensure appropriate safeguards and contractual protections in line with UAE data-protection requirements.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-500">10. Your Rights</h2>
                    <p>Under UAE law, you have the right to:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Access a copy of your data.</li>
                        <li>Request correction or deletion.</li>
                        <li>Withdraw consent at any time (where applicable).</li>
                        <li>Object to or restrict processing.</li>
                        <li>File a complaint with the UAE Data Office.</li>
                    </ul>
                    <p className="mt-2 font-semibold">To exercise your rights: contact@affaredoro.com</p>

                    <h2 className="text-2xl font-semibold text-gray-500">11. Children's Privacy</h2>
                    <p>Affare Doro is intended for users aged 18 and above.</p>
                    <p>We do not knowingly collect data from minors. If we learn that we have collected information from someone under 18, we will delete it promptly.</p>

                    <h2 className="text-2xl font-semibold text-gray-500">12. Updates to This Policy</h2>
                    <p>We may update this Privacy Policy from time to time.</p>
                    <p>Material changes will be announced through our Platform or by email.</p>
                    <p className="font-semibold">Your continued use after updates constitutes acceptance of the revised policy.</p>

                    <h2 className="text-2xl font-semibold text-gray-500">13. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy or how we handle your data:</p>
                    <p className="font-semibold">📧 contact@affaredoro.com</p>
                    <p className="font-semibold">📱 +971 506570211</p>

                    <p className="text-center mt-12 text-lg font-semibold text-teal-600">
                        Thank you for being part of the Affare Doro community of deal hunters!
                    </p>
                </div>
            </section>
        </div>
    );
}

export default PrivacyPolicy;
