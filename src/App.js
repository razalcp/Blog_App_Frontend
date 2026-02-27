import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { useDispatch } from 'react-redux';
import { getMe, setUser } from './store/authSlice';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import AdminDashboard from './pages/AdminDashboard';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      dispatch(setUser(JSON.parse(user)));
      dispatch(getMe());
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/blogs" element={<Layout><BlogList /></Layout>} />
      <Route path="/blog/:id" element={<Layout><BlogDetail /></Layout>} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/profile" element={<Layout><Profile /></Layout>} />
      <Route path="/create-blog" element={<Layout><CreateBlog /></Layout>} />
      <Route path="/edit-blog/:id" element={<Layout><EditBlog /></Layout>} />
      <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
    </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </Router>
    </Provider>
  );
}

export default App;
