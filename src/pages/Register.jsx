import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, reset } from '../store/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'reader',
  });

  const { username, email, password, confirmPassword, role } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    if (user) {
      navigate('/');
    }

    return () => {
      dispatch(reset());
    };
  }, [user, isError, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    if (!username || !email || !password) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    if (password.length < 6) {
      return;
    }

    const userData = {
      username,
      email,
      password,
      role,
    };

    dispatch(register(userData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-secondary-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-secondary-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-secondary-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 input-field"
                placeholder="Enter your username"
                value={username}
                onChange={onChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 input-field"
                placeholder="Enter your email"
                value={email}
                onChange={onChange}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-secondary-700">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={onChange}
                className="mt-1 input-field"
              >
                <option value="reader">Reader</option>
                <option value="author">Author</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 input-field"
                placeholder="Enter your password"
                value={password}
                onChange={onChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 input-field"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={onChange}
              />
            </div>
          </div>

          {isError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {message}
            </div>
          )}

          {password !== confirmPassword && confirmPassword && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded-md text-sm">
              Passwords do not match
            </div>
          )}

          {password && password.length < 6 && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded-md text-sm">
              Password must be at least 6 characters long
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || password !== confirmPassword || password.length < 6}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
