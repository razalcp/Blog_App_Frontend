import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getBlogs } from '../store/blogSlice';
import { categoryAPI } from '../services/api';
import { 
  DocumentTextIcon, 
  ClockIcon, 
  EyeIcon, 
  HeartIcon,
  UserIcon,
  TagIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const BlogList = () => {
  const dispatch = useDispatch();
  const { blogs, isLoading, isError, message, pagination } = useSelector((state) => state.blogs);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    page: 1,
    limit: 12
  });

  useEffect(() => {
    dispatch(getBlogs(filters));
    fetchCategories();
  }, [dispatch, filters]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleCategoryChange = (e) => {
    setFilters(prev => ({ ...prev, category: e.target.value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  if (isLoading && blogs.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">All Blog Posts</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Search blog posts..."
              value={filters.search}
              onChange={handleSearch}
              className="input-field pl-10"
            />
          </div>
          
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
            <select
              value={filters.category}
              onChange={handleCategoryChange}
              className="input-field pl-10 appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name} ({category.blogCount})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {message}
        </div>
      )}

      {blogs.length === 0 && !isLoading ? (
        <div className="text-center py-12">
          <DocumentTextIcon className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No blog posts found</h3>
          <p className="text-secondary-600">
            {filters.search || filters.category 
              ? 'Try adjusting your search or filters' 
              : 'No blog posts have been published yet'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <article key={blog._id} className="card hover:shadow-md transition-shadow">
                {blog.featuredImage && (
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-48 object-cover rounded-t-xl mb-4"
                  />
                )}
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: blog.category?.color + '20', 
                        color: blog.category?.color 
                      }}
                    >
                      {blog.category?.name}
                    </span>
                    <span className="text-sm text-secondary-500">
                      {blog.status}
                    </span>
                  </div>

                  <Link to={`/blog/${blog._id}`}>
                    <h3 className="text-xl font-semibold text-secondary-900 hover:text-primary-600 transition-colors">
                      {blog.title}
                    </h3>
                  </Link>

                  <p className="text-secondary-600 line-clamp-3">
                    {blog.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-secondary-500">
                    <div className="flex items-center space-x-1">
                      <UserIcon className="h-4 w-4" />
                      <span>{blog.author?.username}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>{blog.readTime} min read</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-secondary-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <EyeIcon className="h-4 w-4" />
                        <span>{blog.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <HeartIcon className="h-4 w-4" />
                        <span>{blog.likes?.length || 0}</span>
                      </div>
                    </div>
                    <div className="text-xs text-secondary-400">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-secondary-100 text-secondary-700"
                        >
                          <TagIcon className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="text-xs text-secondary-500">
                          +{blog.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className="px-3 py-2 rounded-md border border-secondary-300 text-sm font-medium text-secondary-700 bg-white hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="text-sm text-secondary-700">
                Page {filters.page} of {pagination.pages}
              </span>
              
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === pagination.pages}
                className="px-3 py-2 rounded-md border border-secondary-300 text-sm font-medium text-secondary-700 bg-white hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogList;
