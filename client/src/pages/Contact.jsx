import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const Toast = ({ msg, type, onClose }) => {
  if (!msg) return null;
  const bg = type === 'success' ? '#22c55e' : '#ef4444';
  return (
    <div style={{ position:'fixed', bottom:32, right:32, background:bg, color:'#fff', padding:'14px 24px', borderRadius:12, fontWeight:700, fontSize:15, zIndex:9999, boxShadow:'0 4px 24px rgba(0,0,0,.18)', display:'flex', alignItems:'center', gap:10, maxWidth:360 }}>
      {msg}
      <button onClick={onClose} style={{ marginLeft:8, background:'none', border:'none', color:'#fff', cursor:'pointer', fontSize:18 }}>×</button>
    </div>
  );
};

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: '' });

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate sending (no backend endpoint needed currently)
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    setSubmitted(true);
    setToast({ msg: 'Message sent! We\'ll get back to you shortly.', type: 'success' });
    setTimeout(() => setToast({ msg: '', type: '' }), 4000);
  };

  return (
    <div className="min-h-screen bg-[#fdfaf6] flex flex-col">
      <Navbar />
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: '' })} />

      {/* Hero */}
      <section className="bg-[#4a3224] text-white py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Contact Us</h1>
          <p className="text-[#e2d5c3] text-lg">We're here to help. Send us a message and we'll respond within 24 hours.</p>
        </div>
      </section>

      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Info Cards */}
          <div className="space-y-6">
            {[
              { icon: <Mail className="h-6 w-6 text-[#8b5e3c]" />, title: 'Email Us', detail: 'support@bikerent.com', sub: 'We reply within 24 hours' },
              { icon: <Phone className="h-6 w-6 text-[#8b5e3c]" />, title: 'Call Us', detail: '+91 98765 43210', sub: 'Mon–Sat, 9am – 6pm IST' },
              { icon: <MapPin className="h-6 w-6 text-[#8b5e3c]" />, title: 'Our Office', detail: 'Bangalore, India', sub: '560001' },
            ].map(({ icon, title, detail, sub }) => (
              <div key={title} className="bg-white border border-[#e2d5c3] p-6 rounded-2xl flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#fdfaf6] border border-[#e2d5c3] flex items-center justify-center flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="font-black text-[#4a3224]">{title}</p>
                  <p className="text-[#8b5e3c] font-bold text-sm">{detail}</p>
                  <p className="text-gray-400 text-xs">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white border border-[#e2d5c3] p-10 rounded-3xl shadow-2xl">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center mb-6">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-black text-[#4a3224] mb-3">Message Sent!</h3>
                <p className="text-gray-500 max-w-sm">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="mt-8 px-8 py-3 bg-[#8b5e3c] text-white rounded-2xl font-bold hover:bg-[#6f4b30] transition">
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black text-[#4a3224] mb-8">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest block pl-1">Full Name</label>
                      <input type="text" required value={form.name} onChange={handleChange('name')}
                        className="w-full px-5 py-4 bg-[#fdfaf6] border border-[#e2d5c3] rounded-2xl focus:outline-none focus:border-[#8b5e3c] text-sm font-bold"
                        placeholder="Your Name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest block pl-1">Email</label>
                      <input type="email" required value={form.email} onChange={handleChange('email')}
                        className="w-full px-5 py-4 bg-[#fdfaf6] border border-[#e2d5c3] rounded-2xl focus:outline-none focus:border-[#8b5e3c] text-sm font-bold"
                        placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block pl-1">Subject</label>
                    <input type="text" required value={form.subject} onChange={handleChange('subject')}
                      className="w-full px-5 py-4 bg-[#fdfaf6] border border-[#e2d5c3] rounded-2xl focus:outline-none focus:border-[#8b5e3c] text-sm font-bold"
                      placeholder="What can we help you with?" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block pl-1">Message</label>
                    <textarea required rows={6} value={form.message} onChange={handleChange('message')}
                      className="w-full px-5 py-4 bg-[#fdfaf6] border border-[#e2d5c3] rounded-2xl focus:outline-none focus:border-[#8b5e3c] text-sm font-bold resize-none"
                      placeholder="Tell us more…" />
                  </div>
                  <button type="submit" disabled={submitting}
                    className="px-10 py-4 bg-[#8b5e3c] text-white rounded-2xl font-black shadow-lg hover:bg-[#6f4b30] transition-all flex items-center gap-3">
                    <Send className="h-5 w-5" />
                    {submitting ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
