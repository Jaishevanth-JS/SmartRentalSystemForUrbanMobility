import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';
import { Bike, Search, CheckCircle, XCircle, X, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ManageBikes = () => {
  const navigate = useNavigate();
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBike, setSelectedBike] = useState(null);
  const [selectedImg, setSelectedImg] = useState(0);

  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      const res = await API.get('/admin/bikes');
      setBikes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      const res = await API.put(`/admin/bikes/${id}/approve`, { status });
      setBikes(bikes.map(b => b._id === id ? { ...b, approvalStatus: status, isApproved: res.data.bike.isApproved } : b));
      window.dispatchEvent(new Event('bikeStatusChanged'));
    } catch (err) {
      toast.error('Error updating bike status');
    }
  };

  const filtered = bikes.filter(b => 
    b.brand?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.ownerId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Manage Bikes">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search bikes or vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#e2d5c3] rounded-2xl focus:outline-none focus:border-[#8b5e3c] shadow-sm font-medium"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#e2d5c3] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#8b5e3c] mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <Bike className="h-16 w-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-black text-[#4a3224]">No bikes listed yet</h3>
            <p className="text-gray-400 mt-2">Vendor submissions will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#fdfaf6] border-b border-[#e2d5c3]">
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Bike Details</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Location/Pricing</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f0eb]">
                {filtered.map(bike => (
                  <tr key={bike._id} className="hover:bg-[#fdfaf6] transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                          {bike.images?.[0] ? <img src={bike.images[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Bike className="h-5 w-5 text-gray-300"/></div>}
                        </div>
                        <div>
                          <p className="font-black text-[#4a3224]">{bike.brand} {bike.model}</p>
                          <p className="text-xs text-gray-400">{bike.year} • {bike.bikeType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-700 text-sm">{bike.ownerId?.name || 'Unknown'}</p>
                      <p className="text-[10px] text-gray-400">{bike.ownerId?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-700 text-sm">{bike.city}</p>
                      <p className="text-xs text-[#8b5e3c] font-black">₹{bike.pricePerDay}/day</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-black ${
                        bike.approvalStatus === 'Approved' ? 'bg-green-100 text-green-700' :
                        bike.approvalStatus === 'Rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {bike.approvalStatus || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {bike.approvalStatus !== 'Approved' && (
                          <button onClick={() => handleStatus(bike._id, 'Approved')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="Approve">
                            <CheckCircle className="h-5 w-5" />
                          </button>
                        )}
                        {bike.approvalStatus !== 'Rejected' && (
                          <button onClick={() => handleStatus(bike._id, 'Rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Reject">
                            <XCircle className="h-5 w-5" />
                          </button>
                        )}
                        <button onClick={() => { setSelectedBike(bike); setSelectedImg(0); }} className="px-3 py-1.5 bg-[#f5f0eb] text-[#8b5e3c] hover:bg-[#8b5e3c] hover:text-white rounded-lg text-xs font-bold transition ml-1">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* BIKE DETAILS MODAL */}
      {selectedBike && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative custom-scrollbar">
            <button 
              onClick={() => setSelectedBike(null)} 
              className="absolute top-6 right-6 p-2 bg-[#f5f0eb] text-gray-500 hover:text-black rounded-full transition z-10"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="p-8 md:p-10">
              <h2 className="text-3xl font-black text-[#4a3224] mb-8">Bike Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                
                {/* Visuals & Identifiers */}
                <div className="space-y-6">
                  <div className="h-64 bg-gray-100 rounded-3xl overflow-hidden shadow-sm">
                    {selectedBike.images?.[selectedImg] ? (
                      <img src={selectedBike.images[selectedImg]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Bike className="h-20 w-20 text-gray-300"/></div>
                    )}
                  </div>
                  {/* Gallery */}
                  {selectedBike.images?.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                      {selectedBike.images.map((img, i) => (
                        <button key={i} onClick={() => setSelectedImg(i)} className={`h-20 w-28 rounded-xl shadow-sm flex-shrink-0 overflow-hidden border-2 transition ${selectedImg === i ? 'border-[#8b5e3c]' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="bg-[#fdfaf6] p-6 rounded-2xl border border-[#e2d5c3]">
                    <h3 className="text-sm font-black uppercase text-gray-500 tracking-wider mb-4">Vendor Information</h3>
                    <p className="font-bold text-[#4a3224] text-lg">{selectedBike.ownerId?.name || 'Unknown Vendor'}</p>
                    <p className="text-sm text-gray-500 mb-1">{selectedBike.ownerId?.email}</p>
                    {selectedBike.ownerId?.phone && <p className="text-sm text-gray-500">{selectedBike.ownerId?.phone}</p>}
                  </div>
                </div>

                {/* Info Text */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-black text-[#4a3224]">{selectedBike.brand} {selectedBike.model}</h1>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="bg-[#f5f0eb] text-[#8b5e3c] px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase">{selectedBike.bikeType}</span>
                      <span className="bg-[#f5f0eb] text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{selectedBike.year}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[#8b5e3c]">
                    <MapPin className="h-5 w-5" />
                    <span className="font-bold">{selectedBike.city}, {selectedBike.state}</span>
                  </div>
                  {selectedBike.address && <p className="text-sm text-gray-500 pl-9 -mt-2">{selectedBike.address}</p>}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#f5f0eb] p-4 rounded-2xl text-center">
                      <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Price Per Day</p>
                      <p className="text-xl font-black text-[#8b5e3c]">₹{selectedBike.pricePerDay}</p>
                    </div>
                    <div className="bg-[#f5f0eb] p-4 rounded-2xl text-center">
                      <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Price Per Hour</p>
                      <p className="text-xl font-black text-[#8b5e3c]">₹{selectedBike.pricePerHour}</p>
                    </div>
                  </div>

                  <div className="bg-[#fdfaf6] p-5 rounded-2xl border border-[#e2d5c3] grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    {selectedBike.cc && <div><span className="text-gray-400 font-bold">Engine:</span> <span className="text-gray-700 font-black">{selectedBike.cc}cc</span></div>}
                    {selectedBike.fuelType && <div><span className="text-gray-400 font-bold">Fuel:</span> <span className="text-gray-700 font-black">{selectedBike.fuelType}</span></div>}
                    {selectedBike.mileage && <div><span className="text-gray-400 font-bold">Mileage:</span> <span className="text-gray-700 font-black">{selectedBike.mileage}</span></div>}
                    {selectedBike.color && <div><span className="text-gray-400 font-bold">Color:</span> <span className="text-gray-700 font-black">{selectedBike.color}</span></div>}
                    {selectedBike.licensePlate && <div><span className="text-gray-400 font-bold">Plate:</span> <span className="text-gray-700 font-black uppercase">{selectedBike.licensePlate}</span></div>}
                  </div>

                  {selectedBike.description && (
                     <div>
                       <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description</h3>
                       <p className="text-sm text-gray-600 leading-relaxed bg-[#fdfaf6] p-4 rounded-xl">{selectedBike.description}</p>
                     </div>
                  )}

                  <div className="flex gap-4 pt-6 border-t border-[#e2d5c3]">
                    {selectedBike.approvalStatus !== 'Approved' && (
                      <button onClick={() => { handleStatus(selectedBike._id, 'Approved'); setSelectedBike({...selectedBike, approvalStatus: 'Approved'}); }} className="flex-1 py-4 bg-green-500 text-white rounded-xl font-black shadow-lg hover:bg-green-600 transition flex items-center justify-center gap-2">
                        <CheckCircle className="h-5 w-5" /> Approve Bike
                      </button>
                    )}
                    {selectedBike.approvalStatus !== 'Rejected' && (
                      <button onClick={() => { handleStatus(selectedBike._id, 'Rejected'); setSelectedBike({...selectedBike, approvalStatus: 'Rejected'}); }} className="flex-1 py-4 bg-red-50 text-red-600 border border-red-200 rounded-xl font-black shadow-sm hover:bg-red-500 hover:text-white transition flex items-center justify-center gap-2">
                        <XCircle className="h-5 w-5" /> Reject Bike
                      </button>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default ManageBikes;
