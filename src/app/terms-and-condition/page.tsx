import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 bg-white text-gray-900">
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold text-teal-600">Terms and Conditions of Affare Doro</h1>
        <p className="mt-2 text-lg text-gray-600">Date: 30/04/2025</p>
      </header>

      <section className="space-y-8">
        <p className="text-xl">
          Welcome to Affare Doro. These Terms and Conditions govern your access to and use of our platform available via our mobile application and website. By registering, accessing, or using the Platform, you agree to be bound by these Terms.
        </p>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-500">1. Eligibility</h2>
          <p>You must be at least 18 years old to use Affare Doro. By using the Platform, you confirm that you meet this requirement and are capable of entering into a legally binding agreement.</p>

          <h2 className="text-2xl font-semibold text-gray-500">2. Platform Purpose</h2>
          <p>Affare Doro is a peer-to-peer marketplace for users to buy and sell new and second-hand items. Affare Doro is not a party to any transaction between users.</p>

          <h2 className="text-2xl font-semibold text-gray-500">3. Account Registration</h2>
          <p>To use certain features, you must register and create an account. You agree to provide accurate information and keep it updated. You are responsible for maintaining the confidentiality of your account credentials.</p>

          <h2 className="text-2xl font-semibold text-gray-500">4. User Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6">
            <li>Post false, misleading, or fraudulent content.</li>
            <li>List or sell prohibited items.</li>
            <li>Harass or abuse other users.</li>
            <li>Interfere with the proper functioning of the Platform.</li>
          </ul>
          <p>Affare Doro reserves the right to suspend or delete accounts that violate these rules.</p>

          <h2 className="text-2xl font-semibold text-gray-500">5. Listings and Sales</h2>
          <p>Users are solely responsible for the content of their listings and the lawful sale of items. All sales are binding once the buyer has confirmed the purchase.</p>

          <h2 className="text-2xl font-semibold text-gray-500">6. Fees and Payments</h2>
          <p>Affare Doro may charge a commission or service fee on transactions. These fees will be clearly disclosed before confirming any transaction. Payments are processed via secure third-party payment providers.</p>

          <h2 className="text-2xl font-semibold text-gray-500">7. Disputes</h2>
          <p>Any disputes between users should be resolved directly. Affare Doro may assist but is not obligated to mediate or resolve conflicts.</p>

          <h2 className="text-2xl font-semibold text-gray-500">8. Intellectual Property</h2>
          <p>All content on the Platform, including logos, design, and text, is the property of Affare Doro or its licensors. Users may not use this content without written permission.</p>

          <h2 className="text-2xl font-semibold text-gray-500">9. Termination</h2>
          <p>We may suspend or terminate your account if you breach these Terms or if your use of the Platform could cause harm to us or others.</p>

          <h2 className="text-2xl font-semibold text-gray-500">10. Limitation of Liability</h2>
          <p>Affare Doro is not responsible for any loss, damage, or harm resulting from transactions or interactions between users. The Platform is provided “as is” without warranties.</p>

          <h2 className="text-2xl font-semibold text-gray-500">11. Privacy</h2>
          <p>Please refer to our <a href="/privacy-policy" className="text-indigo-600 hover:underline">Privacy Policy</a> for information on how we collect, use, and protect your personal data.</p>

          <h2 className="text-2xl font-semibold text-gray-500">12. Modifications</h2>
          <p>We reserve the right to modify these Terms at any time. Continued use of the Platform after such changes constitutes your acceptance.</p>

          <h2 className="text-2xl font-semibold text-gray-500">13. Governing Law</h2>
          <p>These Terms are governed by the laws of [the United Arab Emirates]. Any disputes shall be resolved in the courts of UAE.</p>

          <h2 className="text-2xl font-semibold text-gray-500">14. Buyer and Seller Protection</h2>
          <p>Affare Doro is committed to creating a secure and fair marketplace. We offer the following protection guidelines:</p>

          <div className="pl-6 space-y-4">
            <h3 className="font-semibold text-gray-500">14.1. Buyer Protection</h3>
            <ul className="list-disc pl-6">
              <li>The item received is significantly not as described.</li>
              <li>The item does not arrive within the expected timeframe.</li>
              <li>The seller cancels the transaction after payment.</li>
            </ul>
            <p>Buyers must report any issues within 2 days of delivery via the Platform.</p>

            <h3 className="font-semibold text-gray-500">14.2. Seller Protection</h3>
            <ul className="list-disc pl-6">
              <li>The buyer falsely claims non-receipt or item not as described.</li>
              <li>The item is returned in a different condition than sent.</li>
            </ul>
            <p>Sellers must ship the item within the indicated time and use tracked shipping.</p>

            <h3 className="font-semibold text-gray-500">14.3. Returns and Refunds</h3>
            <p>Returns are only accepted in the case of misrepresented or fake items, or damaged goods not disclosed in the listing.</p>
          </div>

          <h2 className="text-2xl font-semibold text-gray-500">15. Shipping Policy</h2>
          <p>Affare Doro facilitates smooth transactions between buyers and sellers. Below are the terms related to shipping:</p>

          <div className="pl-6 space-y-4">
            <h3 className="font-semibold text-gray-500">15.1. Shipping Responsibility</h3>
            <p>Sellers are responsible for shipping the item after the buyer has completed payment. Items must be shipped within 3 business days unless otherwise agreed by both parties.</p>

            <h3 className="font-semibold text-gray-500">15.2. Shipping Costs</h3>
            <p>Shipping costs are either paid by the buyer or included in the item price, as specified in the listing.</p>

            <h3 className="font-semibold text-gray-500">15.3. Delivery Timeframe</h3>
            <p>Buyers should allow up to 10 business days for delivery after shipment, unless a shorter time is specified.</p>

            <h3 className="font-semibold text-gray-500">15.4. Lost or Undelivered Packages</h3>
            <p>If an item is not delivered, the buyer must notify Affare Doro within 2 days of the expected delivery date.</p>

            <h3 className="font-semibold text-gray-500">15.5. Returned Items</h3>
            <p>The item must be returned in the same condition as received. The buyer must use tracked shipping and provide the tracking number.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsAndConditions