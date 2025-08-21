import { FaSearch, FaHome, FaInfoCircle, FaUser, FaPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className='bg-white shadow-md sticky top-0 z-50'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-4'>
        {/* Logo */}
        <Link to='/' className='flex items-center'>
          <div className='bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg'>
            <FaHome className='text-white text-xl' />
          </div>
          <h1 className='font-bold text-xl ml-2 hidden sm:block'>
            <span className='text-blue-600'>Dream</span>
            <span className='text-purple-600'>Homes</span>
          </h1>
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSubmit}
          className='flex-1 max-w-xl mx-4 bg-gray-100 rounded-full px-4 py-2 flex items-center transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:shadow-md'
        >
          <input
            type='text'
            placeholder='Search properties...'
            className='bg-transparent focus:outline-none w-full px-2'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            type='submit'
            className='bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors'
          >
            <FaSearch />
          </button>
        </form>

        {/* Navigation */}
        <div className='flex items-center gap-4'>
          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center gap-6'>
            <Link 
              to='/' 
              className='text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-1'
            >
              <FaHome className='text-sm' />
              <span>Home</span>
            </Link>
            <Link 
              to='/about' 
              className='text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-1'
            >
              <FaInfoCircle className='text-sm' />
              <span>About</span>
            </Link>
            
            {currentUser && (
              <Link 
                to='/create-listing' 
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors flex items-center gap-1 text-sm'
              >
                <FaPlus className='text-xs' />
                <span>Create</span>
              </Link>
            )}
            
            <Link to='/profile' className='flex items-center'>
              {currentUser ? (
                <div className='flex items-center gap-2'>
                  <img
                    className='rounded-full h-9 w-9 object-cover border-2 border-white shadow-sm'
                    src={currentUser.avatar}
                    alt='profile'
                  />
                  <span className='text-sm text-gray-700 hidden lg:block'>{currentUser.username}</span>
                </div>
              ) : (
                <button className='bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all flex items-center gap-1'>
                  <FaUser className='text-xs' />
                  <span>Sign in</span>
                </button>
              )}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className='md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className='space-y-1.5'>
              <div className={`w-6 h-0.5 bg-gray-700 transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-gray-700 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-gray-700 transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className='md:hidden bg-white border-t shadow-lg px-4 py-4'>
          <div className='flex flex-col space-y-4'>
            <Link 
              to='/' 
              className='text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2 py-2'
              onClick={() => setIsMenuOpen(false)}
            >
              <FaHome />
              <span>Home</span>
            </Link>
            <Link 
              to='/about' 
              className='text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2 py-2'
              onClick={() => setIsMenuOpen(false)}
            >
              <FaInfoCircle />
              <span>About</span>
            </Link>
            
            {currentUser && (
              <>
                <Link 
                  to='/create-listing' 
                  className='text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2 py-2'
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaPlus />
                  <span>Create Listing</span>
                </Link>
                <Link 
                  to='/profile' 
                  className='text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2 py-2'
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUser />
                  <span>Profile</span>
                </Link>
              </>
            )}
            
            {!currentUser && (
              <Link 
                to='/profile' 
                className='bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all flex items-center gap-2 justify-center'
                onClick={() => setIsMenuOpen(false)}
              >
                <FaUser />
                <span>Sign in</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}