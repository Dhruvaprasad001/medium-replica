import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import { Signin } from './pages/Signin';
import { Blog } from './pages/Blog';
import { Signup } from './pages/Signup';
import { Blogs } from './pages/Blogs';
import { Publish } from './pages/Publish';
import { Author } from './pages/Author';
import { AppBar } from './components/AppBar';

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const hideAppBar = location.pathname === '/signin' || location.pathname === '/signup';

  return (
    <div>
      {!hideAppBar && <AppBar />}
      {children}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/blog/title/:title" element={<Blog />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/publish" element={<Publish />} />
          <Route path="/author/:authorId" element={<Author />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
