import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqs = [
  { q: 'How do I rent a bike?', a: 'Browse available bikes, select your dates, and click "Book This Bike". You\'ll be guided through a secure payment process. Your booking is confirmed instantly.' },
  { q: 'What documents do I need?', a: 'You need a valid driver\'s license and a government-issued ID (Aadhaar, Passport, or PAN card). Please carry these when picking up the bike.' },
  { q: 'Can I cancel my booking?', a: 'Yes! You can cancel from the "My Bookings" page. Cancellations made 24+ hours before the rental start time are eligible for a full refund.' },
  { q: 'How are payments handled?', a: 'All payments are processed securely through Stripe. We accept major debit/credit cards and UPI.' },
  { q: 'What if the bike breaks down during my ride?', a: 'Contact us immediately through the platform. Each rental includes roadside assistance for mechanical failures that are not due to rider negligence.' },
  { q: 'Can I extend my rental?', a: 'Yes, if the bike is available for extended dates, you can extend from the My Bookings page or contact us directly.' },
  { q: 'How do reviews work?', a: 'Only users who have completed a booking can leave a review for that specific bike. This ensures all reviews are authentic.' },
  { q: 'Is there a mileage limit?', a: 'Most rentals come with unlimited mileage, but some premium bikes may have a daily limit. Check the bike\'s detail page for specifics.' },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#e2d5c3] rounded-2xl overflow-hidden transition-all">
      <button onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-6 text-left hover:bg-[#fdfaf6] transition-colors">
        <span className="font-bold text-[#4a3224] text-sm md:text-base">{q}</span>
        {open ? <ChevronUp className="h-5 w-5 text-[#8b5e3c] flex-shrink-0 ml-4" /> : <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4" />}
      </button>
      {open && (
        <div className="px-6 pb-6 bg-[#fdfaf6] border-t border-[#e2d5c3]">
          <p className="text-gray-600 leading-relaxed text-sm pt-4">{a}</p>
        </div>
      )}
    </div>
  );
};

const FAQ = () => (
  <div className="min-h-screen bg-[#fdfaf6] flex flex-col">
    <Navbar />
    <main className="flex-grow">
      {/* Hero */}
      <section className="bg-[#4a3224] text-white py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="h-16 w-16 rounded-full bg-[#8b5e3c] flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Frequently Asked Questions</h1>
          <p className="text-[#e2d5c3] text-lg">Everything you need to know about renting with BikeRent.</p>
        </div>
      </section>

      {/* FAQ List */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-4">
          {faqs.map((item, i) => <FAQItem key={i} {...item} />)}
        </div>
        <div className="mt-16 text-center bg-white border border-[#e2d5c3] rounded-3xl p-10">
          <h3 className="text-xl font-black text-[#4a3224] mb-3">Still have questions?</h3>
          <p className="text-gray-500 mb-6">Our support team is happy to help you with anything.</p>
          <a href="/contact" className="inline-block px-8 py-3 bg-[#8b5e3c] text-white rounded-2xl font-bold hover:bg-[#6f4b30] transition">
            Contact Us
          </a>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default FAQ;
