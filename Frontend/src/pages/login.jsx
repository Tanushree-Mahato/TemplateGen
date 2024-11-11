// src/Login.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, signupUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LoginImg from '../assets/Documents.png';

function Login() {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));

    if (result.meta.requestStatus === 'fulfilled') {
      if (document.getElementById('remember_me').checked) {
        localStorage.setItem('token', result.payload.token);
      }
      navigate('/dashboard');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const result = await dispatch(signupUser({ username, email, password }));

    if (result.meta.requestStatus === 'fulfilled') {
      setIsSignup(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gradient-to-r from-green-500 to-green-700 font-sans">
      {/* Form Side */}
      <div
        className={`bg-white shadow-lg rounded-lg p-8 mx-4 max-w-md w-full transform transition-transform duration-700 ease-in-out ${isSignup ? 'rotate-y-180' : ''}`}
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
            {isSignup ? 'Sign up' : 'Log in'}
            <br />
            <span className="text-lg font-light">{isSignup ? 'to get started' : 'to access and manage your templates'}</span>
          </h1>
          <p className="text-black mt-5 font-bold">Welcome to Dynamic Data Generation</p>
        </div>

        {/* Error Message */}
        {/* {error && <p className="text-red-500 text-center">{error}</p>} */}

        {/* Form */}
        <form className="space-y-5" onSubmit={isSignup ? handleSignup : handleLogin}>
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                User Name
                <input
                  id="username"
                  type="text"
                  value={username}
                  required
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="yourname"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              </label>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
              <input
                id="email"
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@example.com"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </label>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Password
              <div className="relative">
                <input
                  id="password"
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 bg-transparent border-none focus:outline-none"
                >
                  {passwordVisible ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>
            </label>
          </div>

          {!isSignup && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember_me" type="checkbox" className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                <label htmlFor="remember_me" className="ml-2 text-sm text-gray-900">Remember me</label>
              </div>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">Forgot password?</a>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full py-3 text-white bg-green-600 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : isSignup ? 'Sign Up' : 'Login'}
            </button>
          </div>
        </form>

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
      <div className="lg:block lg:w-1/2 bg-cover bg-center">
      <img src={LoginImg} width={'90%'} />
      </div>
    </div>
  );
}

export default Login;

