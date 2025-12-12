import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 bg-white text-gray-900">
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold text-teal-600">Affare Doro Terms and Conditions</h1>
        <p className="mt-2 text-lg text-gray-600">Last Updated: 16/10/2025</p>
      </header>

      <section className="space-y-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-500">1. Our Role & Service Introduction</h2>
          <p>Affare Doro operates as an intermediary online marketplace platform that facilitates transactions between individual buyers and sellers. We provide the technological infrastructure, payment processing, and community guidelines to enable users to trade pre-owned and new consumer goods directly with each other.</p>

          <p>Key aspects of our role include:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Platform Provider:</strong> We offer the digital marketplace where users can list, discover, and purchase items</li>
            <li><strong>Transaction Facilitator:</strong> We provide secure payment processing through our escrow system and wallet service</li>
            <li><strong>Dispute Resolution:</strong> We offer Buyer Protection services and mediate conflicts between users</li>
            <li><strong>Community Manager:</strong> We establish and enforce rules to maintain a safe, fair trading environment</li>
          </ul>

          <p><strong>What we are NOT:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>We are not a direct retailer, merchant, or reseller of items on our platform</li>
            <li>We are not the agent of any buyer or seller</li>
            <li>We do not take ownership or possession of items being traded</li>
            <li>We do not provide shipping or delivery services</li>
            <li>We are not an insurance provider</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-500">2. User Eligibility</h2>
          <p>By using Affare Doro, you confirm that you:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Are at least 18 years old</li>
            <li>Use our service for personal, non-commercial purposes only</li>
            <li>Possess legal capacity to enter binding contracts</li>
            <li>Are responsible for all activities under your account</li>
            <li>Agree to these Terms and our Privacy Policy</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-500">3. Account Management</h2>

          <h3 className="text-xl font-semibold text-gray-500">3.1 Registration</h3>
          <p>You must create an account to buy or sell on our platform. Provide accurate information and maintain account security.</p>

          <h3 className="text-xl font-semibold text-gray-500">3.2 Identity Verification (KYC)</h3>
          <p>We require one-time identity verification to ensure community safety. You'll need to provide valid government-issued ID. Your data is protected per our Privacy Policy.</p>

          <h3 className="text-xl font-semibold text-gray-500">3.3 Account Restrictions</h3>
          <p>We reserve the right to restrict, suspend, or terminate accounts for violations of these Terms.</p>

          <h2 className="text-2xl font-semibold text-gray-500">4. Permitted and Prohibited Conduct</h2>

          <h3 className="text-xl font-semibold text-gray-500">4.1 You MUST:</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide accurate information</li>
            <li>Treat all users respectfully</li>
            <li>Use services in compliance with applicable laws</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-500">4.2 You MUST NOT:</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Share personal contact information</li>
            <li>Send spam or unsolicited mass messages (5+ users)</li>
            <li>List prohibited items (Section 7)</li>
            <li>Sell bulk-purchased or drop-shipped items</li>
            <li>Circumvent our transaction system</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-500">5. Buying on Affare Doro</h2>

          <h3 className="text-xl font-semibold text-gray-500">5.1 Purchase Process</h3>
          <ol className="list-decimal pl-6 space-y-1">
            <li>Click "Buy" on desired item</li>
            <li>Select payment method (Affare Doro Wallet)</li>
            <li>Confirm delivery address</li>
            <li>Complete checkout</li>
          </ol>

          <h3 className="text-xl font-semibold text-gray-500">5.2 Costs Breakdown</h3>
          <p>Total price includes:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Item price (set by seller)</li>
            <li>Platform Service Fee (12% of item price)</li>
            <li>Shipping Fee (16.53 AED + 5% VAT)</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-500">5.3 Inspection Period</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>24 hours to inspect delivered items</li>
            <li>Report issues via "Report an Issue" form for significantly not-as-described items</li>
            <li>Automatic acceptance after 24 hours</li>
            <li>Funds released to seller after acceptance</li>
          </ul>
          <p className="text-red-400 font-semibold">⚠️ Important Warning: Off-platform transactions are at your own risk. We assume no responsibility for such deals.</p>

          <h2 className="text-2xl font-semibold text-gray-500">6. Buyer Service & Refunds</h2>

          <h3 className="text-xl font-semibold text-gray-500">6.1 Coverage</h3>
          <p>Full refunds available for:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Items lost/damaged during shipping</li>
            <li>Significantly not-as-described items</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-500">6.2 Refund Structure</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Scenario</th>
                  <th className="border border-gray-300 px-4 py-2">Protection Fee</th>
                  <th className="border border-gray-300 px-4 py-2">Item Price</th>
                  <th className="border border-gray-300 px-4 py-2">Shipping (To You)</th>
                  <th className="border border-gray-300 px-4 py-2">Return Shipping</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Lost/Damaged</td>
                  <td className="border border-gray-300 px-4 py-2">Refunded</td>
                  <td className="border border-gray-300 px-4 py-2">Refunded</td>
                  <td className="border border-gray-300 px-4 py-2">Not Refunded</td>
                  <td className="border border-gray-300 px-4 py-2">N/A</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Not as Described</td>
                  <td className="border border-gray-300 px-4 py-2">Refunded</td>
                  <td className="border border-gray-300 px-4 py-2">Refunded</td>
                  <td className="border border-gray-300 px-4 py-2">Not Refunded</td>
                  <td className="border border-gray-300 px-4 py-2">Not Refunded</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2">Sellers receive full item price refund for lost/damaged items.</p>
          <p className="mt-2 font-semibold">Refunds are processed according to UAE Consumer Protection Law (Cabinet Decision No.66 of 2022)</p>

          <h3 className="text-xl font-semibold text-gray-500">6.3 Claims Process</h3>
          <ol className="list-decimal pl-6 space-y-1">
            <li>File claim within 24 hours of delivery</li>
            <li>Return item (if applicable) at your expense</li>
            <li>Receive refund after verification</li>
          </ol>
          <p className="mt-2"><strong>Note:</strong> The platform Service Fee is a platform service charge and does not constitute an insurance product under UAE law.</p>

          <h2 className="text-2xl font-semibold text-gray-500">7. Selling on Affare Doro</h2>

          <h3 className="text-xl font-semibold text-gray-500">7.1 Permitted Items</h3>
          <p>You may sell items you physically possess in these categories:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Fashion:</strong> Women's, Men's, Children's Clothing, Footwear, Accessories (bags, belts, jewelry)</li>
            <li><strong>Baby & Kids:</strong> Children's Toys, Childcare Equipment</li>
            <li><strong>Home & Garden:</strong> Home & Kitchen Ware, Garden Equipment, Furniture (school furniture must be new)</li>
            <li><strong>Entertainment & Hobbies:</strong> Books, Magazines, Music (CDs/DVDs), Collectables (games, stamps, memorabilia)</li>
            <li><strong>Beauty:</strong> New Cosmetics, New Beauty Products</li>
            <li><strong>Pet care:</strong> Pet Care Items</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-500">7.2 Prohibited Items</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Anything not listed above</li>
            <li>Counterfeit/replica items</li>
            <li>Illegal/hazardous goods</li>
            <li>Weapons</li>
            <li>Intellectual property infringements</li>
            <li>Live animals</li>
            <li>Perishables</li>
            <li>Payment processor-violating items</li>
            <li>Medicaments/Tests (COVID-19 tests, pregnancy tests, vitamins)</li>
            <li>Electronics</li>
            <li>Alcoholic beverages or tobacco products</li>
            <li>Religious or culturally sensitive materials</li>
            <li>Gambling or betting-related items</li>
            <li>Used undergarments or personal hygiene items</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-500">7.3 Selling Process</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Create accurate listings with photos</li>
            <li>Ship within 48 hours using prepaid label</li>
            <li>Receive payment after buyer acceptance/auto-acceptance</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-500">7.4 Listing Ranking</h3>
          <p>Listings are ranked based on:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Quality (description, photos, categorization)</li>
            <li>Pricing competitiveness</li>
            <li>Seller performance (shipping speed, reviews)</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-500">8. Seller Verification (KYC) Terms</h2>

          <h3 className="text-xl font-semibold text-gray-500">8.1 One-Time Verification Requirement</h3>
          <p>To ensure marketplace integrity and compliance with financial regulations, we require all sellers to complete a Know Your Customer (KYC) verification process. This verification is mandatory and is performed only one time, prior to the processing of your first withdrawal or payout.</p>

          <h3 className="text-xl font-semibold text-gray-500">8.2 Purpose & Timing</h3>
          <p>The KYC process is designed to verify your identity. It is initiated when you, as a seller, set up your payment method and request your first payout. You will not need to repeat this process for subsequent sales or payments on our platform, barring exceptional legal or security circumstances which will be communicated transparently.</p>

          <h3 className="text-xl font-semibold text-gray-500">8.3 Our Commitment to Security</h3>
          <p>We treat your personal data with the highest level of security:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Encryption:</strong> All data submitted during the KYC process is encrypted in transit.</li>
            <li><strong>Secure Processing:</strong> Your documents and information are processed through a secure, access-controlled environment.</li>
            <li><strong>Data Minimization:</strong> We only collect information strictly necessary for the verification and compliance purposes as outlined in our Privacy Policy.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-500">8.4 Data Protection</h3>
          <p>The KYC information you provide is used solely for:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Verifying your identity as a seller.</li>
            <li>Complying with anti-money laundering (AML) and other regulatory obligations.</li>
            <li>Securing our platform and payment ecosystem for all users.</li>
          </ul>
          <p className="mt-2">We do not share your KYC data with third parties for marketing purposes.</p>

          <h3 className="text-xl font-semibold text-gray-500">8.5 Seller Cooperation</h3>
          <p>You agree to provide accurate, complete, and current information during the KYC process. Failure to complete the KYC verification, or the provision of false information, will result in the withholding of payments until verification is successfully completed and may lead to account suspension.</p>

          <h3 className="text-xl font-semibold text-gray-500">8.6 Updates to Process</h3>
          <p>We reserve the right to update our KYC requirements in response to changing laws or regulations. If re-verification is ever legally required, we will provide you with clear notice and explanation.</p>

          <h2 className="text-2xl font-semibold text-gray-500">9. Paid Pre-Purchase Authentication Service</h2>

          <h3 className="text-xl font-semibold text-gray-500">9.1 Service Overview & Fee</h3>
          <p>We offer an optional, pre-purchase Authentication Service for eligible designer items, conducted by our specialized partners, for a non-refundable fee of 100 AED.</p>

          <h3 className="text-xl font-semibold text-gray-500">9.2 Eligibility Criteria</h3>
          <p>This service is available exclusively for designer items meeting both of the following conditions:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>The listed purchase price is 600 AED or higher.</li>
            <li>The item belongs to one of these categories: Clothing, Footwear, Eyewear, Watches, or Bags.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-500">9.3 Service Purchase & Item Reservation</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>The service can be purchased before you complete the checkout for an eligible item.</li>
            <li>Upon payment of the fee, the selected item is automatically reserved in your name for the duration of the authentication process.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-500">9.4 Authentication Process & Timeline</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>We collaborate with leading authentication companies that utilize a dual-check system: advanced AI analysis combined with verification by professional human experts.</li>
            <li>A conclusive authentication certificate will be provided within 12 hours of service purchase.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-500">9.5 Results, No-Refund Policy, & Next Steps</h3>
          <p><strong>Authentic Result:</strong> You will receive the authentication certificate. To complete your purchase, you must contact the seller to un-reserve the item and then proceed with standard checkout.</p>
          <p className="mt-2"><strong>Non-Authentic Result:</strong> You will be notified that the item did not pass our authentication checks. The authentication fee is non-refundable, as the service has been fully performed.</p>
          <p className="mt-2">The core purpose of this service is to provide a professional assessment of an item's authenticity. The fee is for the analysis and verdict itself, not contingent on a positive outcome.</p>

          <h3 className="text-xl font-semibold text-gray-500">9.6 Reservation Period Limitation</h3>
          <p>The item reservation is valid only until the authentication certificate is issued. We are not responsible if the item is sold to another buyer after the reservation is lifted, whether you proceed with the purchase or not.</p>

          <h2 className="text-2xl font-semibold text-gray-500">10. Communication & Reviews</h2>

          <h3 className="text-xl font-semibold text-gray-500">10.1 Messaging</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Use only for item-related discussions</li>
            <li>No personal contact information sharing</li>
            <li>No advertising or spam</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-500">10.2 Reviews</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Leave honest reviews after transactions</li>
            <li>Build community trust through feedback</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-500">11. Content Usage</h2>
          <p>By posting content on our platform, you grant us license to use it for platform operation, promotion, and improvement.</p>

          <h2 className="text-2xl font-semibold text-gray-500">12. Privacy Policy</h2>
          <p>We protect your personal data in accordance with our separate Privacy Policy, which governs the collection and use of your information.</p>

          <h2 className="text-2xl font-semibold text-gray-500">13. Term and Termination</h2>

          <h3 className="text-xl font-semibold text-gray-500">13.1 Account Deletion</h3>
          <p>You may delete your account anytime free of charge via settings.</p>

          <h3 className="text-xl font-semibold text-gray-500">13.2 Survival</h3>
          <p>These Terms remain effective for pending transactions and payouts after account deletion.</p>

          <h2 className="text-2xl font-semibold text-gray-500">14. Modifications</h2>
          <p>We may update these Terms periodically. We'll notify you of significant changes. Continued use after changes constitutes acceptance.</p>

          <h2 className="text-2xl font-semibold text-gray-500">15. Dispute Resolution & Governing Law</h2>
          <p>These terms are governed by the laws of the United Arab Emirates. Any disputes shall be subject to the exclusive jurisdiction of the courts of Sharjah (SPC Free Zone).</p>

          <h2 className="text-2xl font-semibold text-gray-500">16. Liability</h2>

          <h3 className="text-xl font-semibold text-gray-500">16.1 User Responsibility</h3>
          <p>You are responsible for:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Your content</li>
            <li>Account activities</li>
            <li>Listed/sold items</li>
            <li>Published reviews</li>
            <li>Disputes arising from your actions</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-500">16.2 Platform Liability</h3>
          <p>We're liable for providing services as described. Our liability is limited to the fullest extent permitted by law.</p>

          <h2 className="text-2xl font-semibold text-gray-500">17. Contact Information</h2>
          <p>For questions or support:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Email: contact@affaredoro.com</li>
            <li>WhatsApp: +971 506570211</li>
          </ul>

          <p className="text-center mt-12 text-lg font-semibold text-teal-600">
            Thank you for being part of the Affare Doro community where smart users hunt great deals!
          </p>
        </div>
      </section>
    </div>
  );
};

export default TermsAndConditions;
