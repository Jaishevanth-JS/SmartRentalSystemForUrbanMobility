import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield } from 'lucide-react';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-black text-[#4a3224] mb-4 pb-2 border-b border-[#e2d5c3]">{title}</h2>
    <div className="text-gray-600 leading-relaxed space-y-3 text-sm">{children}</div>
  </div>
);

const Terms = () => (
  <div className="min-h-screen bg-[#fdfaf6] flex flex-col">
    <Navbar />

    {/* Hero */}
    <section className="bg-[#4a3224] text-white py-16 text-center">
      <div className="max-w-3xl mx-auto px-4">
        <div className="h-14 w-14 rounded-full bg-[#8b5e3c] flex items-center justify-center mx-auto mb-5">
          <Shield className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-4xl font-extrabold mb-3">Terms of Service</h1>
        <p className="text-[#e2d5c3]">Last updated: March 2026</p>
      </div>
    </section>

    <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
      <div className="bg-white border border-[#e2d5c3] rounded-3xl p-10 shadow-sm">
        <p className="text-gray-500 mb-10 leading-relaxed text-sm">
          Please read these Terms of Service carefully before using the BikeRent platform. By accessing or using our service, you agree to be bound by these terms.
        </p>

        <Section title="1. Acceptance of Terms">
          <p>By creating an account or using the BikeRent platform, you agree to these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.</p>
        </Section>

        <Section title="2. User Accounts">
          <p>You must be at least 18 years old and hold a valid driver's license to rent a bike on our platform.</p>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
          <p>You must provide accurate, current, and complete information during registration and keep your profile up to date.</p>
        </Section>

        <Section title="3. Booking and Payments">
          <p>All bookings are subject to availability and confirmation from the bike owner.</p>
          <p>Payments are processed securely through Stripe. BikeRent does not store your card information.</p>
          <p>Prices listed are per day and are inclusive of basic insurance. Additional charges may apply for damages or late returns.</p>
        </Section>

        <Section title="4. Cancellation Policy">
          <p><strong>Full Refund:</strong> Cancellations made at least 24 hours before the rental start time.</p>
          <p><strong>No Refund:</strong> Cancellations made less than 24 hours before the rental start time or no-shows.</p>
          <p>Refunds, where applicable, will be processed within 5–7 business days.</p>
        </Section>

        <Section title="5. Renter Responsibilities">
          <p>Renters must use the bike responsibly and in compliance with all traffic laws and regulations.</p>
          <p>The bike must be returned in the same condition it was rented. Renters are financially responsible for any damage caused during the rental period.</p>
          <p>Smoking, carrying illegal substances, and using the bike for commercial purposes is strictly prohibited.</p>
        </Section>

        <Section title="6. Liability Disclaimer">
          <p>BikeRent acts as a marketplace connecting bike owners with renters. We are not liable for accidents, injuries, or damages that occur during the rental period.</p>
          <p>All rentals include basic third-party insurance. Renters are encouraged to purchase comprehensive coverage for high-value rentals.</p>
        </Section>

        <Section title="7. Privacy">
          <p>We collect and process personal data in accordance with our Privacy Policy. By using our platform, you consent to such processing and warrant that all data provided by you is accurate.</p>
        </Section>

        <Section title="8. Changes to Terms">
          <p>BikeRent reserves the right to modify these terms at any time. We will provide notice of significant changes via email or through the platform. Continued use of the service after changes constitutes acceptance of the new terms.</p>
        </Section>

        <Section title="9. Contact">
          <p>If you have any questions about these Terms of Service, please contact us at <strong>legal@bikerent.com</strong> or visit our <a href="/contact" className="text-[#8b5e3c] underline font-bold">Contact Page</a>.</p>
        </Section>
      </div>
    </main>

    <Footer />
  </div>
);

export default Terms;
