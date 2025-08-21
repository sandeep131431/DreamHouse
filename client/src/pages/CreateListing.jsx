import { useState, useCallback } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({}); // Track touched fields for better validation

  // Memoize the image upload handler to prevent unnecessary re-renders
  const handleImageSubmit = useCallback((e) => {
    if (files.length === 0) {
      setImageUploadError('Please select at least one image');
      return;
    }
    
    if (files.length > 6) {
      setImageUploadError('You can only upload up to 6 images per listing');
      return;
    }
    
    if (files.length + formData.imageUrls.length > 6) {
      setImageUploadError(`You can only have 6 images total. You already have ${formData.imageUrls.length} images`);
      return;
    }

    setUploading(true);
    setImageUploadError('');
    
    const promises = [];
    const validFiles = [];

    // Validate file sizes first
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 5 * 1024 * 1024) { // 5MB limit
        setImageUploadError(`Image ${files[i].name} is too large (max 5MB)`);
        setUploading(false);
        return;
      }
      validFiles.push(files[i]);
    }

    for (let i = 0; i < validFiles.length; i++) {
      promises.push(storeImage(validFiles[i]));
    }
    
    Promise.all(promises)
      .then((urls) => {
        setFormData(prev => ({
          ...prev,
          imageUrls: prev.imageUrls.concat(urls),
        }));
        setFiles([]); // Clear the file input after successful upload
        setUploading(false);
      })
      .catch((err) => {
        console.error('Upload error:', err);
        setImageUploadError('Image upload failed. Please try again.');
        setUploading(false);
      });
  }, [files, formData.imageUrls.length]);

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;
    
    setTouched(prev => ({ ...prev, [id]: true }));
    
    if (id === 'sale' || id === 'rent') {
      setFormData(prev => ({
        ...prev,
        type: id,
      }));
      return;
    }

    if (id === 'parking' || id === 'furnished' || id === 'offer') {
      setFormData(prev => ({
        ...prev,
        [id]: checked,
      }));
      return;
    }

    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [id]: value === '' ? '' : Number(value),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleBlur = (e) => {
    const { id } = e.target;
    setTouched(prev => ({ ...prev, [id]: true }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    else if (formData.name.length < 10) errors.name = 'Name must be at least 10 characters';
    else if (formData.name.length > 62) errors.name = 'Name must be less than 62 characters';
    
    if (!formData.description.trim()) errors.description = 'Description is required';
    
    if (!formData.address.trim()) errors.address = 'Address is required';
    
    if (formData.imageUrls.length < 1) errors.images = 'At least one image is required';
    
    if (formData.offer && +formData.regularPrice < +formData.discountPrice) {
      errors.discountPrice = 'Discount price must be lower than regular price';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched to show validation errors
    const allFields = ['name', 'description', 'address', 'bedrooms', 'bathrooms', 'regularPrice'];
    const newTouched = {};
    allFields.forEach(field => { newTouched[field] = true; });
    setTouched(newTouched);
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setError('Please fix the errors in the form');
      // Set individual field errors if needed
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      
      const data = await res.json();
      
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Helper to determine if a field should show error
  const shouldShowError = (field) => touched[field] && !formData[field];

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <div>
            <input
              type='text'
              placeholder='Name'
              className={`border p-3 rounded-lg w-full ${shouldShowError('name') ? 'border-red-500' : ''}`}
              id='name'
              maxLength='62'
              minLength='10'
              required
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.name}
            />
            {shouldShowError('name') && (
              <p className="text-red-500 text-xs mt-1">Name is required (10-62 characters)</p>
            )}
          </div>
          
          <div>
            <textarea
              placeholder='Description'
              className={`border p-3 rounded-lg w-full ${shouldShowError('description') ? 'border-red-500' : ''}`}
              id='description'
              rows="5"
              required
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.description}
            />
            {shouldShowError('description') && (
              <p className="text-red-500 text-xs mt-1">Description is required</p>
            )}
          </div>
          
          <div>
            <input
              type='text'
              placeholder='Address'
              className={`border p-3 rounded-lg w-full ${shouldShowError('address') ? 'border-red-500' : ''}`}
              id='address'
              required
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.address}
            />
            {shouldShowError('address') && (
              <p className="text-red-500 text-xs mt-1">Address is required</p>
            )}
          </div>
          
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'sale'}
              />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg w-20'
                onChange={handleChange}
                onBlur={handleBlur}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg w-20'
                onChange={handleChange}
                onBlur={handleBlur}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='50'
                max='10000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                onBlur={handleBlur}
                value={formData.regularPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                {formData.type === 'rent' && (
                  <span className='text-xs'>(₹ / month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  max='10000000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={formData.discountPrice}
                />
                <div className='flex flex-col items-center'>
                  <p>Discounted price</p>
                  {formData.type === 'rent' && (
                    <span className='text-xs'>(₹ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
              key={files.length} // Reset input after upload
            />
            <button
              type='button'
              disabled={uploading || files.length === 0}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 whitespace-nowrap'
            >
              {uploading ? 'Uploading...' : `Upload (${files.length})`}
            </button>
          </div>
          
          {imageUploadError && (
            <p className='text-red-700 text-sm'>{imageUploadError}</p>
          )}
          
          {formData.imageUrls.length > 0 ? (
            <>
              <p className="text-sm text-gray-600">
                {formData.imageUrls.length} image(s) uploaded. Click to set as cover.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {formData.imageUrls.map((url, index) => (
                  <div
                    key={url}
                    className={`relative border rounded-lg group ${index === 0 ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <img
                      src={url}
                      alt='listing'
                      className='w-full h-32 object-cover rounded-lg'
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type='button'
                        onClick={() => handleRemoveImage(index)}
                        className='p-2 bg-red-600 text-white rounded-full'
                        aria-label="Delete image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {index !== 0 && (
                        <button
                          type='button'
                          onClick={() => {
                            // Move image to first position (make it cover)
                            const newImageUrls = [...formData.imageUrls];
                            const [removed] = newImageUrls.splice(index, 1);
                            newImageUrls.unshift(removed);
                            setFormData(prev => ({ ...prev, imageUrls: newImageUrls }));
                          }}
                          className='p-2 bg-blue-600 text-white rounded-full ml-2'
                          aria-label="Set as cover"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {index === 0 && (
                      <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Cover
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-sm">No images uploaded yet</p>
          )}
          
          <button
            disabled={loading || uploading}
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-4'
          >
            {loading ? 'Creating...' : 'Create listing'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}