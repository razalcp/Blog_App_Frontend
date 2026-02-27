import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, reset } from '../store/authSlice';
import { UserCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isLoading, isError, message, isSuccess } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    avatar: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    const userData = {
      username: formData.username,
      bio: formData.bio,
      avatar: formData.avatar,
    };

    dispatch(updateProfile(userData));
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        username: user.username || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="text-center">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded-md">
          Please log in to view your profile.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-secondary-900">Profile</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
            {message}
          </div>
        )}

        {isSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md mb-4">
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              {formData.avatar ? (
                <img
                  className="h-20 w-20 rounded-full object-cover"
                  src={formData.avatar}
                  alt="Profile"
                />
              ) : (
                <UserCircleIcon className="h-20 w-20 text-secondary-400" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-secondary-900">
                {user.username}
              </h2>
              <div className="flex items-center text-secondary-600">
                <EnvelopeIcon className="h-4 w-4 mr-1" />
                {user.email}
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${
                user.role === 'admin' 
                  ? 'bg-red-100 text-red-800' 
                  : user.role === 'author'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-secondary-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={onChange}
                disabled={!isEditing}
                className={`input-field ${!isEditing ? 'bg-secondary-100 cursor-not-allowed' : ''}`}
              />
            </div>

            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-secondary-700 mb-1">
                Avatar URL
              </label>
              <input
                type="url"
                id="avatar"
                name="avatar"
                value={formData.avatar}
                onChange={onChange}
                disabled={!isEditing}
                placeholder="https://example.com/avatar.jpg"
                className={`input-field ${!isEditing ? 'bg-secondary-100 cursor-not-allowed' : ''}`}
              />
              {isEditing && formData.avatar && (
                <div className="mt-2">
                  <img
                    src={formData.avatar}
                    alt="Avatar preview"
                    className="h-16 w-16 rounded-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-secondary-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={onChange}
                disabled={!isEditing}
                placeholder="Tell us about yourself..."
                className={`input-field resize-none ${!isEditing ? 'bg-secondary-100 cursor-not-allowed' : ''}`}
              />
              <p className="text-sm text-secondary-500 mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-secondary-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary-900">Member Since</p>
              <p className="text-secondary-600">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary-900">Account Status</p>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-3 pt-4 border-t border-secondary-200">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
