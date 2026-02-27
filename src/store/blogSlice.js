import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { blogAPI } from '../services/api';

const initialState = {
  blogs: [],
  currentBlog: null,
  myBlogs: [],
  isLoading: false,
  isError: false,
  message: '',
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

export const createBlog = createAsyncThunk(
  'blogs/createBlog',
  async (blogData, thunkAPI) => {
    try {
      const response = await blogAPI.createBlog(blogData);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create blog';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getBlogs = createAsyncThunk(
  'blogs/getBlogs',
  async (params = {}, thunkAPI) => {
    try {
      const response = await blogAPI.getBlogs(params);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch blogs';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getBlogById = createAsyncThunk(
  'blogs/getBlogById',
  async (id, thunkAPI) => {
    try {
      const response = await blogAPI.getBlogById(id);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch blog';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateBlog = createAsyncThunk(
  'blogs/updateBlog',
  async ({ id, blogData }, thunkAPI) => {
    try {
      const response = await blogAPI.updateBlog(id, blogData);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update blog';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteBlog = createAsyncThunk(
  'blogs/deleteBlog',
  async (id, thunkAPI) => {
    try {
      await blogAPI.deleteBlog(id);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete blog';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getMyBlogs = createAsyncThunk(
  'blogs/getMyBlogs',
  async (params = {}, thunkAPI) => {
    try {
      const response = await blogAPI.getMyBlogs(params);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch my blogs';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBlog.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs.unshift(action.payload.blog);
        state.isError = false;
        state.message = 'Blog created successfully';
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getBlogs.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload.blogs;
        state.pagination = action.payload.pagination;
        state.isError = false;
      })
      .addCase(getBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getBlogById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getBlogById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBlog = action.payload.blog;
        state.isError = false;
      })
      .addCase(getBlogById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateBlog.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.blogs.findIndex(blog => blog._id === action.payload.blog._id);
        if (index !== -1) {
          state.blogs[index] = action.payload.blog;
        }
        if (state.currentBlog && state.currentBlog._id === action.payload.blog._id) {
          state.currentBlog = action.payload.blog;
        }
        state.isError = false;
        state.message = 'Blog updated successfully';
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteBlog.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = state.blogs.filter(blog => blog._id !== action.payload);
        state.myBlogs = state.myBlogs.filter(blog => blog._id !== action.payload);
        state.isError = false;
        state.message = 'Blog deleted successfully';
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getMyBlogs.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getMyBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myBlogs = action.payload.blogs;
        state.pagination = action.payload.pagination;
        state.isError = false;
      })
      .addCase(getMyBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearCurrentBlog } = blogSlice.actions;
export default blogSlice.reducer;
