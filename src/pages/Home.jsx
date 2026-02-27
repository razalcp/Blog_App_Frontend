import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getBlogs } from '../store/blogSlice';
import { 
  DocumentTextIcon, 
  ClockIcon, 
  EyeIcon, 
  HeartIcon,
  UserIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const dispatch = useDispatch();
  const { blogs, isLoading, isError, message } = useSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(getBlogs({ limit: 6 }));
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">
          Welcome to BlogHub
        </h1>
        <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto">
          Discover amazing stories, share your thoughts, and connect with a community of passionate writers and readers.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/blogs" className="btn-primary">
            Explore Blogs
          </Link>
          <Link to="/register" className="btn-secondary">
            Join Community
          </Link>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-secondary-900">Latest Blog Posts</h2>
          <Link to="/blogs" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No blog posts yet</h3>
            <p className="text-secondary-600">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
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
                      {blog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-secondary-100 text-secondary-700"
                        >
                          <TagIcon className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
