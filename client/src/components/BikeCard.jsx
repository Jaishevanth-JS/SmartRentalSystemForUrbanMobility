import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';

const BikeCard = ({ bike }) => {
  const navigate = useNavigate();

  const rating = bike.averageRating > 0 
    ? bike.averageRating.toFixed(1) 
    : (bike.totalReviews > 0 ? bike.averageRating?.toFixed(1) : 'New');

  return (
    <div className="card-brown overflow-hidden flex flex-col h-full group hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img 
          src={bike.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'} 
          alt={`${bike.brand} ${bike.model}`} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-[#8b5e3c] flex items-center shadow-sm">
          <Star className={`h-3 w-3 mr-1 ${rating !== 'New' ? 'fill-current text-yellow-500' : ''}`} />
          {rating}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-black text-lg text-[#4a3224]">{bike.brand} {bike.model}</h3>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <MapPin className="h-3 w-3 mr-1 text-[#8b5e3c]" />
              {bike.city}
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-[#8b5e3c]">₹{bike.pricePerDay}</span>
            <p className="text-[10px] text-gray-400 font-bold">per day</p>
          </div>
        </div>
        <div className="mt-auto">
          <button 
            onClick={() => navigate(`/bikes/${bike._id}`)}
            className="w-full btn-brown text-sm mt-3 py-3 font-bold"
          >
            Rent Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BikeCard;
