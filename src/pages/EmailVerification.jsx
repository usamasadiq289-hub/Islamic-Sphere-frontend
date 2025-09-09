import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../apis/auth';
import './ForgotPassword.css'; 


const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleResendCode = async () => {
    if (!email) {
      setError('No email found. Please try signing up again.');
      return;
    }

    setResendLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await AuthService.resendVerificationCode(email);
      setMessage(`Verification code sent to ${email}`);
      
      // Auto-dismiss the message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err) {
      setError(err.error || 'Failed to resend verification code');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await AuthService.verifyEmail({
        email,
        verificationCode
      });
      
      setMessage(response.message);
      // Redirect to login after successful verification
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.error || 'Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className='forgot-password-container'
      // style={{
      //   background:
      //     'linear-gradient(135deg, rgba(5, 81, 96, 0.1) 0%, rgba(5, 81, 96, 0.05) 100%)',
      // }}
    >
      <div className='forgot-password-card'>
        <h2 className='mt-6 text-center text-3xl font-extrabold text-[#055160]'>
          Email Verification
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
              <label htmlFor='verification-code' className='sr-only'>
                Verification Code
              </label>
              <input
                id='verification-code'
                name='verificationCode'
                type='text'
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-700 focus:border-teal-700 focus:z-10 sm:text-sm'
                placeholder='Enter verification code'
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
          </div>

          <p className='text-sm text-gray-600 text-center'>
            We've sent a verification code to: <span className='font-medium'>{email || 'your email'}</span>
          </p>

          <div>
            <button
              type='submit'
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#055160] hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-700 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </div>

          {/* Resend Code Button - positioned on the right below Verify Email button */}
          <div className='flex justify-end mt-2'>
            <button
              type='button'
              onClick={handleResendCode}
              disabled={resendLoading}
              className={`text-sm text-[#055160] hover:text-[#044352] font-medium ${
                resendLoading ? 'opacity-50 cursor-not-allowed' : 'hover:underline'
              }`}
            >
              {resendLoading ? 'Sending...' : `Resend code${email ? ` to ${email}` : ''}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailVerification;