import React from 'react'

function About() {

    return (
        <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-20">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-6">
      About Us
    </h2>

    <p className="text-lg text-gray-600 leading-relaxed mb-8">
      Welcome to <span className="font-semibold text-teal-600">Affare Doro</span> – your trusted
      marketplace for second-hand treasures.
    </p>

    <div className="text-left space-y-6 text-gray-700 text-[17px]">
      <p>
        Born from a passion for <span className="text-teal-600 font-medium">sustainable shopping</span> and
        community-driven commerce, Affare Doro connects people who love giving
        pre-loved items a new life.
      </p>
      <p>
        Whether you're decluttering your wardrobe, hunting for unique finds, or
        simply shopping smart, our platform makes it easy, secure, and rewarding.
      </p>
      <p>
        At Affare Doro, we believe that great style doesn’t have to come at a
        high price—or cost the planet. That’s why we’ve created a space where
        users can buy and sell fashion, accessories, and more, all in just a few
        taps.
      </p>

      <blockquote className="italic text-teal-700 font-semibold text-center py-4 border-l-4 border-teal-500 pl-4">
        We’re here to make second-hand the first choice.
      </blockquote>
    </div>

    <div className="mt-10 text-left">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Why Affare Doro?</h3>
      <ul className="list-disc list-inside space-y-2 text-gray-700 text-[16px]">
        <li><span className="font-medium text-teal-600">Simple</span> and intuitive platform</li>
        <li><span className="font-medium text-teal-600">Safe</span> and secure transactions</li>
        <li><span className="font-medium text-teal-600">Buyer</span> and seller protection</li>
        <li>A <span className="font-medium text-teal-600">vibrant</span> and conscious community</li>
      </ul>
    </div>

    <div className="mt-10 text-center">
      <p className="text-lg text-gray-700 font-medium">
        Join us today and become part of a movement that values <span className="text-teal-600 font-semibold">affordability</span>,
        <span className="text-teal-600 font-semibold"> sustainability</span>, and <span className="text-teal-600 font-semibold">smart style</span>.
      </p>

      <p className="mt-6 text-xl font-bold text-gray-800 italic">
        Affare Doro – <span className="text-teal-700">Every item has a story. Let’s give it a new one.</span>
      </p>
    </div>
  </div>
</section>
    )
}

export default About
