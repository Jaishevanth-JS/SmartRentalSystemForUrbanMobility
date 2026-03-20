import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BikeCard from '../components/BikeCard';
import Spinner from '../components/Spinner';
import { Filter, Search, SlidersHorizontal, MapPin, IndianRupee, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';

const BrowseBikes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    bikeType: searchParams.get('bikeType') || '',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || ''
  });

  const [sortOption, setSortOption] = useState('newest');

  useEffect(() => {
    const fetchBikes = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(filters).toString();
        const res = await API.get(`/bikes?${queryParams}`);
        let data = res.data;

        // Apply sorting on frontend or backend? Let's do frontend for now
        if (sortOption === 'priceLowHigh') data.sort((a,b) => a.pricePerDay - b.pricePerDay);
        if (sortOption === 'priceHighLow') data.sort((a,b) => b.pricePerDay - a.pricePerDay);
        if (sortOption === 'topRated') data.sort((a,b) => (b.rating || 0) - (a.rating || 0));

        setBikes(data);
      } catch (err) {
        toast.error('Failed to fetch bikes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBikes();
  }, [filters, sortOption]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    setSearchParams(newFilters);
  };

  const clearFilters = () => {
    const fresh = { city: '', bikeType: '', priceMin: '', priceMax: '', startDate: '', endDate: '' };
    setFilters(fresh);
    setSearchParams(fresh);
  };

  return (
    <div className="min-h-screen bg-[#fdfaf6] flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white border border-[#e2d5c3] rounded-2xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-[#4a3224] flex items-center">
                  <Filter className="h-4 w-4 mr-2" /> Filters
                </h3>
                <button onClick={clearFilters} className="text-xs text-[#8b5e3c] font-semibold hover:underline">Clear All</button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      name="city"
                      placeholder="e.g. Mumbai"
                      className="w-full pl-9 pr-4 py-2 text-sm border border-[#e2d5c3] rounded-lg focus:outline-none focus:border-[#8b5e3c]"
                      value={filters.city}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Bike Type</label>
                  <select 
                    name="bikeType"
                    className="w-full px-4 py-2 text-sm border border-[#e2d5c3] rounded-lg focus:outline-none focus:border-[#8b5e3c]"
                    value={filters.bikeType}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Types</option>
                    <option value="Cruiser">Cruiser</option>
                    <option value="Sport">Sport</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Dirt Bike">Dirt Bike</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Price Range (Daily)</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      name="priceMin"
                      placeholder="Min"
                      className="w-1/2 px-3 py-2 text-sm border border-[#e2d5c3] rounded-lg focus:outline-none focus:border-[#8b5e3c]"
                      value={filters.priceMin}
                      onChange={handleFilterChange}
                    />
                    <span className="text-gray-400">-</span>
                    <input 
                      type="number" 
                      name="priceMax"
                      placeholder="Max"
                      className="w-1/2 px-3 py-2 text-sm border border-[#e2d5c3] rounded-lg focus:outline-none focus:border-[#8b5e3c]"
                      value={filters.priceMax}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Rental Period</label>
                  <div className="space-y-2">
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <input 
                        type="date" 
                        name="startDate"
                        className="w-full pl-9 pr-4 py-2 text-sm border border-[#e2d5c3] rounded-lg focus:outline-none focus:border-[#8b5e3c]"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                      />
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <input 
                        type="date" 
                        name="endDate"
                        className="w-full pl-9 pr-4 py-2 text-sm border border-[#e2d5c3] rounded-lg focus:outline-none focus:border-[#8b5e3c]"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <section className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold text-[#4a3224]">
                Available Bikes <span className="text-sm font-normal text-gray-500 ml-2">({bikes.length} results)</span>
              </h2>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <SlidersHorizontal className="h-4 w-4 text-[#8b5e3c]" />
                <span className="text-sm text-gray-600">Sort by:</span>
                <select 
                  className="bg-transparent text-sm font-bold text-[#8b5e3c] outline-none border-none cursor-pointer"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="priceLowHigh">Price: Low to High</option>
                  <option value="priceHighLow">Price: High to Low</option>
                  <option value="topRated">Top Rated</option>
                </select>
              </div>
            </div>

            {loading ? (
              <Spinner />
            ) : bikes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {bikes.map(bike => (
                  <BikeCard key={bike._id} bike={bike} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#e2d5c3] p-16 text-center shadow-inner">
                <div className="h-24 w-24 bg-[#fdfaf6] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-[#4a3224] mb-2">No bikes available right now. Check back soon!</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">Try adjusting your filters or browse other cities for more adventure.</p>
                <div className="flex justify-center gap-4">
                  <button onClick={clearFilters} className="btn-outline-brown px-6">Clear Filters</button>
                  <Link to="/" className="btn-brown px-6">Return Home</Link>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BrowseBikes;
