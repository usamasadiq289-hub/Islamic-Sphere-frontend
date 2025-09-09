import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../apis/auth';
import './ForgotPassword.css'; 


const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    resetCode: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Get email from localStorage on component mount
  useEffect(() => {
    const storedEmail = localStorage.getItem('resetEmail') || localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleResendCode = async () => {
    if (!userEmail) {
      setError('No email found. Please go back to forgot password page.');
      return;
    }

    setResendLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await AuthService.forgotPassword(userEmail);
      setMessage(`Reset code sent to ${userEmail}`);
      
      // Auto-dismiss the message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err) {
      setError(err.error || 'Failed to resend reset code');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await AuthService.resetPassword(formData);
      setMessage(response.message);
      
      // Clear stored emails after successful password reset
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('userEmail');
      
      // Redirect to login after successful password reset
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.error || 'Failed to reset password');
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
          Reset Password
        </h2>

        {userEmail && (
          <div className='mt-2 text-center text-sm text-gray-600'>
            Reset code will be sent to: <strong>{userEmail}</strong>
          </div>
        )}

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
                Reset Code
              </label>
              <input
                id='resetCode'
                name='resetCode'
                type='text'
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-700 focus:border-teal-700 focus:z-10 sm:text-sm'
                placeholder='Enter reset code'
                value={formData.resetCode}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className='rounded-md shadow-sm -space-y-px'>
            <div>
              <label htmlFor='password' className='sr-only'>
                New Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-700 focus:border-teal-700 focus:z-10 sm:text-sm'
                placeholder='Enter new password'
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className='rounded-md shadow-sm -space-y-px'>
            <div>
              <label htmlFor='confirmPassword' className='sr-only'>
                Confirm Password
              </label>
              <input
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-700 focus:border-teal-700 focus:z-10 sm:text-sm'
                placeholder='Confirm new password'
                value={formData.confirmPassword}
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
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>

          {/* Resend Code Button - positioned on the right below Reset Password button */}
          {userEmail && (
            <div className='flex justify-end mt-3'>
              <button
                type='button'
                onClick={handleResendCode}
                disabled={resendLoading}
                className={`text-sm text-[#ffffff] hover:text-[#044352] font-medium ${
                  resendLoading ? 'opacity-50 cursor-not-allowed' : 'hover:underline'
                }`}
              >
                {resendLoading ? 'Sending...' : `Resend code`}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
