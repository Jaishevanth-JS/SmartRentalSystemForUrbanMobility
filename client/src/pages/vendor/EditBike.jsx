import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../api/axios';
import VendorLayout from '../../components/VendorLayout';
import DateTimePicker from '../../components/DateTimePicker';
import { Save, ArrowLeft } from 'lucide-react';

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

const Field = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-black text-gray-500 uppercase tracking-widest block">{label}</label>
    {children}
  </div>
);

const inp = "w-full px-4 py-3 bg-[#f5f0eb] border border-[#e2d5c3] rounded-xl focus:outline-none focus:border-[#8b5e3c] text-sm font-bold placeholder-gray-400";

const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-[#e2d5c3] p-6 shadow-sm space-y-5">
    <h3 className="font-black text-[#4a3224] text-sm uppercase tracking-wider border-b border-[#f0e9df] pb-3">{title}</h3>
    {children}
  </div>
);

const EditBike = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]       = useState({ msg:'', type:'' });
  const [form, setForm] = useState({
    title:'', brand:'', model:'', bikeType:'', year:'', cc:'', fuelType:'',
    mileage:'', color:'', licensePlate:'', description:'',
    pricePerHour:'', pricePerDay:'', city:'', state:'', address:'',
    availableFrom:'', availableTo:'', images:'', isAvailable: true
  });

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:'', type:'' }), 3500);
  };

  useEffect(() => {
    const fetchBike = async () => {
      try {
        const res = await API.get('/bikes/vendor/my-bikes');
        const bike = res.data.find(b => b._id === id);
        if (bike) {
          setForm({
            title:        bike.title || '',
            brand:        bike.brand || '',
            model:        bike.model || '',
            bikeType:     bike.bikeType || '',
            year:         bike.year || '',
            cc:           bike.cc || '',
            fuelType:     bike.fuelType || '',
            mileage:      bike.mileage || '',
            color:        bike.color || '',
            licensePlate: bike.licensePlate || '',
            description:  bike.description || '',
            pricePerHour: bike.pricePerHour || '',
            pricePerDay:  bike.pricePerDay || '',
            city:         bike.city || '',
            state:        bike.state || '',
            address:      bike.address || '',
            availableFrom: bike.availableFrom ? (bike.availableFrom.includes(' ') ? bike.availableFrom : bike.availableFrom.split('T')[0] + ' 09:00 AM') : '',
            availableTo:   bike.availableTo   ? (bike.availableTo.includes(' ')   ? bike.availableTo   : bike.availableTo.split('T')[0]   + ' 06:00 PM') : '',
            images:        (bike.images || []).join('\n'),
            isAvailable:   bike.isAvailable,
          });
        }
      } catch (err) {
        showToast('Could not load bike details', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchBike();
  }, [id]);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (form.availableFrom && form.availableTo && (new Date(form.availableTo) < new Date(form.availableFrom))) {
        showToast('End date/time must be after start date/time', 'error');
        setSubmitting(false);
        return;
    }
    try {
      const payload = {
        ...form,
        images: form.images.split('\n').map(s => s.trim()).filter(Boolean),
      };
      await API.put(`/bikes/${id}`, payload);
      showToast('Bike updated successfully!', 'success');
      setTimeout(() => navigate('/vendor/bikes'), 1200);
    } catch (err) {
      showToast(err.response?.data?.message || 'Error updating bike', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <VendorLayout title="Edit Bike">
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b5e3c]" />
      </div>
    </VendorLayout>
  );



  return (
    <VendorLayout title="Edit Bike">
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg:'', type:'' })} />
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate('/vendor/bikes')}
          className="mb-5 flex items-center gap-2 text-[#8b5e3c] font-bold hover:underline text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to My Bikes
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Section title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Bike Title"><input className={inp} value={form.title} onChange={set('title')} placeholder="e.g. Royal Enfield Classic 350" /></Field>
              <Field label="Brand *"><input className={inp} value={form.brand} onChange={set('brand')} required /></Field>
              <Field label="Model *"><input className={inp} value={form.model} onChange={set('model')} required /></Field>
              <Field label="Year *"><input className={inp} type="number" value={form.year} onChange={set('year')} required /></Field>
              <Field label="Bike Type">
                <select className={inp + " appearance-none"} value={form.bikeType} onChange={set('bikeType')}>
                  <option value="">Select Type</option>
                  {BIKE_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="License Plate"><input className={inp} value={form.licensePlate} onChange={set('licensePlate')} /></Field>
            </div>
            <Field label="Description"><textarea className={inp} rows={3} value={form.description} onChange={set('description')} /></Field>
          </Section>

          <Section title="Specifications">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Engine CC"><input className={inp} type="number" value={form.cc} onChange={set('cc')} /></Field>
              <Field label="Fuel Type">
                <select className={inp + " appearance-none"} value={form.fuelType} onChange={set('fuelType')}>
                  <option value="">Select Fuel Type</option>
                  {FUEL_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Mileage"><input className={inp} value={form.mileage} onChange={set('mileage')} /></Field>
              <Field label="Color"><input className={inp} value={form.color} onChange={set('color')} /></Field>
            </div>
          </Section>

          <Section title="Pricing">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Price Per Hour (₹) *"><input className={inp} type="number" value={form.pricePerHour} onChange={set('pricePerHour')} required /></Field>
              <Field label="Price Per Day (₹) *"><input className={inp} type="number" value={form.pricePerDay} onChange={set('pricePerDay')} required /></Field>
            </div>
          </Section>

          <Section title="Location & Availability">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="City *"><input className={inp} value={form.city} onChange={set('city')} required /></Field>
              <Field label="State"><input className={inp} value={form.state} onChange={set('state')} /></Field>
              <Field label="Address"><input className={inp} value={form.address} onChange={set('address')} /></Field>
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
            <Field label="Availability Status">
              <label className="flex items-center gap-3 cursor-pointer mt-1">
                <input type="checkbox" checked={form.isAvailable}
                  onChange={e => setForm(f => ({ ...f, isAvailable: e.target.checked }))}
                  className="h-5 w-5 accent-[#8b5e3c]" />
                <span className="text-sm font-bold text-[#4a3224]">Bike is currently available for rent</span>
              </label>
            </Field>
          </Section>

          <Section title="Bike Images">
            <Field label="Image URLs (one per line)">
              <textarea className={inp} rows={4} value={form.images} onChange={set('images')}
                placeholder={"https://example.com/bike1.jpg\nhttps://example.com/bike2.jpg"} />
            </Field>
          </Section>

          <div className="flex flex-col sm:flex-row gap-4">
            <button type="submit" disabled={submitting}
              className="flex-1 py-4 bg-[#8b5e3c] text-white rounded-2xl font-black text-base shadow-lg hover:bg-[#6f4b30] transition-all flex items-center justify-center gap-3">
              {submitting
                ? <span className="inline-block w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <Save className="h-5 w-5" />}
              {submitting ? 'Saving…' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => navigate('/vendor/bikes')}
              className="px-8 py-4 border-2 border-gray-300 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </VendorLayout>
  );
};

export default EditBike;
