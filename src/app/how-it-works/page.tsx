import React from 'react';

import { ArrowRight, Box, Camera, CheckCircle, Share, ShoppingCart, Star, Tags, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HowItWorks = () => {
  return (
    <div className="w-full font-vinted">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-vinted-light-green to-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            How <span className="text-vinted-green">Vinted</span> Works
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8">
            Join millions of people buying and selling pre-loved fashion in our community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-vinted-green hover:bg-vinted-dark-green text-white px-8 py-6 rounded-full text-lg">
              Start Selling
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="border-vinted-green text-vinted-green hover:bg-vinted-green/5 px-8 py-6 rounded-full text-lg">
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Selling is simple</h2>
          <p className="text-center text-gray-700 max-w-3xl mx-auto mb-16">
            List your items in minutes and start selling to our community of over 50 million people.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center md:items-start space-y-8 md:space-y-0 md:space-x-4">
            <div className="step-item">
              <div className="step-circle animate-float">
                <Camera className="h-10 w-10 text-vinted-green" />
              </div>
              <h3 className="mt-4 text-xl font-medium">Upload</h3>
              <p className="mt-2 text-gray-600 text-center">Take photos and create your listing</p>
            </div>
            
            <div className="step-item">
              <div className="step-circle animate-float" style={{ animationDelay: "1s" }}>
                <Tags className="h-10 w-10 text-vinted-green" />
              </div>
              <h3 className="mt-4 text-xl font-medium">Sell</h3>
              <p className="mt-2 text-gray-600 text-center">Set your price and wait for offers</p>
            </div>
            
            <div className="step-item">
              <div className="step-circle animate-float" style={{ animationDelay: "2s" }}>
                <Box className="h-10 w-10 text-vinted-green" />
              </div>
              <h3 className="mt-4 text-xl font-medium">Ship</h3>
              <p className="mt-2 text-gray-600 text-center">Package and send your items</p>
            </div>
            
            <div className="step-item">
              <div className="step-circle animate-float" style={{ animationDelay: "3s" }}>
                <CheckCircle className="h-10 w-10 text-vinted-green" />
              </div>
              <h3 className="mt-4 text-xl font-medium">Get Paid</h3>
              <p className="mt-2 text-gray-600 text-center">Receive your payment securely</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button className="bg-vinted-green hover:bg-vinted-dark-green text-white px-8 py-6 rounded-full text-lg">
              Start Selling Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Shopping Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-vinted-beige">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Shopping is easy</h2>
          <p className="text-center text-gray-700 max-w-3xl mx-auto mb-16">
            Find unique pieces at great prices directly from sellers.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-vinted-light-green rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="h-8 w-8 text-vinted-green" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Browse & Buy</h3>
              <p className="text-gray-600">Find your favorite brands or discover new ones from our community.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-vinted-light-green rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="h-8 w-8 text-vinted-green" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
              <p className="text-gray-600">Get your new treasures delivered safely and quickly to your door.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-vinted-light-green rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-vinted-green" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Rate & Review</h3>
              <p className="text-gray-600">Let others know about your experience with sellers and items.</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button className="bg-vinted-green hover:bg-vinted-dark-green text-white px-8 py-6 rounded-full text-lg">
              Start Shopping Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Why choose Vinted?</h2>
          
          <div className="grid md:grid-cols-2 gap-12 mt-12">
            <div className="rounded-2xl bg-gradient-to-br from-vinted-light-green to-white p-6 md:p-10">
              <h3 className="text-2xl font-semibold mb-4">For sellers</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-vinted-green mr-3 flex-shrink-0 mt-0.5" />
                  <span>It's <strong>free to list</strong> items - no upfront fees</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-vinted-green mr-3 flex-shrink-0 mt-0.5" />
                  <span>Reach <strong>millions of buyers</strong> across the globe</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-vinted-green mr-3 flex-shrink-0 mt-0.5" />
                  <span><strong>Secure payments</strong> processed through our platform</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-vinted-green mr-3 flex-shrink-0 mt-0.5" />
                  <span><strong>Easy shipping</strong> with pre-paid labels</span>
                </li>
              </ul>
              <Button className="mt-8 bg-vinted-green hover:bg-vinted-dark-green text-white px-6 py-2 rounded-full">
                Start Selling
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="rounded-2xl bg-gradient-to-br from-vinted-beige to-white p-6 md:p-10">
              <h3 className="text-2xl font-semibold mb-4">For buyers</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-vinted-orange mr-3 flex-shrink-0 mt-0.5" />
                  <span>Find <strong>unique items</strong> and your favorite brands</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-vinted-orange mr-3 flex-shrink-0 mt-0.5" />
                  <span>Save <strong>up to 70%</strong> off retail prices</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-vinted-orange mr-3 flex-shrink-0 mt-0.5" />
                  <span><strong>Buyer protection</strong> on every purchase</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-vinted-orange mr-3 flex-shrink-0 mt-0.5" />
                  <span><strong>Shop sustainably</strong> and reduce fashion waste</span>
                </li>
              </ul>
              <Button className="mt-8 bg-vinted-orange hover:bg-vinted-orange/80 text-white px-6 py-2 rounded-full">
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-vinted-light-green">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join our community</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Over 50 million people are already buying and selling on Vinted.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-4xl font-bold text-vinted-green mb-2">50M+</h3>
              <p className="text-gray-600">Community members</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-4xl font-bold text-vinted-green mb-2">300M+</h3>
              <p className="text-gray-600">Items for sale</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-4xl font-bold text-vinted-green mb-2">15+</h3>
              <p className="text-gray-600">Countries worldwide</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-4xl font-bold text-vinted-green mb-2">4.8/5</h3>
              <p className="text-gray-600">Average rating</p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-6">
            <Button className="bg-vinted-green hover:bg-vinted-dark-green text-white px-8 py-6 rounded-full text-lg">
              Download the App
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button className="bg-white text-vinted-green hover:bg-gray-50 border border-vinted-green px-8 py-6 rounded-full text-lg">
              Share with Friends
              <Share className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Join the circular fashion movement today and be part of the solution.
          </p>
          
          <div className="bg-gradient-to-r from-vinted-green to-vinted-dark-green p-1 rounded-2xl">
            <div className="bg-white rounded-2xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-semibold mb-4">Sell your unused items</h3>
                  <p className="text-gray-600 mb-6">Clear your closet and make money from clothes you no longer wear.</p>
                  <Button className="bg-vinted-green hover:bg-vinted-dark-green text-white px-6 py-2 rounded-full">
                    Start Selling
                  </Button>
                </div>
                
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-semibold mb-4">Find unique pieces</h3>
                  <p className="text-gray-600 mb-6">Discover second-hand treasures at affordable prices.</p>
                  <Button className="bg-vinted-orange hover:bg-vinted-orange/80 text-white px-6 py-2 rounded-full">
                    Start Shopping
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;