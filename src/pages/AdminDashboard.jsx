import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  UsersIcon,
  DocumentTextIcon,
  FolderIcon,
  ChartBarIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Random categories for blogs without categories
  const randomCategories = [
    'Technology', 'Programming', 'Web Development', 'Data Science', 
    'Design', 'Business', 'Lifestyle', 'Travel', 'Science', 'Health',
    'Education', 'Entertainment', 'Sports', 'Food', 'Music'
  ];

  const getRandomCategory = () => {
    return randomCategories[Math.floor(Math.random() * randomCategories.length)];
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'blogs') {
      fetchBlogs();
    }
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      setStats(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard stats');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers();
      setUsers(response.data.data.users);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllBlogs();
      setBlogs(response.data.data.blogs);
    } catch (error) {
      toast.error('Failed to fetch blogs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This will also delete all their blogs.')) {
      return;
    }

    try {
      await adminAPI.deleteUser(userId);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
      console.error(error);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      await adminAPI.deleteBlog(blogId);
      toast.success('Blog deleted successfully');
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to delete blog');
      console.error(error);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await adminAPI.updateUser(userId, { role: newRole });
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user role');
      console.error(error);
    }
  };

  const handleToggleUserStatus = async (userId, isActive) => {
    try {
      await adminAPI.updateUser(userId, { isActive: !isActive });
      toast.success(`User ${isActive ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
      console.error(error);
    }
  };

  if (loading && activeTab === 'dashboard') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-secondary-900">Admin Dashboard</h1>
        <p className="text-secondary-600 mt-2">Manage users, blogs, and categories</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-secondary-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
            { id: 'users', name: 'Users', icon: UsersIcon },
            { id: 'blogs', name: 'Blogs', icon: DocumentTextIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && stats && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-100 rounded-lg p-3">
                  <UsersIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Total Users</p>
                  <p className="text-2xl font-bold text-secondary-900">{stats.stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                  <DocumentTextIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Total Blogs</p>
                  <p className="text-2xl font-bold text-secondary-900">{stats.stats.totalBlogs}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
                  <FolderIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Categories</p>
                  <p className="text-2xl font-bold text-secondary-900">{stats.stats.totalCategories}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Users</h3>
              <div className="space-y-3">
                {stats.recentUsers.map((recentUser) => (
                  <div key={recentUser._id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <UserCircleIcon className="h-8 w-8 text-secondary-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-secondary-900">{recentUser.username}</p>
                        <p className="text-xs text-secondary-500">{recentUser.email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      recentUser.role === 'admin' ? 'bg-red-100 text-red-800' :
                      recentUser.role === 'author' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {recentUser.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Blogs</h3>
              <div className="space-y-3">
                {stats.recentBlogs.map((blog) => (
                  <div key={blog._id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-secondary-900">{blog.title}</p>
                      <p className="text-xs text-secondary-500">by {blog.author ? blog.author.username : 'Unknown Author'}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {blog.category ? blog.category.name : getRandomCategory()}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {blog.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">All Users</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {users.map((userItem) => (
                  <tr key={userItem._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserCircleIcon className="h-8 w-8 text-secondary-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-secondary-900">{userItem.username}</div>
                          <div className="text-sm text-secondary-500">{userItem.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={userItem.role}
                        onChange={(e) => handleUpdateUserRole(userItem._id, e.target.value)}
                        className="text-sm border border-secondary-300 rounded px-2 py-1"
                        disabled={userItem._id === user.id}
                      >
                        <option value="reader">Reader</option>
                        <option value="author">Author</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleUserStatus(userItem._id, userItem.isActive)}
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          userItem.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                        disabled={userItem._id === user.id}
                      >
                        {userItem.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                      {new Date(userItem.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteUser(userItem._id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={userItem._id === user.id}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Blogs Tab */}
      {activeTab === 'blogs' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">All Blogs</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Blog
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {blogs.map((blog) => (
                  <tr key={blog._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-secondary-900">{blog.title}</div>
                        <div className="text-sm text-secondary-500 truncate max-w-xs">
                          {blog.excerpt || blog.content.substring(0, 100)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                      {blog.author ? blog.author.username : 'Unknown Author'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                        {blog.category ? blog.category.name : getRandomCategory()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteBlog(blog._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
