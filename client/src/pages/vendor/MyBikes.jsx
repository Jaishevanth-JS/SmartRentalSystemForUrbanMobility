import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import VendorLayout from '../../components/VendorLayout';
import { Bike, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react';

const ApprovalBadge = ({ isApproved }) => {
  if (isApproved === true)
    return <span className="px-3 py-1 text-xs font-black bg-green-100 text-green-700 rounded-full">✓ Approved</span>;
  if (isApproved === false)
    return <span className="px-3 py-1 text-xs font-black bg-yellow-100 text-yellow-700 rounded-full">⏳ Pending Approval</span>;
  return <span className="px-3 py-1 text-xs font-black bg-red-100 text-red-600 rounded-full">✗ Rejected</span>;
};

const MyBikes = () => {
  const navigate = useNavigate();
  const [bikes, setBikes]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null); // bike id to confirm delete

  const fetchBikes = async () => {
    try {
      const res = await API.get('/bikes/vendor/my-bikes');
      setBikes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBikes(); }, []);

  const handleToggle = async (id) => {
    try {
      const res = await API.patch(`/bikes/${id}/toggle`);
      setBikes(prev => prev.map(b => b._id === id ? { ...b, isAvailable: res.data.isAvailable } : b));
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/bikes/${id}`);
      setBikes(prev => prev.filter(b => b._id !== id));
      setConfirm(null);
    } catch (err) { console.error(err); }
  };

  return (
    <VendorLayout title="My Bikes">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-500 text-sm">{bikes.length} bike{bikes.length !== 1 ? 's' : ''} listed</p>
        <button onClick={() => navigate('/vendor/add-bike')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#8b5e3c] text-white rounded-xl font-black text-sm hover:bg-[#6f4b30] transition shadow-sm">
          <Plus className="h-4 w-4" /> Add New Bike
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b5e3c]" />
        </div>
      ) : bikes.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-[#e2d5c3] p-16 text-center">
          <Bike className="h-16 w-16 text-gray-200 mx-auto mb-5" />
          <h3 className="text-xl font-black text-[#4a3224] mb-2">You haven't listed any bikes yet</h3>
          <p className="text-gray-400 mb-6">Add your first bike to start earning!</p>
          <button onClick={() => navigate('/vendor/add-bike')}
            className="px-8 py-3 bg-[#8b5e3c] text-white rounded-2xl font-black hover:bg-[#6f4b30] transition inline-flex items-center gap-2">
            <Plus className="h-5 w-5" /> Add Your First Bike
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {bikes.map(bike => (
            <div key={bike._id} className="bg-white rounded-2xl border border-[#e2d5c3] shadow-sm overflow-hidden hover:shadow-md transition-all">
              {/* Image */}
              <div className="relative">
                <div className="h-44 bg-[#f5f0eb] flex overflow-x-auto snap-x snap-mandatory rounded-t-2xl">
                  {bike.images?.length > 0 ? (
                    bike.images.map((img, idx) => (
                      <img key={idx} src={img} alt="" className="w-full h-full object-cover flex-shrink-0 snap-center"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }} />
                    ))
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 flex-shrink-0">
                      <Bike className="h-14 w-14" />
                    </div>
                  )}
                </div>
                {/* Availability toggle overlay */}
                <button onClick={() => handleToggle(bike._id)}
                  className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-black shadow-sm hover:bg-white transition z-10">
                  {bike.isAvailable
                    ? <><ToggleRight className="h-4 w-4 text-green-500" /><span className="text-green-600">Available</span></>
                    : <><ToggleLeft className="h-4 w-4 text-gray-400" /><span className="text-gray-500">Unavailable</span></>
                  }
                </button>
              </div>

              {/* Details */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-black text-[#4a3224]">{bike.brand} {bike.model}</h4>
                    <p className="text-xs text-gray-400">{bike.city}{bike.state ? `, ${bike.state}` : ''} · {bike.year}</p>
                  </div>
                  <ApprovalBadge isApproved={bike.isApproved} />
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm font-black text-[#8b5e3c]">₹{bike.pricePerDay}<span className="font-normal text-gray-400 text-xs">/day</span></span>
                  {bike.bikeType && <span className="text-xs bg-[#f5f0eb] text-[#8b5e3c] px-2 py-1 rounded-full font-bold">{bike.bikeType}</span>}
                </div>

                {!bike.isApproved && (
                  <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
                    <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-700 font-medium">Awaiting admin approval to go live.</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button onClick={() => navigate(`/vendor/edit-bike/${bike._id}`)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#f5f0eb] text-[#8b5e3c] rounded-xl text-sm font-black hover:bg-[#8b5e3c] hover:text-white transition">
                    <Pencil className="h-4 w-4" /> Edit
                  </button>
                  <button onClick={() => setConfirm(bike._id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-500 rounded-xl text-sm font-black hover:bg-red-500 hover:text-white transition">
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
              <Trash2 className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-black text-[#4a3224] mb-2">Delete this bike?</h3>
            <p className="text-gray-400 text-sm mb-6">This action cannot be undone. All listing data will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)}
                className="flex-1 py-3 border-2 border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
              <button onClick={() => handleDelete(confirm)}
                className="flex-1 py-3 bg-red-500 text-white rounded-2xl font-black hover:bg-red-600 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </VendorLayout>
  );
};

export default MyBikes;
