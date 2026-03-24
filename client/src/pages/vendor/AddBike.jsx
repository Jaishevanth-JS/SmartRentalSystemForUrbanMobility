import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import VendorLayout from '../../components/VendorLayout';
import DateTimePicker from '../../components/DateTimePicker';
import { CheckCircle, Upload, AlertCircle } from 'lucide-react';

const BIKE_TYPES = ['Scooter','Sports','Cruiser','Commuter','Adventure','Electric','Classic','Other'];
const FUEL_TYPES = ['Petrol','Diesel','Electric','CNG'];

const Toast = ({ msg, type, onClose }) => {
  if (!msg) return null;
  const bg = type === 'success' ? '#22c55e' : '#ef4444';
  return (
    <div style={{ position:'fixed', bottom:32, right:32, background:bg, color:'#fff', padding:'14px 24px', borderRadius:12, fontWeight:700, fontSize:15, zIndex:9999, boxShadow:'0 4px 24px rgba(0,0,0,.18)', display:'flex', alignItems:'center', gap:10, maxWidth:380 }}>
      {msg}<button onClick={onClose} style={{ marginLeft:8, background:'none', border:'none', color:'#fff', cursor:'pointer', fontSize:18 }}>×</button>
    </div>
  );
};

const Field = ({ label, required, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-black text-gray-500 uppercase tracking-widest block">
      {label}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
  </div>
);

const inp = "w-full px-4 py-3 bg-[#f5f0eb] border border-[#e2d5c3] rounded-xl focus:outline-none focus:border-[#8b5e3c] text-sm font-bold placeholder-gray-400";
const sel = inp + " appearance-none";

const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-[#e2d5c3] p-6 shadow-sm space-y-5">
    <h3 className="font-black text-[#4a3224] text-sm uppercase tracking-wider border-b border-[#f0e9df] pb-3">{title}</h3>
    {children}
  </div>
);

const AddBike = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [toast, setToast]           = useState({ msg: '', type: '' });
  const [form, setForm] = useState({
    title:'', brand:'', model:'', bikeType:'', year:'', cc:'', fuelType:'',
    mileage:'', color:'', licensePlate:'', description:'',
    pricePerHour:'', pricePerDay:'', city:'', state:'', address:'',
    availableFrom:'', availableTo:'', images:''
  });

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:'', type:'' }), 4000);
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.availableFrom && form.availableTo) {
      const start = new Date(form.availableFrom);
      const end   = new Date(form.availableTo);
      if (end < start) {
        showToast('End date/time must be after start date/time', 'error');
        return;
      }
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        bikeType: form.bikeType || undefined,
        fuelType: form.fuelType || undefined,
        images: form.images.split('\n').map(s => s.trim()).filter(Boolean),
      };
      await API.post('/bikes', payload);
      setSubmitted(true);
    } catch (err) {
      showToast(err.response?.data?.message || 'Error submitting bike', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) return (
    <VendorLayout title="Add New Bike">
      <div className="max-w-lg mx-auto bg-white rounded-3xl p-12 text-center border border-[#e2d5c3] shadow-lg mt-8">
        <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-black text-[#4a3224] mb-3">Bike Submitted!</h3>
        <p className="text-gray-500 mb-8">Your bike has been submitted for admin approval. It will be visible in browse page once approved.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate('/vendor/bikes')}
            className="px-8 py-3 bg-[#8b5e3c] text-white rounded-2xl font-black hover:bg-[#6f4b30] transition">
            View My Bikes
          </button>
          <button onClick={() => { setSubmitted(false); setForm({ title:'', brand:'', model:'', bikeType:'', year:'', cc:'', fuelType:'', mileage:'', color:'', licensePlate:'', description:'', pricePerHour:'', pricePerDay:'', city:'', state:'', address:'', availableFrom:'', availableTo:'', images:'' }); }}
            className="px-8 py-3 border-2 border-[#8b5e3c] text-[#8b5e3c] rounded-2xl font-bold hover:bg-[#8b5e3c] hover:text-white transition">
            Add Another Bike
          </button>
        </div>
      </div>
    </VendorLayout>
  );



  return (
    <VendorLayout title="Add New Bike">
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg:'', type:'' })} />
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700 font-medium">After submitting, your bike will be reviewed by an admin before it appears in the browse page for users.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Section title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Bike Title / Name" required={false}>
                <input className={inp} placeholder="e.g. Royal Enfield Classic 350" value={form.title} onChange={set('title')} />
              </Field>
              <Field label="Brand" required>
                <input className={inp} placeholder="e.g. Honda, Yamaha" value={form.brand} onChange={set('brand')} required />
              </Field>
              <Field label="Model" required>
                <input className={inp} placeholder="e.g. CB350, FZ-S" value={form.model} onChange={set('model')} required />
              </Field>
              <Field label="Year" required>
                <input className={inp} type="number" min="2000" max={new Date().getFullYear()} placeholder="e.g. 2022" value={form.year} onChange={set('year')} required />
              </Field>
              <Field label="Bike Type">
                <select className={sel} value={form.bikeType} onChange={set('bikeType')}>
                  <option value="">Select Type</option>
                  {BIKE_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="License Plate">
                <input className={inp} placeholder="e.g. KA05 AB1234" value={form.licensePlate} onChange={set('licensePlate')} />
              </Field>
            </div>
            <Field label="Description">
              <textarea className={inp} rows={3} placeholder="Describe your bike, its condition, features…" value={form.description} onChange={set('description')} />
            </Field>
          </Section>

          <Section title="Specifications">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Engine CC">
                <input className={inp} type="number" placeholder="e.g. 350" value={form.cc} onChange={set('cc')} />
              </Field>
              <Field label="Fuel Type">
                <select className={sel} value={form.fuelType} onChange={set('fuelType')}>
                  <option value="">Select Fuel Type</option>
                  {FUEL_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Mileage">
                <input className={inp} placeholder="e.g. 35 km/l" value={form.mileage} onChange={set('mileage')} />
              </Field>
              <Field label="Color">
                <input className={inp} placeholder="e.g. Midnight Black" value={form.color} onChange={set('color')} />
              </Field>
            </div>
          </Section>

          <Section title="Pricing">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Price Per Hour (₹)" required>
                <input className={inp} type="number" min="0" placeholder="e.g. 80" value={form.pricePerHour} onChange={set('pricePerHour')} required />
              </Field>
              <Field label="Price Per Day (₹)" required>
                <input className={inp} type="number" min="0" placeholder="e.g. 600" value={form.pricePerDay} onChange={set('pricePerDay')} required />
              </Field>
            </div>
          </Section>

          <Section title="Location & Availability">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="City" required>
                <input className={inp} placeholder="e.g. Bangalore" value={form.city} onChange={set('city')} required />
              </Field>
              <Field label="State">
                <input className={inp} placeholder="e.g. Karnataka" value={form.state} onChange={set('state')} />
              </Field>
              <Field label="Full Address">
                <input className={inp} placeholder="Street, Area, Landmark" value={form.address} onChange={set('address')} />
              </Field>
              <div />
              <DateTimePicker 
                label="Available From" 
                value={form.availableFrom} 
                minDate={new Date().toISOString().split('T')[0]} 
                onChange={(v) => setForm(f => ({ ...f, availableFrom: v }))} 
              />
              <DateTimePicker 
                label="Available To" 
                value={form.availableTo} 
                minDate={form.availableFrom ? form.availableFrom.split(' ')[0] : new Date().toISOString().split('T')[0]} 
                onChange={(v) => setForm(f => ({ ...f, availableTo: v }))} 
                error={form.availableFrom && form.availableTo && (new Date(form.availableTo) < new Date(form.availableFrom)) ? 'End date/time cannot be before start date/time' : ''}
              />
            </div>
          </Section>

          <Section title="Bike Images">
            <Field label="Image URLs (one per line)">
              <textarea className={inp} rows={4}
                placeholder={"https://example.com/bike1.jpg\nhttps://example.com/bike2.jpg"}
                value={form.images} onChange={set('images')} />
            </Field>
            <p className="text-xs text-gray-400">Add one image URL per line. First image will be used as the main photo.</p>
          </Section>

          <div className="flex flex-col sm:flex-row gap-4">
            <button type="submit" disabled={submitting}
              className="flex-1 py-4 bg-[#8b5e3c] text-white rounded-2xl font-black text-base shadow-lg hover:bg-[#6f4b30] transition-all flex items-center justify-center gap-3">
              {submitting
                ? <span className="inline-block w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <Upload className="h-5 w-5" />}
              {submitting ? 'Submitting…' : 'Submit for Approval'}
            </button>
            <button type="button" onClick={() => navigate('/vendor')}
              className="px-8 py-4 border-2 border-[#8b5e3c] text-[#8b5e3c] rounded-2xl font-bold hover:bg-[#8b5e3c] hover:text-white transition-all">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </VendorLayout>
  );
};

export default AddBike;
