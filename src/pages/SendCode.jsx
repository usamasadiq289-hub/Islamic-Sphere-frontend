import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../apis/auth';

const SendCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    verificationCode: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Get email from location state if available
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await AuthService.verifyEmail({
        email,
        verificationCode: formData.verificationCode
      });
      setMessage(response.message || 'Email verified successfully!');
      // Redirect to login after successful verification
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.error || 'Failed to verify email. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'
      style={{
        background:
          'linear-gradient(135deg, rgba(5, 81, 96, 0.1) 0%, rgba(5, 81, 96, 0.05) 100%)',
      }}
    >
      <div className='max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg'>
        <h2 className='mt-6 text-center text-3xl font-extrabold text-[#055160]'>
          Verify Email
        </h2>

        {message && (
          <div className='mt-2 text-center text-sm text-green-600'>
            {message}
          </div>
        )}
        {error && (
          <div className='mt-2 text-center text-sm text-red-600'>{error}</div>
        )}

        <form onSubmit={handleSubmit} className='mt-8 space-y-6'>
          <div className='rounded-md shadow-sm -space-y-px'>
            <div>
              <label htmlFor='resetCode' className='sr-only'>
                Verification Code
              </label>
              <input
                id='verificationCode'
                name='verificationCode'
                type='text'
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-700 focus:border-teal-700 focus:z-10 sm:text-sm'
                placeholder='Enter verification code sent to your email'
                value={formData.verificationCode}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#055160] hover:bg-[#044352] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-700 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Sending...' : 'Send Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendCode;
