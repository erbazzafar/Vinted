import React from 'react';

function PrivacyPolicy() {
    return (
        <div className="p-6 mt-4 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
            <p className="mb-4">
                Welcome to our platform! We value your privacy and are committed to protecting your personal information.
                This Privacy Policy explains how we collect, use, and protect your data when you use our website and application.
            </p>

            <h2 className="text-2xl font-semibold mb-2">Information We Collect</h2>
            <p className="mb-4">
                When you use our platform, we collect information such as your name, email address, contact details, 
                and payment information. We also collect product details you upload, transaction history, and activity on the platform.
            </p>

            <h2 className="text-2xl font-semibold mb-2">How We Use Your Information</h2>
            <p className="mb-4">
                - To create and manage your account.<br />
                - To allow you to buy and sell products with other users.<br />
                - To process payments securely via Stripe.<br />
                - To manage product listings, orders, and bump features.<br />
                - To monitor activity for safety, compliance, and platform improvements.
            </p>

            <h2 className="text-2xl font-semibold mb-2">User Roles</h2>
            <p className="mb-4">
                Our platform allows users to act both as customers and sellers. 
                As a seller, you can upload products for others to purchase. As a customer, you can browse and purchase products uploaded by other users.
            </p>

            <h2 className="text-2xl font-semibold mb-2">Payments and Security</h2>
            <p className="mb-4">
                We use Stripe to handle all payment transactions securely. Your payment information is encrypted and processed directly through Stripe; 
                we do not store your credit card details on our servers.
            </p>

            <h2 className="text-2xl font-semibold mb-2">Product Bumping</h2>
            <p className="mb-4">
                Sellers can promote (&quot;bump&quot;) their products to appear at the top of listings for a selected number of days by paying a fee. 
                The bump duration and cost are determined by the platform&apos;s admin.
            </p>

            <h2 className="text-2xl font-semibold mb-2">Admin Access</h2>
            <p className="mb-4">
                Admins have access to monitor and manage product listings, categories, sizes, brands, materials, orders, and bump activities 
                to ensure the platform runs smoothly and maintains high-quality standards.
            </p>

            <h2 className="text-2xl font-semibold mb-2">Your Rights</h2>
            <p className="mb-4">
                You have the right to access, update, or delete your personal information. 
                For any requests, please contact our support team.
            </p>

            <h2 className="text-2xl font-semibold mb-2">Changes to This Policy</h2>
            <p className="mb-4">
                We may update this Privacy Policy from time to time to reflect changes to our practices 
                or for other operational, legal, or regulatory reasons. Please review this page regularly.
            </p>

            <p className="mt-6">
                If you have any questions about this Privacy Policy, feel free to contact us.
            </p>
        </div>
    );
}

export default PrivacyPolicy;