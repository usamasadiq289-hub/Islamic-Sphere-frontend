import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../apis/auth';

const ResendCode = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // Basic email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await AuthService.resendVerificationCode(email);
      setMessage(response.message);
      // Redirect to reset password page after 2 seconds
      // Redirect to SendCode page with email after 1 second
      setTimeout(() => {
        navigate('/send-code', { state: { email } });
      }, 1000);
    } catch (err) {
      setError(err.error || 'Failed to send verification code');
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
          Resend Verification Code
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
              <label htmlFor='email-address' className='sr-only'>
                Email Address
              </label>
              <input
                id='email-address'
                name='email'
                type='email'
                autoComplete='email'
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-700 focus:border-teal-700 focus:z-10 sm:text-sm'
                placeholder='Enter your email address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#055160] hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-700 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Sending...' : 'Resend Verification Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResendCode;
