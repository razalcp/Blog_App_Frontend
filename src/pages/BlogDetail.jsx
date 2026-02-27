import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getBlogById } from '../store/blogSlice';
import { commentAPI, likeAPI } from '../services/api';
import ReactMarkdown from 'react-markdown';
import { 
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  UserIcon,
  ClockIcon,
  EyeIcon,
  TagIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const BlogDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { currentBlog, isLoading, isError, message } = useSelector((state) => state.blogs);
  const { user } = useSelector((state) => state.auth);
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likeStatus, setLikeStatus] = useState({ isLiked: false, likeType: null });
  const [likeCount, setLikeCount] = useState(0);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    dispatch(getBlogById(id));
    fetchComments();
    fetchLikeStatus();
  }, [dispatch, id]);

  useEffect(() => {
    if (currentBlog) {
      setLikeCount(currentBlog.likes?.length || 0);
    }
  }, [currentBlog]);

  const fetchComments = async () => {
    try {
      const response = await commentAPI.getCommentsByBlog(id);
      setComments(response.data.data.comments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const fetchLikeStatus = async () => {
    if (user) {
      try {
        const response = await likeAPI.getUserLikeStatus(id);
        setLikeStatus(response.data.data);
      } catch (error) {
        console.error('Failed to fetch like status:', error);
      }
    }
  };

  const handleLike = async () => {
    if (!user) {
      return;
    }

    try {
      const response = await likeAPI.toggleLike({
        blog: id,
        type: likeStatus.likeType === 'like' ? 'dislike' : 'like'
      });

      setLikeStatus({
        isLiked: response.data.data.isLiked,
        likeType: response.data.data.likeType
      });
      setLikeCount(response.data.data.likeCount);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim() || !user) {
      return;
    }

    setIsSubmittingComment(true);

    try {
      const response = await commentAPI.createComment({
        content: newComment,
        blog: id
      });

      setComments(prev => [response.data.data.comment, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isError || !currentBlog) {
    return (
      <div className="text-center">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
          {message || 'Blog post not found'}
        </div>
        <Link to="/blogs" className="btn-primary">
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/blogs" className="btn-secondary inline-flex items-center mb-6">
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Blogs
      </Link>

      <article className="card">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span 
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              style={{ 
                backgroundColor: currentBlog.category?.color + '20', 
                color: currentBlog.category?.color 
              }}
            >
              {currentBlog.category?.name}
            </span>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              currentBlog.status === 'published' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {currentBlog.status}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            {currentBlog.title}
          </h1>

          <div className="flex items-center justify-between text-secondary-600 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {currentBlog.author?.avatar ? (
                  <img
                    src={currentBlog.author.avatar}
                    alt={currentBlog.author.username}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-8 w-8 text-secondary-400" />
                )}
                <div>
                  <p className="font-medium text-secondary-900">
                    {currentBlog.author?.username}
                  </p>
                  <p className="text-sm text-secondary-500">
                    {new Date(currentBlog.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center space-x-1">
                <ClockIcon className="h-4 w-4" />
                <span>{currentBlog.readTime} min read</span>
              </div>
              <div className="flex items-center space-x-1">
                <EyeIcon className="h-4 w-4" />
                <span>{currentBlog.views} views</span>
              </div>
            </div>
          </div>

          {currentBlog.featuredImage && (
            <img
              src={currentBlog.featuredImage}
              alt={currentBlog.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}

          {currentBlog.tags && currentBlog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {currentBlog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary-100 text-secondary-700"
                >
                  <TagIcon className="h-4 w-4 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-lg max-w-none">
          <ReactMarkdown>{currentBlog.content}</ReactMarkdown>
        </div>

        <footer className="mt-8 pt-6 border-t border-secondary-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                disabled={!user}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  user 
                    ? likeStatus.isLiked && likeStatus.likeType === 'like'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                    : 'bg-secondary-100 text-secondary-400 cursor-not-allowed'
                }`}
              >
                {likeStatus.isLiked && likeStatus.likeType === 'like' ? (
                  <HeartSolidIcon className="h-5 w-5" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
                <span>{likeCount}</span>
              </button>

              <div className="flex items-center space-x-2 text-secondary-600">
                <ChatBubbleLeftIcon className="h-5 w-5" />
                <span>{comments.length}</span>
              </div>
            </div>

            <button className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600">
              <ShareIcon className="h-5 w-5" />
              <span>Share</span>
            </button>
          </div>
        </footer>
      </article>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-secondary-900 mb-6">Comments</h2>

        {user ? (
          <div className="card mb-8">
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="input-field resize-none"
                required
              />
              <button
                type="submit"
                disabled={isSubmittingComment || !newComment.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          </div>
        ) : (
          <div className="card bg-secondary-50 mb-8">
            <p className="text-secondary-600">
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Log in
              </Link>{' '}
              to leave a comment.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <ChatBubbleLeftIcon className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
              <p className="text-secondary-600">No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="card">
                <div className="flex items-start space-x-4">
                  {comment.author?.avatar ? (
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.username}
                      className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <UserIcon className="h-10 w-10 text-secondary-400 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-secondary-900">
                        {comment.author?.username}
                      </h4>
                      <span className="text-sm text-secondary-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-secondary-700 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
