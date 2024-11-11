// src/Login.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, signupUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function Login() {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));

    if (result.meta.requestStatus === 'fulfilled') {
      if (document.getElementById('remember_me').checked) {
        // Store token in localStorage if "Remember me" is checked
        localStorage.setItem('token', result.payload.token);
      }
      navigate('/dashboard');
    } 
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const result = await dispatch(signupUser({ username, email, password }));

    if (result.meta.requestStatus === 'fulfilled') {
      setIsSignup(false)
    }
  };

  return (
    <div className="flex items-center min-h-screen bg-gradient-to-r from-green-500 to-green-700 font-sans">
      {/* Form Side */}
      <div
        className={`bg-white shadow-lg rounded-lg p-8 mx-4 max-w-md w-full ml-20 transition-transform duration-700 ease-in-out transform ${isSignup ? 'rotate-y-180' : 'rotate-y-0'} `}
      >
        {/* Platform Header */}
        <div className="text-center mb-6">
          <h1
            className="text-3xl font-bold text-gray-800"
            style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}
          >
            {isSignup ? 'Sign up' : 'Log in'}
            <br />
            <span className="text-lg font-light">{isSignup ? 'to get started' : 'to access and manage your templates'}</span>
          </h1>

          <p className="text-gray-500 mt-5">Welcome to Dynamic Data Generation</p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={isSignup ? handleSignup : handleLogin}>
          {isSignup &&
            <div>
              <label className="block text-sm font-medium text-gray-700">
                User Name
                <input
                  id="username"
                  type="text"
                  value={username}
                  required
                  autoComplete="username"
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="yourname"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              </label>
            </div>
          }

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
              <input
                id="email"
                type="email"
                value={email}
                required
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@example.com"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </label>
          </div>

          {/* Password Field with Eye Icon */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Password
              <div className="relative">
                <input
                  id="password"
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  required
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 bg-transparent border-none focus:outline-none"
                  aria-label="toggle password visibility"
                >
                  {passwordVisible ? (
                    <VisibilityOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Visibility className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </label>
          </div>

          {/* Remember Me & Forgot Password */}
          {!isSignup && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember_me" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="remember_me" className="ml-2 text-sm text-gray-900">Remember me</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Forgot password?</a>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3 text-white bg-green-600 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : isSignup ? 'Sign Up' : 'Login'}
            </button>
          </div>
        </form>

        {/* Switch to Sign Up / Log In */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isSignup ? 'Already have an account? ' : 'New to the platform? '}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              {isSignup ? 'Log in' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>

      {/* Image Side */}
      <div className="hidden lg:block w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url(/path/to/your-image.jpg)' }}></div>
    </div>
  );

}

export default Login;
