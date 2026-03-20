import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BikeCard from '../components/BikeCard';
import Spinner from '../components/Spinner';
import { Search, Calendar, ShieldCheck, MapPin } from 'lucide-react';

const Home = () => {
  const [featuredBikes, setFeaturedBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({ city: '', startDate: '', endDate: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const res = await API.get('/bikes');
        const ratedBikes = res.data.filter(b => b.averageRating > 0 && b.totalReviews > 0);
        setFeaturedBikes(ratedBikes.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBikes();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams(searchParams).toString();
    navigate(`/browse?${queryParams}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-[#fdfaf6] pt-16 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#4a3224] mb-6 leading-tight">
              Ride Your <span className="text-[#8b5e3c]">Dream Bike</span> <br /> Anywhere, Anytime.
            </h1>
            <p className="text-xl text-[#6f4b30] max-w-2xl mx-auto mb-10">
              Premium bikes for every adventure. Rent a bike in minutes and hit the road.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="bg-white p-4 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 max-w-4xl mx-auto border border-[#e2d5c3]">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-[#8b5e3c]" />
                <input 
                  type="text" 
                  placeholder="Where are you going? (City)" 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-transparent bg-gray-50 focus:bg-white focus:border-[#8b5e3c] outline-none transition"
                  value={searchParams.city}
                  onChange={(e) => setSearchParams({...searchParams, city: e.target.value})}
                  required
                />
              </div>
              <div className="flex-1 flex gap-2">
                <div className="flex-1 relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-[#8b5e3c]" />
                  <input 
                    type="date" 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-transparent bg-gray-50 focus:bg-white focus:border-[#8b5e3c] outline-none transition"
                    value={searchParams.startDate}
                    onChange={(e) => setSearchParams({...searchParams, startDate: e.target.value})}
                  />
                </div>
                <div className="flex-1 relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-[#8b5e3c]" />
                  <input 
                    type="date" 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-transparent bg-gray-50 focus:bg-white focus:border-[#8b5e3c] outline-none transition"
                    value={searchParams.endDate}
                    onChange={(e) => setSearchParams({...searchParams, endDate: e.target.value})}
                  />
                </div>
              </div>
              <button type="submit" className="bg-[#8b5e3c] text-white px-8 py-3 rounded-xl hover:bg-[#6f4b30] transition flex items-center justify-center font-bold">
                <Search className="h-5 w-5 mr-2" />
                Find Bikes
              </button>
            </form>
          </div>

          {/* Hero Image */}
          <div className="relative h-72 md:h-[440px] w-full rounded-3xl overflow-hidden shadow-2xl border border-[#e2d5c3]">
            <img
              src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1400&q=90&auto=format&fit=crop"
              alt="Premium Bike Rental"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=90&auto=format&fit=crop";
              }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#4a3224]/70 via-[#4a3224]/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#4a3224]/60 via-transparent to-transparent" />

            {/* Overlay content */}
            <div className="absolute bottom-8 left-8 text-white">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-[#8b5e3c] text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  🏍️ Ride Today
                </span>
              </div>
              <p className="text-2xl md:text-3xl font-extrabold drop-shadow-md">500+ Bikes Available</p>
              <p className="text-sm text-[#e2d5c3] mt-1 font-medium drop-shadow">Across 20+ cities in India</p>
            </div>

            {/* Stats strip */}
            <div className="absolute bottom-8 right-8 flex flex-col gap-2">
              {[
                { label: 'Happy Riders', val: '10K+' },
                { label: 'Cities', val: '20+' },
              ].map(({ label, val }) => (
                <div key={label} className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl px-4 py-2 text-right">
                  <p className="text-white font-extrabold text-lg leading-none">{val}</p>
                  <p className="text-[#e2d5c3] text-[10px] font-bold uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Bikes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-[#4a3224]">Featured Bikes</h2>
              <p className="text-[#8b5e3c]">Our top-rated rides for your next journey</p>
            </div>
            <Link to="/browse" className="text-[#8b5e3c] font-semibold hover:underline">View All Bikes &rarr;</Link>
          </div>
          
          {loading ? (
            <Spinner />
          ) : featuredBikes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBikes.map(bike => (
                <BikeCard key={bike._id} bike={bike} />
              ))}
            </div>
          ) : (
            <div className="bg-[#fdfaf6] border border-dashed border-[#e2d5c3] p-12 rounded-3xl text-center">
              <p className="text-xl text-[#8b5e3c] font-medium italic mb-6">"No featured bikes yet. Be the first to ride and review!"</p>
              <Link to="/browse" className="btn-brown py-3 px-8 text-sm inline-flex items-center shadow-md">
                Explore Available Bikes
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-[#f8f3ed]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#4a3224]">How It Works</h2>
            <div className="h-1 w-20 bg-[#8b5e3c] mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="p-8">
              <div className="bg-white h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border border-[#e2d5c3]">
                <Search className="h-10 w-10 text-[#8b5e3c]" />
              </div>
              <h3 className="text-xl font-bold mb-4">1. Browse</h3>
              <p className="text-gray-600">Explore from our wide range of premium bikes across multiple cities.</p>
            </div>
            <div className="p-8 border-y md:border-y-0 md:border-x border-[#e2d5c3]">
              <div className="bg-white h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border border-[#e2d5c3]">
                <Calendar className="h-10 w-10 text-[#8b5e3c]" />
              </div>
              <h3 className="text-xl font-bold mb-4">2. Book</h3>
              <p className="text-gray-600">Select your dates, confirm your booking with secure payments.</p>
            </div>
            <div className="p-8">
              <div className="bg-white h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border border-[#e2d5c3]">
                <ShieldCheck className="h-10 w-10 text-[#8b5e3c]" />
              </div>
              <h3 className="text-xl font-bold mb-4">3. Ride</h3>
              <p className="text-gray-600">Pick up your bike from the host and enjoy your ride!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#4a3224] mb-16">What Our Riders Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="card-brown p-8">
                <div className="flex text-yellow-500 mb-4 font-bold">★★★★★</div>
                <p className="text-gray-600 mb-6 italic">"The process was incredibly smooth. The bike was in perfect condition and the owner was very helpful. Will definitely book again!"</p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-[#8b5e3c] mr-3"></div>
                  <div>
                    <h4 className="font-bold text-[#4a3224]">Rider Name</h4>
                    <p className="text-xs text-gray-500">Loyal Customer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#8b5e3c] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready for your next adventure?</h2>
          <p className="text-xl mb-10 opacity-90">Book your ride today and explore the world on two wheels.</p>
          <Link to="/browse" className="bg-white text-[#8b5e3c] px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-lg">
            Browse Bikes Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
