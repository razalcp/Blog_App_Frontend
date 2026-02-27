import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMyBlogs } from '../store/blogSlice';
import {
  DocumentTextIcon,
  EyeIcon,
  ChartBarIcon,
  PlusIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myBlogs, isLoading, isError, message } = useSelector((state) => state.blogs);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    totalViews: 0,
    totalLikes: 0
  });

  useEffect(() => {
    dispatch(getMyBlogs());
  }, [dispatch]);

  useEffect(() => {
    if (myBlogs.length > 0) {
      const total = myBlogs.length;
      const published = myBlogs.filter(blog => blog.status === 'published').length;
      const drafts = myBlogs.filter(blog => blog.status === 'draft').length;
      const totalViews = myBlogs.reduce((sum, blog) => sum + blog.views, 0);
      const totalLikes = myBlogs.reduce((sum, blog) => sum + (blog.likes?.length || 0), 0);

      setStats({
        total,
        published,
        drafts,
        totalViews,
        totalLikes
      });
    }
  }, [myBlogs]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
          <p className="text-secondary-600 mt-1">
            Welcome back, {user?.username}! Manage your blog posts here.
          </p>
        </div>
        <Link to="/create-blog" className="btn-primary flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Create New Blog
        </Link>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary-100 rounded-lg p-3">
              <DocumentTextIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Posts</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Published</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.published}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
              <DocumentTextIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Drafts</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.drafts}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
              <EyeIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Views</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.totalViews}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-secondary-900 mb-4">Your Blog Posts</h2>

        {myBlogs.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No blog posts yet</h3>
            <p className="text-secondary-600 mb-4">Start creating your first blog post!</p>
            {/* <Link to="/create-blog" className="btn-primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Your First Blog
            </Link> */}
            <Link
              to="/create-blog"
              className="btn-primary inline-flex items-center justify-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              <span>Create Your First Blog</span>
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow-sm border border-secondary-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Likes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {myBlogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <Link
                          to={`/blog/${blog._id}`}
                          className="text-sm font-medium text-secondary-900 hover:text-primary-600"
                        >
                          {blog.title}
                        </Link>
                        <p className="text-sm text-secondary-500 line-clamp-1">
                          {blog.excerpt}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${blog.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                      {blog.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                      {blog.likes?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/edit-blog/${blog._id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
