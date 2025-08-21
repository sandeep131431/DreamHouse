import React from 'react';
import { FaHome, FaUsers, FaTrophy, FaHandshake, FaChartLine, FaHeart } from 'react-icons/fa';

export default function About() {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 to-purple-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className='text-4xl md:text-5xl font-bold mb-6'>About Dream Homes</h1>
          <p className='text-xl max-w-3xl mx-auto'>
            Transforming real estate experiences with innovation, integrity, and exceptional service
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className='max-w-6xl mx-auto px-4 py-16'>
        {/* Intro Section */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Welcome to Dream Homes</h2>
            <p className='mb-6 text-lg text-slate-700 leading-relaxed'>
              Dream Homes is a leading real estate agency that specializes in helping clients buy, sell, and rent properties in the most desirable neighborhoods. Our team of experienced agents is dedicated to providing exceptional service and making the buying and selling process as smooth as possible.
            </p>
            <p className='mb-6 text-lg text-slate-700 leading-relaxed'>
              Our mission is to help our clients achieve their real estate goals by providing expert advice, personalized service, and a deep understanding of the local market. Whether you are looking to buy, sell, or rent a property, we are here to help you every step of the way.
            </p>
            <p className='text-lg text-slate-700 leading-relaxed'>
              Our team of agents has a wealth of experience and knowledge in the real estate industry, and we are committed to providing the highest level of service to our clients. We believe that buying or selling a property should be an exciting and rewarding experience, and we are dedicated to making that a reality for each and every one of our clients.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full text-blue-600">
                <FaHandshake className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Integrity</h3>
              <p className="text-slate-700">We believe in transparency and honesty in all our dealings, building trust with our clients.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full text-blue-600">
                <FaChartLine className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expertise</h3>
              <p className="text-slate-700">Our deep market knowledge and experience ensure you get the best advice and results.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full text-blue-600">
                <FaHeart className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Care</h3>
              <p className="text-slate-700">We treat every client like family, understanding your unique needs and aspirations.</p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16 bg-blue-900 text-white rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-12">By The Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <p className="text-blue-200">Happy Clients</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">$1B+</div>
              <p className="text-blue-200">Property Sales</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">15+</div>
              <p className="text-blue-200">Years Experience</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
              <p className="text-blue-200">Client Satisfaction</p>
            </div>
          </div>
        </section>

        {/* Team Approach Section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Our Team Approach</h2>
              <p className="text-lg text-slate-700 mb-4">
                At Dream Homes, we believe in collaborative service. Each client is supported by a dedicated team including a primary agent, marketing specialist, and closing coordinator.
              </p>
              <p className="text-lg text-slate-700">
                This ensures that every aspect of your real estate journey receives expert attention, from the initial search to the final paperwork.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl h-64 md:h-80 flex items-center justify-center text-white text-center p-6">
                <div>
                  <FaUsers className="text-5xl mx-auto mb-4" />
                  <p className="text-xl font-semibold">Dedicated Professionals Working For You</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl text-white">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Dream Home?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let our experienced team guide you through every step of your real estate journey.
          </p>
          <button className="bg-white text-blue-800 font-semibold py-3 px-8 rounded-lg hover:bg-blue-100 transition-colors">
            Contact Us Today
          </button>
        </section>
      </div>
    </div>
  );
}