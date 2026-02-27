import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBlog, reset } from '../store/blogSlice';
import { categoryAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  DocumentTextIcon,
  TagIcon,
  ArrowDownTrayIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const CreateBlog = () => {
  const dispatch = useDispatch();
  const { isLoading, isError, message, isSuccess } = useSelector((state) => state.blogs);

  // Static categories as fallback
  const staticCategories = [
    { _id: 'technology', name: 'Technology' },
    { _id: 'programming', name: 'Programming' },
    { _id: 'web-development', name: 'Web Development' },
    { _id: 'data-science', name: 'Data Science' },
    { _id: 'design', name: 'Design' },
    { _id: 'business', name: 'Business' },
    { _id: 'lifestyle', name: 'Lifestyle' },
    { _id: 'travel', name: 'Travel' }
  ];

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    featuredImage: '',
    status: 'draft'
  });

  const [categories, setCategories] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    fetchCategories();
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  // Debug: Log Redux state
  useEffect(() => {
    console.log('Redux blog state:', { isLoading, isError, message, isSuccess });
  }, [isLoading, isError, message, isSuccess]);

  useEffect(() => {
    if (isSuccess) {
      console.log('Blog creation successful, clearing form...');
      toast.success('Blog created successfully!', { id: 'createBlog' });
      // Clear the form
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        tags: [],
        featuredImage: '',
        status: 'draft'
      });
      setTagInput('');
      // Reset the blog slice state
      dispatch(reset());
    }
  }, [isSuccess, dispatch]);

  // Debug: Log categories state
  // useEffect(() => {
  // console.log('Categories state:', categories);
  // console.log('Static categories:', staticCategories);
  // }, [categories]);

  useEffect(() => {
    if (isError && message) {
      toast.error(message, { id: 'createBlog' });
    }
  }, [isError, message]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories from API, using static categories:', error);
      // Use static categories as fallback
      setCategories(staticCategories);
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const addTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const blogData = {
      ...formData,
      status: e.nativeEvent.submitter.value === 'publish' ? 'published' : 'draft'
    };

    console.log('Submitting blog data:', blogData);

    // Show loading toast
    const action = blogData.status === 'published' ? 'Publishing' : 'Saving';
    toast.loading(`${action} blog...`, { id: 'createBlog' });

    dispatch(createBlog(blogData));

    // Manual form reset as backup
    setTimeout(() => {
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        tags: [],
        featuredImage: '',
        status: 'draft'
      });
      setTagInput('');
      console.log('Manual form reset executed');
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-secondary-900">Create New Blog Post</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="btn-secondary flex items-center"
          >
            <EyeIcon className="h-5 w-5 mr-2" />
            {isPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
          {message}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="card">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-secondary-700 mb-1">
                Blog Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={onChange}
                required
                className="input-field"
                placeholder="Enter your blog title"
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-secondary-700 mb-1">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={3}
                value={formData.excerpt}
                onChange={onChange}
                className="input-field resize-none"
                placeholder="Brief description of your blog post (optional)"
              />
              <p className="text-sm text-secondary-500 mt-1">
                {formData.excerpt.length}/500 characters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-secondary-700 mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={onChange}
                  required
                  className="input-field"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id || category.id} value={category._id || category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="featuredImage" className="block text-sm font-medium text-secondary-700 mb-1">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  id="featuredImage"
                  name="featuredImage"
                  value={formData.featuredImage}
                  onChange={onChange}
                  className="input-field"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-secondary-700 mb-1">
                Tags
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag(e)}
                  className="input-field flex-1"
                  placeholder="Add tags (press Enter)"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="btn-secondary"
                >
                  <TagIcon className="h-5 w-5" />
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary-100 text-secondary-700"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-secondary-400 hover:text-secondary-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <label htmlFor="content" className="block text-sm font-medium text-secondary-700 mb-1">
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            rows={20}
            value={formData.content}
            onChange={onChange}
            required
            className="input-field resize-none font-mono text-sm"
            placeholder="Write your blog content here..."
          />
          <p className="text-sm text-secondary-500 mt-1">
            {formData.content.length} characters
          </p>
        </div>

        <div className="flex justify-center space-x-4 pt-6">
          <button
            type="submit"
            value="draft"
            disabled={isLoading || !formData.title || !formData.content || !formData.category}
            className="px-6 py-3 bg-secondary-600 text-white font-medium rounded-lg hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors duration-200"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Save Draft
          </button>
          <button
            type="submit"
            value="publish"
            disabled={isLoading || !formData.title || !formData.content || !formData.category}
            className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors duration-200"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Publish
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
