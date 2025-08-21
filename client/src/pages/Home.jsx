import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ListingItem from '../components/ListingItem';
import { FaHome, FaTag, FaKey, FaSearch, FaArrowRight } from 'react-icons/fa';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  SwiperCore.use([Navigation, Autoplay, Pagination]);
  
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const [offerRes, rentRes, saleRes] = await Promise.all([
          fetch('/api/listing/get?offer=true&limit=4'),
          fetch('/api/listing/get?type=rent&limit=4'),
          fetch('/api/listing/get?type=sale&limit=4')
        ]);
        
        const offerData = await offerRes.json();
        const rentData = await rentRes.json();
        const saleData = await saleRes.json();
        
        setOfferListings(offerData);
        setRentListings(rentData);
        setSaleListings(saleData);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    
    fetchListings();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-purple-800 text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-4 md:px-8 lg:px-12 flex flex-col items-center text-center">
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-4'>
            Find Your Next <span className='text-blue-300'>Perfect</span> Home
          </h1>
          <p className='text-lg md:text-xl text-blue-100 max-w-2xl mb-8'>
            Discover your dream property from our curated collection of premium listings
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to={'/search'}
              className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg transition-all flex items-center justify-center gap-2'
            >
              <FaSearch /> Explore Properties
            </Link>
            <Link
              to={'/search?offer=true'}
              className='bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 text-white font-medium py-3 px-8 rounded-lg transition-all'
            >
              Special Offers
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full text-blue-600">
                <FaSearch className="text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Your Property</h3>
              <p className="text-gray-600">Browse through thousands of properties to find your perfect match</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full text-blue-600">
                <FaKey className="text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Schedule a Visit</h3>
              <p className="text-gray-600">Connect with property owners and schedule viewings at your convenience</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full text-blue-600">
                <FaHome className="text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Move In</h3>
              <p className="text-gray-600">Complete the process and move into your dream home effortlessly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Swiper */}
      {offerListings && offerListings.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Special Offers</h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">Check out our exclusive deals on premium properties</p>
            
            <Swiper 
              navigation 
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              loop={true}
              className="rounded-xl overflow-hidden shadow-lg"
            >
              {offerListings.map((listing) => (
                <SwiperSlide key={listing._id}>
                  <div className="relative">
                    <div
                      style={{
                        background: `url(${listing.imageUrls[0]}) center no-repeat`,
                        backgroundSize: 'cover',
                      }}
                      className='h-[400px] md:h-[500px] w-full'
                    ></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{listing.name}</h3>
                      <p className="text-lg font-semibold mb-2">
                        ${listing.offer ? listing.discountPrice.toLocaleString() : listing.regularPrice.toLocaleString()}
                        {listing.offer && (
                          <span className="text-sm font-normal line-through ml-2">${listing.regularPrice.toLocaleString()}</span>
                        )}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span>{listing.bedrooms} Bedrooms</span>
                        <span>{listing.bathrooms} Bathrooms</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* Loading State */}
      {loading && (
        <div className="max-w-6xl mx-auto p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      )}

      {/* Listing results for offer, sale and rent */}
      <div className='max-w-6xl mx-auto px-4 md:px-8 lg:px-12 py-12'>
        {offerListings && offerListings.length > 0 && (
          <div className='mb-16'>
            <div className='mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
              <div>
                <h2 className='text-2xl md:text-3xl font-bold text-gray-800'>Recent Offers</h2>
                <p className='text-gray-600 mt-2'>Properties with special discounts</p>
              </div>
              <Link 
                className='inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors' 
                to={'/search?offer=true'}
              >
                View all offers <FaArrowRight className="ml-2" />
              </Link>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        
        {rentListings && rentListings.length > 0 && (
          <div className='mb-16'>
            <div className='mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
              <div>
                <h2 className='text-2xl md:text-3xl font-bold text-gray-800'>Places for Rent</h2>
                <p className='text-gray-600 mt-2'>Find your perfect rental property</p>
              </div>
              <Link 
                className='inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors' 
                to={'/search?type=rent'}
              >
                View all rentals <FaArrowRight className="ml-2" />
              </Link>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        
        {saleListings && saleListings.length > 0 && (
          <div className='mb-16'>
            <div className='mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
              <div>
                <h2 className='text-2xl md:text-3xl font-bold text-gray-800'>Places for Sale</h2>
                <p className='text-gray-600 mt-2'>Discover properties for purchase</p>
              </div>
              <Link 
                className='inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors' 
                to={'/search?type=sale'}
              >
                View all properties <FaArrowRight className="ml-2" />
              </Link>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Dream Home?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of satisfied customers who found their perfect property through us</p>
          <Link
            to={'/search'}
            className='inline-block bg-white text-blue-900 hover:bg-blue-100 font-bold py-4 px-10 rounded-lg transition-all text-lg'
          >
            Start Searching Now
          </Link>
        </div>
      </section>
    </div>
  );
}