"use client";

import React, { useState } from "react";

function Wallet() {
  // Mock data - replace with actual data from your backend
  const [balance, setBalance] = useState(1250.00);
  const [pendingBalance, setPendingBalance] = useState(350.00);
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'Credit Card', last4: '4242', brand: 'Visa' },
    { id: 2, type: 'Bank Account', last4: '1234', name: 'Main Account' }
  ]);

  const handleWithdraw = () => {
    // Implement withdrawal logic here
    console.log('Withdrawal requested');
  };

  const handleAddPaymentMethod = () => {
    // Implement add payment method logic here
    console.log('Add payment method');
  };

  return (
    <div className="bg-white mt-15 w-full">
      <div className="container mx-auto max-w-screen-2xl lg:px-[50px]">
        <div className="py-8">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Available Balance Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Balance</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-gray-900">${balance.toFixed(2)}</p>
                  <p className="text-sm text-gray-500 mt-1">Ready to withdraw</p>
                </div>
                {balance > 0 && (
                  <button
                    onClick={handleWithdraw}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Withdraw Funds
                  </button>
                )}
              </div>
            </div>

            {/* Pending Balance Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Balance</h2>
              <div>
                <p className="text-4xl font-bold text-orange-500">${pendingBalance.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-1">Will be available in 1-3 business days</p>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
              <button
                onClick={handleAddPaymentMethod}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Add New
              </button>
            </div>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center">
                    {method.type === 'Credit Card' ? (
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{method.type}</p>
                      <p className="text-sm text-gray-500">
                        {method.type === 'Credit Card' ? `${method.brand} ending in ${method.last4}` : `Account ending in ${method.last4}`}
                      </p>
                    </div>
                  </div>
                  <button className="text-red-600 hover:text-red-800">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wallet;
