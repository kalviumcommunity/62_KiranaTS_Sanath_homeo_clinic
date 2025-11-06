/* eslint-disable no-unused-vars */
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useState } from 'react';

const GoogleLoginButton = ({ formData, onSuccess, onError, disabled }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [familyCode, setFamilyCode] = useState(null);

  const handleSuccess = async (credentialResponse) => {
    if (disabled) return;
    
    setIsLoading(true);
    
    try {
      // Format the data exactly as your backend expects
      const requestData = {
        token: credentialResponse.credential,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob ? formData.dob.toISOString().split('T')[0] : '',
        gender: formData.gender,
        doctorId: formData.doctorId
      };


      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`,
        requestData,
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );


      // Extract family_code from backend response
      const patientFamilyCode = res.data?.patient?.family_code;
      if (patientFamilyCode) {
        setFamilyCode(patientFamilyCode);
      }

      if (onSuccess) {
        onSuccess(res.data);
      }
    } catch (err) {
      console.error('Google Signup Error:', err);
      console.error('Error response:', err.response?.data);
      
      if (onError) {
        onError(err);
      } else {
        alert(err.response?.data?.message || "Google signup failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    if (onError) {
      onError(new Error("Google login failed"));
    } else {
      alert("Google login failed. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <GoogleLogin 
        onSuccess={handleSuccess} 
        onError={handleError}
        disabled={disabled || isLoading}
        flow="popup"
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            disabled={renderProps.disabled || isLoading || disabled}
            className={`
              w-full group relative overflow-hidden
              px-6 py-3.5 rounded-xl
              bg-gradient-to-r from-slate-50 to-slate-100
              border-2 border-slate-200
              hover:border-slate-300 hover:shadow-lg
              transition-all duration-300 ease-out
              disabled:opacity-50 disabled:cursor-not-allowed
              ${(isLoading || disabled) ? 'animate-pulse' : ''}
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              
              <span className="font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                {isLoading ? 'Signing up with Google...' : 'Sign up with Google'}
              </span>
              
              {isLoading && (
                <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              )}
            </div>
          </button>
        )}
      />
    </div>
  );
};

export default GoogleLoginButton;
