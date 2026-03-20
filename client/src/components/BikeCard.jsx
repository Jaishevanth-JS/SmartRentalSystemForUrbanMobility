import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';

const BikeCard = ({ bike }) => {
  const navigate = useNavigate();

  return (
    <div className="card-brown overflow-hidden flex flex-col h-full">
      <div className="relative h-48 sm:h-56">
        <img src={bike.images?.[0] || 'https://via.placeholder.com/300?text=Bike'} alt={bike.model} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-[#8b5e3c] flex items-center">
          <Star className="h-3 w-3 mr-1 fill-current" />
          {bike.rating || '4.5'}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-[#4a3224]">{bike.brand} {bike.model}</h3>
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="h-3 w-3 mr-1" />
              {bike.city}
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-[#8b5e3c]">₹{bike.pricePerDay}</span>
            <p className="text-[10px] text-gray-400">per day</p>
          </div>
        </div>
        <div className="mt-auto">
          <button 
            onClick={() => navigate(`/bikes/${bike._id}`)}
            className="w-full btn-brown text-sm mt-4"
          >
            Rent Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BikeCard;
